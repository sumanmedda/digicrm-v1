import nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'
import { invoiceTemplate } from './template/invoice_temp';

export async function sendMail({ to,
    name,
    subject,
    body
}: {
    to: string;
    name: string;
    subject: string;
    body: string;
}) {
    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env
    console.log(SMTP_EMAIL, SMTP_PASSWORD)
    const transport = nodemailer.createTransport({
        // service: "gmail",
        host: 'smtp.hostinger.com',  // Hostinger's SMTP server
        port: 465,  // Use port 465 for SSL
        secure: true,  // SSL
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        }
    });
    try {
        const testResult = await transport.verify()
        console.log('verify Result : ', testResult)
    } catch (error) {
        console.log('Some Error Occured in Phase 1', error)
        return;
    }

    try {
        const sendResult = transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html: body
        })
        console.log('Mail Result : ', sendResult)
    } catch (error) {
        console.log('Some Error Occured in Phase 2', error)
    }
}

export function comppileWithInvoice(customerName: string,customerEmail: string,customerAddress: string,name: string, dueDate: string, invoiceDate: string, invoiceNumber: string, finalAmount: string, billToClient: string) {
    const template = handlebars.compile(invoiceTemplate)
    const htmlBody = template({ customerName:customerName, customerEmail:customerEmail,customerAddress:customerAddress, name: name, dueDate: dueDate, invoiceDate: invoiceDate, invoiceNumber: invoiceNumber, finalAmount: finalAmount, billToClient: billToClient })
    return htmlBody;
}