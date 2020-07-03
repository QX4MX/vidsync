import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;

export const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.log("No MONGODB_URI secret string. Set MONGODB_URI env variable.");
    process.exit(1);
}

export const ytApi = process.env.ytApi;

export const recaptchaSecret = process.env.recaptchaSecret;

export const ADMINPW = process.env.ADMINPW;

export const jwtSecret = process.env.jwtSecret;