import dotenv from 'dotenv';
import AppError from '../app/errorHandlers/handleErrors';
import status from 'http-status';
dotenv.config();

interface EnvConfig{
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
    BETTER_AUTH_SESSION_EXPIRES_IN: string;
}

const loadEnv = (): EnvConfig => {
 
    const requiredEnvVariable= [
        'NODE_ENV',
        'PORT',
        'DATABASE_URL',
        'BETTER_AUTH_SECRET',
        'BETTER_AUTH_URL',
        'ACCESS_TOKEN_SECRET',
        'REFRESH_TOKEN_SECRET',
        'ACCESS_TOKEN_EXPIRES_IN',
        'REFRESH_TOKEN_EXPIRES_IN',
        'BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE',
        'BETTER_AUTH_SESSION_EXPIRES_IN' 
    ]
    requiredEnvVariable.forEach((envVar)=>{
        if(!process.env[envVar]){
            // throw new Error(`Environment variable ${envVar} is required but not defined.`);
         throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${envVar} is required but not defined.`)
        }})


    return{
        NODE_ENV: process.env.NODE_ENV as  string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
        BETTER_AUTH_SESSION_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_EXPIRES_IN as string
    }
}

export const envVars = loadEnv();