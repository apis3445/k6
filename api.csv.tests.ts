import { SharedArray } from "k6/data";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js'
import http from "k6/http";

const userCredentials = new SharedArray('users with credentials', function () {
    return papaparse.parse(open('users.csv'), { header: true }).data
});

export default function () {
    userCredentials.forEach(item => {
        const body = {
            Company: item.Company,
            UserName: item.Username,
            Password: item.Password
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        let response = http.post('https://effizienteauthdemo.azurewebsites.net/api/Users/Login', JSON.stringify(body), headers);

        if (response.status !== 200 || !response.body) {
            console.error(`Login failed with status ${response.status}: ${response.body}`);
            return;
        }
    })
}