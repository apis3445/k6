import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export const options = {
    // Key configurations for Stress in this section
    stages: [
        { duration: '10m', target: 200 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
        { duration: '30m', target: 200 }, // stay at higher 200 users for 30 minutes
        { duration: '5m', target: 0 }, // ramp-down to 0 users
    ],
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