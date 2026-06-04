/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import { envVars } from "../../config/env"
import AppError from "../errorHandlers/handleErrors";
import status from "http-status";
import path from "node:path";
import ejs from "ejs"
const transporter = nodemailer.createTransport({
    host:envVars.EMAIL_SENDER.SMTP_HOST,
    secure:true,
    auth:{
        user:envVars.EMAIL_SENDER.SMTP_USER,
        pass:envVars.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT)

})

interface sendEmailOption{
    to:string;
    subject:string;
    templateName:string;
    templateData:Record<string,any>;
    attachment?:{
        filename:string,
        content:Buffer|string;
        contentType:string;
    }[];
    
}

export const sendEmail = async({subject,templateData,templateName,to,attachment}:sendEmailOption)=>{

try{
const templatePath = path.resolve(process.cwd(),`src/app/template/${templateName}.ejs`)

const html = await ejs.renderFile(templatePath,templateData);

const info = await transporter.sendMail({
    from:envVars.EMAIL_SENDER.SMTP_FROM,
    to:to,
    subject:subject,
    html:html,
    attachments: attachment?.map((attachment)=>({

        filename:attachment.filename,
        content:attachment.content,
        contentType:attachment.contentType
    }))
})
console.log(`Email send to ${to}:${info.messageId}`)


}catch(e){
    console.log("error",e)
    throw new AppError(status.INTERNAL_SERVER_ERROR,"Failed to send email")
}

}