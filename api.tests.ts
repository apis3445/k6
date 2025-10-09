import http from 'k6/http';
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


export const options = {
    vus: 1,
    duration: '3s'
}
export default async function () {

    const body = JSON.stringify({
        Company: "Demo",
        UserName: "Admin",
        Password: "Admin"
    });

    const headers = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    let response = http.post('https://effizienteauthdemo.azurewebsites.net/api/Users/Login', body, headers);
    const bodyResponse = response.json() as unknown as LoginResponse;
    const token = bodyResponse.Token;

    const authHeaders = {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }
    response = http.get('https://effizienteauthdemo.azurewebsites.net/api/Server', authHeaders);
    const serverResponse = response.json()
    console.log(serverResponse);
}