import nodemailer from 'nodemailer'
import { WELCOME_EMAIL_TEMPLATE } from './template'



type WelcomeEmailData = { email: string; name: string; intro: string };

// Validate credentials at module load time so error is obvious
const NODEMAILER_USER = process.env.NODEMAILER_EMAIL;
const NODEMAILER_PASS = process.env.NODEMAILER_PASSWORD;

if (!NODEMAILER_USER || !NODEMAILER_PASS) {
    throw new Error(
        "Missing NODEMAILER_EMAIL or NODEMAILER_PASSWORD environment variables. " +
        "Set them in .env.local (use a Gmail app password if you have 2FA)."
    );
}

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS,
    },
});

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro);

    const mailOptions = {
        from: `"Signalist" <rohitsha08081998@gmail.com>`,
        to: email,
        subject: `Welcome to Signalist - your stock market toolkit is ready!`,
        text: 'THANKS for Joining Signalist',
        html: htmlTemplate
    }

    // return transporter result for easier testing
    const result = await transporter.sendMail(mailOptions)
    return result
}