import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USERNAME, 
        pass: process.env.EMAIL_PASSWORD
    }
})

export const sendMail = async (options) => {
    if (!options.to || options.to == '') {
        return;
    }
    const mailOptions = {
        from: `${process.env.EMAIL_USERNAME}`,
        ...options
    }
    
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info);
    } catch (error) {
        console.log(error);
    }
}

export const sendSMS = async (phoneNumber, code) => {
    if (!code || !phoneNumber) {
        return;
    }
}