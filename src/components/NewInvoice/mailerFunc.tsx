"use server"
import { comppileWithInvoice, sendMail } from "@/lib/mail"

const handleSendMail = async (e: string) => {
    console.log("sending", e)
    await sendMail({
        to:"sampadmedda@gmail.com",
        name:"Digicrm",
        subject:"Invoice",
        body:comppileWithInvoice("Digicrm"),
    })
  }

  export default handleSendMail