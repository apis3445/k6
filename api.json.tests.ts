import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import http from 'k6/http';
import { SharedArray } from 'k6/data'
import { UserCredential } from './types/UserCredential.ts';
import { check } from 'k6';

interface LoginResponse {
    Token: string;
    TokenExpiration: string;
    UserId: number;
    Name: string;
    Email: string;
    RefreshToken: string;
    Company: string;
    CompanyKey: number;
}

interface Server {
    Id: number;
    Key: string;
}

const userCredentials = new SharedArray<UserCredential>('users', function () {
    return JSON.parse(open('./users.json')).users
});

export const options = {
    vus: 1,
    duration: '10s',
    cloud: {
        projectID: 5193201
    }
}
export default async function () {

    userCredentials.forEach((item) => {
        const body = {
            Company: item.Company,
            UserName: item.UserName,
            Password: item.Password
        }

        const params = {
            headers: {
                'Content-Type': 'application/json',
            },
            tags: {
                name: 'login'
            }
        }
        let response = http.post('https://effizienteauthdemo.azurewebsites.net/api/Users/Login',
            JSON.stringify(body), params);
        check(response, {
            'status is 200': () => response.status === 200,
        });

        if (response.status !== 200 || !response.body) {
            console.error(`Login failed with status ${response.status}: ${response.body}`);
            return;
        }

        const bodyResponse = response.json() as unknown as LoginResponse;
        const token = bodyResponse.Token;

        const authHeaders = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }

        }

        response = http.get('https://effizienteauthdemo.azurewebsites.net/api/Server', authHeaders);

        if (response.status !== 200 || !response.body) {
            console.error(`Get servers failed with status ${response.status}: ${response.body}`);
            return;
        }
        check(response, {
            'status is 200': () => response.status === 200,
        });
        const serverResponse = response.json() as unknown as Server[];

        const serverIds = serverResponse.map((server) => server.Id);
        const serverId = randomItem(serverIds);


        const serverParams = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            tags: {
                name: 'server'
            }

        }

        response = http.get(`https://effizienteauthdemo.azurewebsites.net/api/Server/${serverId}`, serverParams);

        if (response.status !== 200 || !response.body) {
            console.error(`Get server ${serverId} failed with status ${response.status}: ${response.body}`);
            return;
        }
        check(response, {
            'status is 200': () => response.status === 200,
        });
    })
}
