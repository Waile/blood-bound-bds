import mongoose from 'mongoose';
import Timer from './timer.model.js';
import User from './user.model.js';

const postSchema = mongoose.Schema({
    username: {type: String, ref: 'User', required: true},
    date: {type: Date, default: new Date()},
    requiredBy: {type: Date, required: true},
    body: String,
    bloodTypes: {type: [String], required: true},
    donationType: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    isFulfilled: {type: Boolean, default: false},
    location: {type: String, required: true},
    locationCoords: {type: {type: String, default: "Point"}, coordinates: [{type: Number}]},
    fulfilledByPoster: {type: Boolean, default: false},
    fulfilledByDonor: {type: String, ref: 'User', default: null}
})

postSchema.pre('save', async function(next) {
    const post = this;

    try {
        const poster = await User.findOne({username: this.username });
        if (poster) {
            const dict = poster;
            const posts = dict.posts;
            posts.push(post._id);
            dict.posts = posts;
            dict.lastPostTime = this.date;
            await User.findByIdAndUpdate(dict._id, dict);
        }
        const event = new Timer({ date: this.requiredBy, type: 'Post', _id: this._id, updates: { isActive: false } });
        await event.save();
    } catch (error) {
        console.log(error);
    }
})

postSchema.post('findByIdAndDelete', async (post) => {
    console.log(post);

    const user = await User.findOne({ username: post.username })
    if (user) {
        const dict = user;
        const userPosts = dict.posts;
        userPosts = userPosts.filter((post_id) => post_id != post._id);
        dict.posts = userPosts;
        await User.findByIdAndUpdate(dict._id, dict);
    }
    await Timer.findByIdAndDelete(post._id);
})

postSchema.index({ locationCoords: '2dsphere' });

const Post = mongoose.model('Post', postSchema);

export default Post;

//add this post to the related users' list of posts after creation.
//also update the lastPostTime field for the 30-minute validation.