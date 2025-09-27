import http from 'k6/http'
import { group, check } from 'k6'
import exec from 'k6/execution'

export const options = {
    vus: 1,
    duration: '3s',
    thresholds: {
        http_req_duration: ['p(95)<350'],
        'http_req_duration{expected_response:true}': ['p(95)<350'],
        'group_duration{group:::Main page}': ['p(95)<300'],
        'group_duration{group:::Admin page}': ['p(95)<250'],
        http_req_failed: ['rate<0.1'], // Less than 10% of requests should fail
        checks: ['rate>0.9'], // More than 90% of checks should pass
    }
}

export function setup() {
    let res = http.get('https://quickpizza.grafana.com')
    if (res.error) {
        exec.test.abort("Aborting test: Setup request failed.")
    }
}

export default function () {
    group('Main page', function () {
        let res = http.get('https://quickpizza.grafana.com', {
            tags: { page: 'main' }
        })

        // Check if the request was successful
        check(res, {
            'main page status is 200': (r) => r.status === 200,
            'main page response time < 500ms': (r) => r.timings.duration < 500,
        })
    })

    group('Admin page', function () {
        let res = http.get('https://quickpizza.graf1ana.com/admin', {
            tags: { page: 'admin' }
        })

        // Check if the request was successful
        check(res, {
            'admin page status is 200': (r) => r.status === 200,
            'admin page response time < 500ms': (r) => r.timings.duration < 500,
            'admin page has valid response': (r) => r.status !== 0, // 0 indicates network error
        })
    })
}