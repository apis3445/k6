import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export const options: Options = {
    vus: 10,
    duration: '30s',
    thresholds: {
        // Trend metrics - http_req_duration (no 'value' threshold for trends)
        http_req_duration: [
            'p(95)<500',           // 95% of requests under 500ms
            'max<2000',            // No request over 2 seconds
            'avg<300'              // Average response time under 300ms
        ],

        // Counter metrics - accumulating totals and rates
        http_reqs: [
            'count > 50',          // Total requests should exceed 50
            'rate > 5'             // Request rate should be over 5 req/sec
        ],

        http_req_failed: [
            'rate<0.1'             // Error rate should be under 10%
        ],

        vus: [
            'value >= 8',          // Minimum of 8 virtual users
            'value <= 10'          // Maximum of 12 virtual users
        ]
    }
}

export default () => {
    const response = http.get('https://quickpizza.grafana.com', {
        headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'User-Agent': 'k6-load-test'
        }
    });

    check(response, {
        'status is 200': () => response.status === 200,
        'body is not empty': () => typeof response.body === 'string' && response.body.length > 0,
        'response time < 1000ms': () => response.timings.duration < 1000,
    });

    sleep(1);
};