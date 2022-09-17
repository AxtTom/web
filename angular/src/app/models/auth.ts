

export interface Auth {
    method: "password" | "refresh_token";
    username?: string;
    password?: string;
    refreshToken?: string;
}