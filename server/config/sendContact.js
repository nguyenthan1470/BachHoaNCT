import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RESEND_API_CONTACT) {
    console.error("Missing RESEND_API_CONTACT in .env file");
}

const resend = new Resend(process.env.RESEND_API_CONTACT);

const sendContact = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Bách Hóa NCT <onboarding@resend.dev>',
            to: sendTo,
            subject,
            html,
        });

        if (error) {
            console.error("Resend API error:", error);
            return null;
        }
        return data;
    } catch (err) {
        console.error("Error sending contact email:", err);
        return null;
    }
};

export default sendContact;
