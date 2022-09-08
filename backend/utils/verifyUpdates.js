const BLOOD_TIMEOUT = 4838400000;
const PLASMA_TIMEOUT = BLOOD_TIMEOUT / 2;
const THIRTY_MINUTES = 1800000;

const timerCheck = (user) => {
    const currentDate = new Date();
    if (!user.lastDonationType) {
        return true;
    }
    else if (user.lastDonationType == 'Plasma') {
        if (+currentDate - (+user.lastDonation) < PLASMA_TIMEOUT) {
            return false;
        }
    }
    else {
        if (+currentDate - (+user.lastDonation) < BLOOD_TIMEOUT) {
            return false;
        }
    }
    return true;
}

export const verifyFulfillment = (user, post, res) => {
    if (post.requiredBy.getTime() < new Date().getTime()) { //the donation window has already passed
        res.status(200).json({ errorMessage: 'The donation window has already passed.' });
        return false;
    }
    if (user.userType == 'NGO_Worker' || user.userType == 'MI_Worker') {
        return true;
    }
    if (user.setIneligibleBy !== null) {
        res.status(200).json({ errorMessage: 'You have been set ineligible according to your uploaded onboarding documents. Please contact customer support if you think this is a mistake.' });
        return false;
    }
    if (!timerCheck(user)) {
        res.status(200).json({ errorMessage: 'You have already fulfilled a request, and the recommended interval between donations has not yet passed' });
        return false;
    }
    if (post.bloodTypes.indexOf(user.bloodType) == -1) {
        res.status(200).json({ errorMessage: 'Your blood type and the required blood type(s) do not match' });
        return false;
    }
    return true;
}

export const verifyCreation = (user) => {
    if (user.posts !== []) {
        const currentDate = new Date();
        const lastPostTime = new Date(user.lastPostTime);
        if (+currentDate - (+lastPostTime) < THIRTY_MINUTES) {
            return false;
        }
    }
    return true;
}