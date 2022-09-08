import mongoose from 'mongoose';
import User from './user.model.js';

const reportSchema = mongoose.Schema({
    snitch: {type: String, ref: 'User', required: true},
    culprit: {type: String, ref: 'User', required: true},
    isActive: {type: Boolean, default: true},
    show: {type: Boolean, default: true}, //if the admin deems the report valid and decides not to rescind.
    body: {type: String, required: true},
    reason: {type: String, required: true},
})

const Report = mongoose.model('Report', reportSchema);

export default Report;