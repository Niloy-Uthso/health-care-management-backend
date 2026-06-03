import e, { NextFunction, Request, Response } from "express"
import status from "http-status";
import z from "zod";
import AppError from "../errorHandlers/handleErrors";
 
interface TErrorsource{
  path: string;
  message: string;
}
/*
 error.issues; 
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' ],
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] 
*/
export const globalErrorHandler = (err:Error,req:Request,res:Response,next:NextFunction)=>{
   
let errorSources:TErrorsource[] = [];

let statusCode:number = status.INTERNAL_SERVER_ERROR;
let message:string= 'Internal Server Error';
let stack:string | undefined = undefined;

if(err instanceof z.ZodError){
  statusCode = status.BAD_REQUEST;
  message= "Zod Validation Error";
  err.issues.forEach((issue)=>{
    errorSources.push({
      path: issue.path.join('.'),
      message: issue.message
    })
  })
} 

else if(err instanceof AppError){
  statusCode = err.statusCode;
  message = err.message;
  stack = err.stack;
  errorSources= [{
 path: '',
    message: err.message
  }]
}

else if(err instanceof Error){
  statusCode = status.INTERNAL_SERVER_ERROR;
  message = err.message;
  stack= err.stack;
  errorSources= [{  
    path: '',
    message: err.message
  }]
  
}
    res.status(statusCode).json({
    success: false,
    error: err.message,
    message: message,
    errorSources,
    stack
})
 }