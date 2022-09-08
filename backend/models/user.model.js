import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    //all
    username: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    middleName: String,
    lastName: {type: String, required: true},
    email: {type: String, unique: true, sparse: true}, //unique unless not defined
    phoneNumber: {type: String, unique: true, sparse: true},
    password: {type: String, required: true},
    userType: {type: String, required: true},
    isDeleted: {type: Boolean, default: false},
    currentLocation: {type: {type: String, default: "Point"}, coordinates: {type: [{type: Number}], default: [0, 0] }},
    locationTime: {type: Date, default: null}, //will be used to check location staleness
    cnic : {type: String, required: true, unique: true},
    cnicPhoto: {type: String, required: true},
    livePhoto: {type: String, required: true},
    contactVerifications: {type: Object},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    notifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Notification'}],

    //donor/requester
    reportsFiled: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Report'}], default:[]},
    reportsAgainst: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Report'}], default:[]}, //active reports filed against this user
    donationsCompleted : [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    lastDonation: {type: Date, default: null},
    lastDonationType: {type: String, default: null}, //need the previous 2 fields to automatically check eligibility 
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    lastPostTime: {type: Date, default: null},
    setIneligibleBy: {type: String, ref: 'User', default: null}, //if set ineligible by an NGO/MI worker
    bloodType: {type: String},
    userChatsWithSupport: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}],
    userChatsWithUser: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}],

    //ngo/mi workers
    isVerified: {type:Boolean, default: false},
    accountsCreated: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], //username arr?

    //ngo/mi and donors/requesters
    verificationDocs: [String], //stored as string. Convert to an array in the future?
    docsUpdated: {type: Boolean, default: false}, //show up only if updated
    //verificationCode: {},

    //admin
    emergencyPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyPost'}],

    //customer support
    supportChatsWithUser: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}],
})

userSchema.methods.verifyPassword = function(password) {
    return this.password === password;
}

userSchema.index({ currentLocation: '2dsphere' });

const User = mongoose.model('User', userSchema);

export default User;