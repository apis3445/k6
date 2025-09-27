import { check } from 'k6';
import http from 'k6/http';
import { Counter } from 'k6/metrics';

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        'http_req_duration{url:https://quickpizza.grafana.com}': ['p(95)<200'],
        'http_req_duration{url:https://quickpizza.grafana.com/admin}': ['p(95)<500'],
        // Threshold for any URL ending with "admin" using custom tags
        'http_req_duration{endpoint_type:admin}': ['p(95)<600', 'max<2000'],
        'http_req_failed{endpoint_type:admin}': ['rate<0.05'],
        checks: ['rate>=0.99'],
        'checks{page:admin}': ['rate>=0.95'],
        'http_errors{page:admin}': ['count==0'],
    }
}

let httpErrors = new Counter('http_errors');

export default function () {
    let res = http.get('https://quickpizza.grafana.com');

    check(res, {
        'status is 200': (r) => r.status === 200,
    })

    // Tag requests to admin endpoints
    res = http.get('https://quickpizza.grafana.com/admin', {
        tags: { endpoint_type: 'admin', page: 'admin' }
    });

    if (res.error) {
        httpErrors.add(1, { oage: 'admin' })
    }

    check(res, { 'status is 200': (r) => r.status === 200, }, { page: 'admin' })
}