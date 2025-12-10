import * as nodemailer from 'nodemailer'
import { WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE } from './template'



type WelcomeEmailData = { email: string; name: string; intro: string };
type NewsSummaryEmailData = { email: string; date: string; newsContent: string };

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

export const sendNewSummaryEmail = async ({ email, date, newsContent }: NewsSummaryEmailData): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace('{{date}}', date).replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Signals News" <signalist@jsmastery.pro>`,
        to: email, 
        subject: `Market News Summary Today - ${date}.`,
        text: `Today's market news summary from Signalist`,
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions)
    return
}

