import User from "../models/user.model.js";

import { signUpUser } from '../utils/signUp.js';
import { handleLogin } from '../utils/login.js';
import { generatePassword } from '../utils/generatePassword.js';
import { sendMail, sendSMS } from "../utils/contactUser.js";

export const login = async (req, res) => {
    const { username, password } = req.body;

    let user = null;
    try {
        await User.db.transaction(async (session) => {
            user = await User.findOne({ username }).session(session);
            await handleLogin(password, user, session, res);
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({ errorMessage: "Something went wrong" })
    }
}

export const signUp = async (req, res) => {
    const rawUser = req.body;
    await signUpUser(rawUser, res, false);
}

export const assistiveSignUp = async (req, res) => {
    const rawUser = req.body;
    const createdBy = req.userId;
    const password = generatePassword();
    await signUpUser({ ...rawUser, password, createdBy }, res, true);
}

export const forgot = async (req, res) => {
    const { email, phoneNumber } = req.body;
    let filters = {};
    let user = {};

    if (email != '') {
        filters = {...filters, email};
    }
    if (phoneNumber != '') {
        filters = {...filters, phoneNumber};
    }

    try {
        await User.db.transaction(async (session) => {
            user = await User.findOne(filters).session(session);
            if (!user) {
                throw new Error("No such user exists.");
            }
        });
    } catch (error) {
        res.status(200).json({ errorMessage: error.message });
        return;
    }

    try {
        await sendMail({to: `${email}`, subject: 'Your username and password.', text: `Your BloodBound details:\n Username: ${user.username}\n Password: ${user.password}`});
        // await sendSMS(user.phoneNumber, user)
        res.status(200).json('Details sent successfully!');
    } catch (error) {
        console.log(error);
        res.status(400).json('Something went wrong');
    }
}