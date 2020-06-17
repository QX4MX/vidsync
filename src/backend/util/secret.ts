import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;

export const MONGODB_URI = process.env.MONGODB_URI;
//"mongodb://localhost:27017/vidsyncdb";
//"mongodb://mongodb.default.svc.cluster.local:27017/vidsyncdb";

if (!MONGODB_URI) {
    console.log("No MONGODB_URI secret string. Set MONGODB_URI env variable.");
    process.exit(1);
}

export const ytApi = process.env.ytApi;