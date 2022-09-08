import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";
import Timer from "../models/timer.model.js";

import dotenv from 'dotenv';

dotenv.config();

export const handleLogin = async (password, user, session, res) => {
    if (!user || !user.verifyPassword(password)) {
        res.status(200).json({ errorMessage: "Invalid Credentials" });
        return;
    }
    const contactVerificationsCheck = user?.contactVerifications?.email && user?.contactVerifications?.phoneNumber;
    if (!contactVerificationsCheck) {
        res.status(200).json({ message: "Verify", id: user._id });
        return;
    }
    if (user.userType == 'NGO_Worker' || user.userType == 'MI_Worker') {
        if (!user.isVerified) {
            res.status(200).json({ errorMessage: "You have not been verified yet. Please be patient while we verify your documents, Thank you!" });
            return;
        }
    }
    if (user.isDeleted) {
        user.isDeleted = false; //wasn't working with spreads for some reason.
        await User.findByIdAndUpdate(user._id, user).session(session); //logged in within the deletion window.
        await Timer.findByIdAndDelete(user._id).session(session);
    }

    const token =  jwt.sign({ username: user.username, id: user._id }, process.env.SECRET, { expiresIn: '1h' });
    res.status(200).json({ token }); //successful login
}