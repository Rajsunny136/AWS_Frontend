const env: any = "dev"; // Declare and initialize env before usage

/* eslint-disable @typescript-eslint/no-unused-vars */
interface Config_Interface {
    API_DOMAIN_URL: string;
    GOOGLE_API_KEY: string;
    SOCKET_IO_URL: string;
}

class Config implements Config_Interface {
    API_DOMAIN_URL: string = "";
    GOOGLE_API_KEY: string = "";
    SOCKET_IO_URL: string = "";
    constructor() {}
}

const config: Config = new Config();

config.API_DOMAIN_URL = "http://192.168.246.199:3000";
config.GOOGLE_API_KEY = "AIzaSyA9qviqi7tO8nndT6WAP_O5qr3NrfpILl0";
config.SOCKET_IO_URL = env === "prod" ? "" : "http://192.168.246.199:3000"; 

export default config;

export const origin = env === "prod" ? "" :"http://192.168.246.199:3000";
export const userCookie = "userToken";