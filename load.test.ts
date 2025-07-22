import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export const options: Options = {
    stages: [
        {
            duration: '1s',
            target: 1
        },
        // {
        //     duration: '30s',
        //     target: 10
        // },
        // {
        //     duration: '10s',
        //     target: 0
        // }
    ]
}

export default () => {
    const res = http.get('https://quickpizza.grafana.com', {
        headers: {
            'Accept-Encoding': 'gzip, deflate, br',
            'User-Agent': 'k6-load-test'
        }
    });

    check(res, {
        'status is 200': () => res.status === 200,
        'body is not empty': () => res.body ? (typeof res.body === 'string' ? res.body.length > 0 : res.body.byteLength > 0) : false,
    });

    sleep(1);

    const adminResponse = http.get("https://quickpizza.grafana.com/admin");
    check(adminResponse, {
        'status is 200': () => adminResponse.status === 200,
    });
};