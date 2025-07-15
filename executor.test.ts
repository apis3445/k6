import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export let options: Options = {
    scenarios: {
        ui: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 100 },
                { duration: '2m', target: 200 },
            ],
            gracefulRampDown: '15s'
        }
    }
};

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