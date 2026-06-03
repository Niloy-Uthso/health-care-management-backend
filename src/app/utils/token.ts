import { JwtPayload, SignOptions } from "jsonwebtoken";
import { JwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { CookieUtils } from "./cookie";
import ms, { StringValue } from "ms";
import { Response } from "express";

const getAccessToken = (payload:JwtPayload) => {


    const accessToken = JwtUtils.createToken(payload,envVars.ACCESS_TOKEN_SECRET,{expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN} as SignOptions);
    return accessToken;
}

const getRefreshToken = (payload:JwtPayload) => {
    const refreshToken = JwtUtils.createToken(payload,envVars.REFRESH_TOKEN_SECRET,{expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN} as SignOptions);
    return refreshToken;
}

const setAccessTokenCookie = (res:Response,token: string)=>{
     CookieUtils.setCookie(res,"accessToken",token,{
        httpOnly: true,
        secure:true,
        sameSite:"none",
        path:"/",
        //1 day
        maxAge:  60 * 60 * 60 * 24
    })
}

const setRefreshTokenCookie = (res:Response,token: string)=>{
     CookieUtils.setCookie(res,"refreshToken",token,{   
        httpOnly: true,
        secure:true,
        sameSite:"none",
        path:"/",
        //7 days
        maxAge:  60 * 60 * 60 * 24 * 7
    })
    } 

  const setBetterAuthSessionCookies = (res:Response,token:string)=>{
     CookieUtils.setCookie(res,"better-auth.session_token",token,{
        httpOnly: true,
        secure:true,
        sameSite:"none",
        path:"/",
        maxAge: 60 * 60 * 60 * 24
    })
}


export const TokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookies
}
