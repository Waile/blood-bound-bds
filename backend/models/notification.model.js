import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    username: {type: String, ref: 'User', required: true},
    associatedPost: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null},
    text: String,
    read: {type: Boolean, default: false},
    timeCreated: {type: Date, required: true},
    givenByPoster: {type: Boolean, required: true}
})

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;