import mongoose from 'mongoose';
import * as models from '../models/index.js';
import Timer from '../models/timer.model.js';

const HOUR = 86400 * 1000;

const handleUser = async (event) => {
    try {
        const user = await models.User.findById(event._id).lean();
        if (user && user.isDeleted) { //user has not logged in
            await models.User.findByIdAndDelete(event._id);
            await Promise.all(user.posts.map(async post_id => await models.Post.findByIdAndDelete(mongoose.Types.ObjectId(post_id), {}, (err) => console.log(err))));
            // await Promise.all(user.posts.map(async post_id => {await models.Post.findByIdAndDelete(mongoose.Types.ObjectId(post_id), {}, (err) => console.log(err)); return null;}));
            //maybe this avoids the mongoose query already executed error
        }
        await Timer.findByIdAndDelete(event._id);
    } catch (error) {
        console.log(error);
    }
}

const handlePost = async (event) => {
    try {
        const oldPost = await models.Post.findById(event._id).lean();
        const newPost = { ...oldPost, ...event.updates };

        await models.Post.findByIdAndUpdate(event._id, newPost);
        await Timer.findByIdAndDelete(event._id);
    } catch (error) {
        console.log(error);
    }
}

const handlers = { 'User': handleUser, 'Post': handlePost };

const handleEvent = (event) => {
    return handlers[event.type](event);
}

export const watch = async () => {
    const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    while (true) {
        const currTime = new Date();
        // console.log(currTime);
        const events = await Timer.aggregate([ { $match: { date: { $lt: currTime } } }, { $sample: { size: 100 } } ]);
        //check the case in post controllers if the time of the post has passed lel.
        // console.log(events);

        await Promise.allSettled(events.map(event => handleEvent(event)));
        await delay(HOUR / 2);
    }
}