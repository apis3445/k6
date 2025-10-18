import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export let options: Options = {
    stages: [
        { duration: '2h', target: 10000 }
    ],
};

export default () => {
    const res = http.get('https://quickpizza.grafana.com');
    sleep(randomIntBetween(1, 3));
    check(res, {
        'status is 200': () => res.status === 200,
    });
    sleep(randomIntBetween(1, 3));
    const adminResponse = http.get("https://quickpizza.grafana.com/admin");
    check(adminResponse, {
        'status is 200': () => adminResponse.status === 200,
    });
};