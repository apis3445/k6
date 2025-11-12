export interface LoginResponse {
    Token: string;
    TokenExpiration: string;
    UserId: number;
    Name: string;
    Email: string;
    RefreshToken: string;
    Company: string;
    CompanyKey: number;
}