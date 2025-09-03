import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { Counter, Trend } from 'k6/metrics';

let myCounter = new Counter('my_counter');

export const options: Options = {
    vus: 10,
    duration: '1m',
    // k6 Cloud metadata
    ext: {
        cloud: {
            name: 'Load Test - Threshold Demo',
            note: 'Testing response time thresholds and error injection',
            projectID: 1301787
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<1000', 'max<4000'],    // More realistic response time thresholds
        http_reqs: ['count > 500', 'rate > 0.8'],         // Expect ~1 request per second per VU, with some margin
        http_req_failed: ['rate<0.1'],                    // Keep error threshold
        'iteration_duration': ['p(95)<3000', 'max<5000'], // More lenient iteration duration
        my_counter: ['count >= 15'] // Expect at least 100 increments in the counter
    },
    // Global tags
    tags: {
        testType: 'load-test',
        environment: 'demo'
    }
};

export default () => {
    const response = http.get('https://quickpizza.grafana.com', {
        headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'User-Agent': 'k6-cloud-test-by-abigail'
        },
        // Request-level tags for detailed analysis
        tags: {
            endpoint: 'homepage',
            critical: 'true'
        }
    });
    myCounter.add(1);
    check(response, {
        'status is 200': () => response.status === 200,
        'body is not empty': () => response.body ? (typeof response.body === 'string' ? response.body.length > 0 : response.body.byteLength > 0) : false,
        'response time < 1000ms': () => response.timings.duration < 1000,
    }, {
        // Check-level tags
        validation_type: 'basic'
    });

    sleep(.5);
};