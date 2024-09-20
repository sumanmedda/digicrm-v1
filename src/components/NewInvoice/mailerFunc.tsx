"use server"
import { comppileWithInvoice, sendMail } from "@/lib/mail"

const handleSendMail = async (e: string) => {
    console.log("sending", e)
    const email = 'meddasuman202@gmail.com'
    const clinetNumber = '9873211604'
    const finalAmount = '79999'
    const billToClient = "abz name"
    await sendWhatsAppMessage(clinetNumber, email, finalAmount, billToClient)
    // sendMail({
    //     to: email,
    //     name:"Digicrm",
    //     subject:"Invoice",
    //     body:comppileWithInvoice("Digicrm","17-04","","", finalAmount, billToClient),
    // }).then(() => sendWhatsAppMessage(clinetNumber, email, finalAmount, billToClient))
  }

  
async function sendWhatsAppMessage(clinetNumber:string, email:string, finalAmount:string, billToClient:string) {
    const apiUrl = 'http://localhost:5001/api/whatsapp-message/send-message';
    
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phoneNumber: `91${clinetNumber}@c.us`,
                // message: `Hi we have sent the invoice to your email <b>${email}</b>`
                message: comppileWithInvoice("Digicrm","17-04","","", finalAmount, billToClient),
            }),})
            const data = await response.json();
            console.log('Response data',data);
    } catch (error) {
        return console.log("Error occured : ", error)
    }
    
}

  export default handleSendMail

