import User from "../models/user.model.js";
import Timer from "../models/timer.model.js";
import VerificationCode from "../models/verificationCode.model.js";

import { sendMail, sendSMS } from "./contactUser.js";

const validateSignUpHelper = (user) => {
    const allowed = false;
    const bloodTypesArr = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    const userTypesArr = ['Blood_Donor', 'Blood_Requester', 'Customer_Support', 'Admin', 'NGO_Worker', 'MI_Worker'];
    const emptyArr = ["", null];
    // check fields for accurate information.
    user.verificationDocs = (user.verificationDocs || []).filter(doc => emptyArr.indexOf(doc) == -1); //filter verification docs
    const {username, firstName, lastName, userType, password, bloodType, cnic, cnicPhoto, livePhoto, email, phoneNumber, verificationDocs} = user;
    const lazyCheck = [username, firstName, lastName, password, cnic, cnicPhoto, livePhoto];

    //password should not be allowed to contain '\'? Make a password checking function

    if (userTypesArr.indexOf(userType) == -1) {
        return { allowed, errorMessage: { other: "Not a valid user type." } };
    }
    if (bloodTypesArr.indexOf(bloodType) == -1) {
        return { allowed, errorMessage: { other: "Not a valid blood type." } };
    }
    if (lazyCheck.indexOf(null) != -1 || lazyCheck.indexOf("") != -1) {
        return { allowed, errorMessage: { other: "Some required information is missing." } };
    }
    if (emptyArr.indexOf(email) != -1 && emptyArr.indexOf(phoneNumber) != -1) {
        return { allowed, errorMessage: { other: "Please enter at least an email or a phone number (or both)." } };
    }
    if (isNaN(Number(cnic))) {
        return { allowed, errorMessage: { other: "Please enter a proper cnic number." } };
    }
    if ( (userType == 'NGO_Worker' || userType == 'MI_Worker') && verificationDocs.length == 0 ) {
        return { allowed, errorMessage: { other: "No verification docs uploaded" } };
    }
    return { allowed: true }
}

const validateSignUp = async (user, session) => {
    const { allowed, errorMessage } = validateSignUpHelper(user);
    if (!allowed) {
        return {errorMessage};
    }

    let filters = [ {username: user.username}, {cnic: user.cnic} ];
    if (user.email) {
        filters = [...filters, {email: user.email}];
    } else {
        delete user.email;
    }
    if (user.phoneNumber) {
        filters = [...filters, {phoneNumber: user.phoneNumber}];
    } else {
        delete user.phoneNumber;
    }

    let check;
    try {
        check = await User.findOne({ $or: filters }).session(session);
    } catch (error) {
        throw new Error(error);
    }
    
    if (check) {
        const { username, email, phoneNumber, cnic } = check;
        const usernameError = (username == user.username) ? "This Username is a duplicate" : "";
        const cnicError = (cnic == user.cnic) ? "This Cnic is a duplicate" : "";
        const emailError = (email && email == user.email) ? "This Email is a duplicate" : "";
        const phoneNumberError = (phoneNumber && phoneNumber == user.phoneNumber) ? "This Phone Number is a duplicate" : "";
        //need phoneNumber and email != null before we try to match them
        return { errorMessage: {usernameError, emailError, phoneNumberError, cnicError} }; //duplicates
    }

    return {};
}

export const signUpUser = async (rawUser, res, isAssistive) => {
    let user = {};
    let codes = {};
    let created = false;

    try {
        await User.db.transaction(async (session) => {
            const result =  await validateSignUp(rawUser, session);
            if (result?.errorMessage) {
                res.status(200).json({errorMessage: result.errorMessage})
                throw new Error("Duplicate values, or incomplete/incorrect info")
            }
            user = new User({ ...rawUser, contactVerifications: { email: !rawUser.email, phoneNumber: !rawUser.phoneNumber }, isDeleted: true, docsUpdated: rawUser.verificationDocs.length > 0 });
            //don't verify email/phone if not provided
            await user.save({ session });
            const verify = new VerificationCode({ _id: user._id });
            await verify.save({ session });
            if (user.email) {
                codes.email = await verify.generateCode(session, 'E');
            }
            if (user.phoneNumber) {
                codes.phoneNumber = await verify.generateCode(session, 'P');
            }
            const deleteTimer = new Timer({ _id: user._id, date: new Date(new Date().getTime() + 86400 * 1000 * 7), type: "User" });
            await deleteTimer.save({ session });
            if (isAssistive) {
                //check if user type is valid if the signup is assistive
                const creator = await User.findById(user.createdBy);
                creator.accountsCreated = [ ...creator.accountsCreated, user._id ];
                await User.findByIdAndUpdate(user.createdBy, creator);
            }
            created = true;
            res.status(200).json({ _id: user._id });
        })
    } catch (error) {
        res.status(400).json({ message: "Something went wrong." });
        console.log(error.message)
        return;
    }

    if (created) {
        try {
            await sendMail({to: `${user.email}`, subject: 'Verify your BloodBound email.', text: `This is a verification code to verify the email you used to register with BloodBound: ${codes.email}`});
            //add the option of 'no, i didnt make this account for something something secuirty later'
            await sendSMS(user.phoneNumber, codes.phoneNumber);
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("i cri")
    }
}