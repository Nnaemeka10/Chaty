import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email,name,clientURL) => {
    if(!sender?.email || !sender?.name) {
        throw new Error("Emaail sender configuration is missing(name or email)");
    }

    if(!email) throw new Error("Recipient email is required");
    if(!clientURL) throw new Error("Client URL is required");

    const { data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Chaty Messenger! 🎉",
        html: createWelcomeEmailTemplate(name, clientURL),
    });

    if (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }

    console.log("Welcome email sent successfully:", data);
}