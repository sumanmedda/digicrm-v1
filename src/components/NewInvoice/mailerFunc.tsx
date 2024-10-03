"use server"
import { comppileWithInvoice, sendMail } from "@/lib/mail"

const handleSendMail = async (customer:any, customerAdd:any, cemail:any, phone: any, famount:any) => {
    const email = cemail
    const clinetNumber = phone
    const finalAmount = famount
    const billToClient = customer
    await sendMail({
        to: email,
        name:"Digicrm",
        subject:"Invoice",
        body:comppileWithInvoice(customer,cemail, customerAdd,"Digicrm","17-04","","", finalAmount, billToClient),
    }).then(() => sendWhatsAppMessage(clinetNumber, email, finalAmount, billToClient))
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
                message: `Hi we have sent the invoice to your email ${email}`
            }),})
            const data = await response.json();
            console.log('Response data',data);
    } catch (error) {
        return console.log("Error occured : ", error)
    }
    
}

  export default handleSendMail

