// let env: any = "dev"; // Declare and initialize env before usage

interface Config_Interface {
    API_DOMAIN_URL: string;
    GOOGLE_API_KEY: string;
    SOCKET_IO_URL: string;
}

class Config implements Config_Interface {
    API_DOMAIN_URL: string = "";
    GOOGLE_API_KEY: string = "";
    SOCKET_IO_URL: string = "";
    constructor() { }
}

const config: Config = new Config();

let env = process.env.NODE_ENV || "development"; // Using NODE_ENV to determine the environment

// Set the values based on the environment
if (env === "production") {
    config.API_DOMAIN_URL = "http://13.201.99.242:4000"; // Update with your public backend URL
    config.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
    config.SOCKET_IO_URL = "http://13.201.99.242:4000"; // Update Socket URL if using WebSockets
} else {
    config.API_DOMAIN_URL = "http://192.168.125.200:3000"; // Keep local dev URL
    config.GOOGLE_API_KEY = "AIzaSyA9qviqi7tO8nndT6WAP_O5qr3NrfpILl0";
    config.SOCKET_IO_URL = "http://192.168.125.200:3000";
}

export default config;

export const origin = env === "production" ? "http://13.201.99.242:4000" : "http://192.168.29.87:4000";
export const userCookie = "userToken";
