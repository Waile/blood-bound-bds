import mongoose from 'mongoose';
import User from './user.model.js';

const emergencySchema = mongoose.Schema({
    username: {type: String, ref: 'User', required: true},
    body: String,
    locations: {type: [String], required: true},
    created: {type: Date, default: new Date()},
    bloodTypes: {type: [String], required: true},
    isActive: {type: Boolean, default: true}
})

emergencySchema.pre('save', async function(next) {
    const post = this;

    try {
        const poster = await User.findOne({ username: this.username });
        if (poster) {
            const dict = poster;
            const posts = dict.emergencyPosts;
            posts.push(post._id);
            dict.emergencyPosts = posts;
            await User.findByIdAndUpdate(dict._id, dict);
        }
    } catch (error) {
        console.log(error);
    }
})

emergencySchema.post('findByIdAndDelete', async (ePost) => {
    console.log(ePost);

    const user = await User.findOne({ username: ePost.username })
    if (user) {
        const dict = user;
        const userEPosts = dict.emergencyPosts;
        userEPosts = userEPosts.filter((post_id) => post_id != ePost._id);
        dict.emergencyPosts = userEPosts;
        await User.findByIdAndUpdate(dict._id, dict);
    }
})

const EmergencyPost = mongoose.model('EmergencyPost', emergencySchema);

export default EmergencyPost;