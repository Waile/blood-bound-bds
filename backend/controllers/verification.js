import mongoose from "mongoose";

import User from "../models/user.model.js";
import VerificationCode from "../models/verificationCode.model.js";

import { sendMail, sendSMS } from "../utils/contactUser.js";

export const verifyCode = async (req, res) => {
    const { id } = req.params;
    const { code } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('No user with that ID');
        return;
    }

    try {
        await User.db.transaction(async (session) => {
            const verificationCode = await VerificationCode.findById(id).session(session);
            const option = code?.[0];
            if (verificationCode.verifyCode(code, option)) {
                const user = await User.findById(id).session(session).lean();
                
                let contactVerifications = { ...user.contactVerifications };
                
                if (option == 'E') {
                    contactVerifications = { ...contactVerifications, email: true };
                } else {
                    contactVerifications = { ...contactVerifications, phoneNumber: true };
                }
                
                await User.findByIdAndUpdate(id, { ...user, contactVerifications }).session(session);
                res.status(200).json({ message: "OK", canLogin: contactVerifications.email && contactVerifications.phoneNumber });
                //allow the user to login after verifying both
            } else {
                res.status(200).json({ errorMessage: "Invalid code." });
            }
        })
    } catch (error) {
        res.status(400).json({ errorMessage: "Something went wrong." })
    }
}

export const resendCode = async (req, res) => {
    const { id } = req.params;
    const { option } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('No user with that ID');
        return;
    }
    if (['E', 'P'].indexOf(option) == -1) { //not 'E' or 'P'
        res.status(400).send('Incorrect option');
        return;
    }

    let code;
    let email;
    let phoneNumber;

    try {
        await VerificationCode.db.transaction(async (session) => {
            const verificationCode = await VerificationCode.findById(id).session(session);
            code = await verificationCode.generateCode(session, option);
            const user = await User.findById(id).session(session).lean();

            email = user.email;
            phoneNumber = user.phoneNumber;
        })
        res.status(200).json({ message: 'Code created' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ errorMessage: "An error occurred when generating a new code." })
    }

    try {
        if (option == 'E') {
            await sendMail({to: `${email}`, subject: 'Verify your BloodBound email.', text: `This is a verification code to verify the email you used to register with BloodBound: ${code}`});
        } else {
            await sendSMS(phoneNumber, code);
        }
    } catch (error) {
        console.log(error);
    }
}