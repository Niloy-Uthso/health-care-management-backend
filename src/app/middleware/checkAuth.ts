/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { Role, userStatus } from "../../generated/prisma/enums"
import { ca, th } from "zod/locales"
import { CookieUtils } from "../utils/cookie"
import { prisma } from "../lib/prisma"
import AppError from "../errorHandlers/handleErrors"
import status from "http-status"
import { JwtUtils } from "../utils/jwt"
import { envVars } from "../../config/env"

export const checkAuth = (...authRoles:Role[]) => async (req:Request, res:Response, next:NextFunction) => {
    

    try{


        const sessionToken = CookieUtils.getCookie(req, 'better-auth.session_token')
        if (!sessionToken) {
            throw new Error('Unauthorized: No session token provided');
        }

        if(sessionToken){
            const sessionExists = await prisma.session.findFirst({
                where:{
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include:{
                    user:true
                }
            })
            if(sessionExists && sessionExists.user){
                const user= sessionExists.user
                const now= new Date()
                const expiresAt = new Date(sessionExists.expiresAt)
              const createdAt = new Date(sessionExists.createdAt)

              const sessionLifetime = expiresAt.getTime() - createdAt.getTime()
              const timeRemaining = expiresAt.getTime() - now.getTime()

              const percentageRemaining = (timeRemaining / sessionLifetime) * 100

              if(percentageRemaining < 20){
                res.setHeader('X-Session-Refresh', 'true');
                res.setHeader('X-Session-Expires-In', expiresAt.toString());
                 res.setHeader('X-Time-Remaining', `${Math.round(percentageRemaining)}%`);
            }

            if(user.status === userStatus.DELETED || user.status === userStatus.SUSPENDED){
           
                throw new AppError(status.UNAUTHORIZED, 'Unauthorized: User account is not active');


            }

            if(user.isDeleted){
                throw new AppError(status.UNAUTHORIZED, 'Unauthorized: User account is deleted');
            }

            if(authRoles.length>0 && !authRoles.includes(user.role)){
                throw new AppError(status.FORBIDDEN, 'Forbidden: Insufficient permissions');
            }

            req.user = {
                userId: user.id,
                role: user.role,
                email: user.email,
            }
            return next()
        }

        const accessToken = CookieUtils.getCookie(req, 'accessToken')
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized: No access token provided');
        }
         
    }

      const accessToken = CookieUtils.getCookie(req, 'accessToken')
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized: No access token provided');

        }
        const verifiedToken = JwtUtils.verifyToken(accessToken,envVars.ACCESS_TOKEN_SECRET)
   
        if(!verifiedToken.success){
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized: Invalid access token');  
        }

        if(authRoles.length>0 && !authRoles.includes(verifiedToken.decoded!.role as Role)){
                 throw new AppError(status.FORBIDDEN, 'Forbidden: Insufficient permissions');
        }

       
        next();

}  catch(err:any){
        next(err)
    }
}