import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
    console.log("RESEND_API inside the .env file is required");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'TaskHero <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Email sending failed:", error);
            throw new Error(`Failed to send email: ${error.message || "Unknown error"}`);
        }

        return data;
    } catch (error) {
        console.log("Email error:", error);
        throw error;
    }
};

export default sendEmail;