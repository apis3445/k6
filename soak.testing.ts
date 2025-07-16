import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export const options: Options = {
    stages: [
        {
            duration: '5m',
            target: 1000
        },
        {
            duration: '12h',
            target: 1000
        },
        {
            duration: '5m',
            target: 0
        }
    ]
}

export default () => {
    const res = http.get('https://quickpizza.grafana.com');
    sleep(1)
    check(res, {
        'status is 200': () => res.status === 200,
    });
    sleep(1);
    const adminResponse = http.get("https://quickpizza.grafana.com/admin");
    check(adminResponse, {
        'status is 200': () => adminResponse.status === 200,
    });
};