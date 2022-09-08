import mongoose from 'mongoose';
import { generateCode } from '../utils/generatePassword.js';

const verficationCodeSchema = mongoose.Schema({
    emailCode: {type: Object, default: {}}, //contains the code and the date it was generated. Generate a new code if stale.
    phoneCode: {type: Object, default: {}}
    //_id will be the same as the user we are trying to verify
})

verficationCodeSchema.methods.generateCode = async function(session, option) { //need the function keyword cause scopes
    const verification = this;
    let code = String(option) + '-' + generateCode();
    const date = new Date().getTime() + 86400 * 2 * 1000 //valid for 2 days
    const update = {code, date};
    if (option == 'E') {
        verification.emailCode = update;
    } else if (option == 'P') {
        verification.phoneCode = update;
    } else {
        return
    }
    await verification.save({ session });
    return code;
}

verficationCodeSchema.methods.isCodeStale = function(option) {
    if (option == 'E') {
        return this.emailCode.date < new Date().getTime();
    } else if (option == 'P') {
        return this.phoneCode.date < new Date().getTime();
    } else {
        return false;
    }
}

verficationCodeSchema.methods.verifyCode = function(code, option) {
    if (option == 'E') {
        return this.emailCode.code == code && !this.isCodeStale(option);
    } else if (option == 'P') {
        return this.phoneCode.code == code && !this.isCodeStale(option);
    } else {
        return false;
    }
}

const VerificationCode = mongoose.model('VerificationCode', verficationCodeSchema);

export default VerificationCode;