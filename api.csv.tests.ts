import { SharedArray } from "k6/data";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js'
import http from "k6/http";
import { UserCredential } from "./types/UserCredential.ts";

export const options = {
    vus: 1,
    duration: '3s',
};

const userCredentials = new SharedArray<UserCredential>('users with credentials', function () {
    const csvData = papaparse.parse(open('users.csv'), { header: true }).data;
    // Map CSV fields (Username) to interface fields (UserName)
    return csvData.map((row: any) => ({
        Company: row.Company,
        UserName: row.UserName,
        Password: row.Password
    }));
});

export default function () {
    userCredentials.forEach(item => {
        const body = {
            Company: item.Company,
            UserName: item.UserName,
            Password: item.Password
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        let response = http.post('https://effizienteauthdemo.azurewebsites.net/api/Users/Login', JSON.stringify(body), headers);

        if (response.status !== 200 || !response.body) {
            console.error(`Login failed with status ${response.status}: ${response.body} company: ${body.Company} user: ${body.UserName}`);
            return;
        }
    })
}