import nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'
import { invoiceTemplate } from './template/invoice_temp';

export async function sendMail({ to,
    name,
    subject,
    body
    }:{
    to:string;
    name:string;
    subject:string;
    body:string;
}){
    const {SMTP_EMAIL, SMTP_PASSWORD} = process.env
    console.log(SMTP_EMAIL, SMTP_PASSWORD)
    const transport  = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        }
    });
    try {
        const testResult = await transport.verify()
        console.log('verify Result : ',testResult)
    } catch (error) {
        console.log('Some Error Occured in Phase 1',error)
        return;
    }

    try {
        const sendResult = transport.sendMail({
            from: SMTP_EMAIL, 
            to,
            subject,
            html: body
        })
        console.log('Mail Result : ',sendResult)
    } catch (error) {
        console.log('Some Error Occured in Phase 2',error)
    }
}

export function comppileWithInvoice(name:string){
    const template = handlebars.compile(invoiceTemplate)
    const htmlBody = template({name:name})
    return htmlBody;
}