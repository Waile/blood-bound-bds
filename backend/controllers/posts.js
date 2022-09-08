import mongoose from 'mongoose';
import Post from '../models/post.model.js'
import User from '../models/user.model.js';
import { paginate } from '../utils/paginate.js';
import { verifyCreation, verifyFulfillment } from '../utils/verifyUpdates.js';

export const getPosts = async (req, res) => { //get active posts
    try {
        req.body.filters = { isActive: true, isFulfilled: false }
        req.body.sort = req.body.sort || { '_id': -1 }
        await paginate(Post, req, res);
        res.status(200).json(res.results);
    } 
    catch (error) {
        res.status(404).json({ error });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new Post(post);

    try {
        const user = await User.findOne({ username: post.username });
        if (user) {
            if (verifyCreation(user)) {
                await newPost.save();
                res.status(201).json(newPost);
            }
            else {
                res.status(201).json({ errorMessage: 'It has not been half an hour since you last created a post. Please wait a while before posting again.' })
            }
        }
    } 
    catch (error) {
        console.log(error);
        res.status(409).json("Something went wrong");
    }
}

export const getPostsById = async (req, res) => {
    const ids = req.body;

    try {
        const posts = await Post.find({ '_id': { $in: ids } });
        
        res.status(200).json(posts);
    } catch (error) {
        console.log(error)
        res.status(409).json(error);
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: 'No post with that ID' });
        return;
    }

    const updates = req.body;

    try {
        const oldPost = await Post.findById(id).lean();

        if (updates.fulfilledByDonor != null) {
            const donor = await User.findOne({ username: updates.fulfilledByDonor });
            if (donor && verifyFulfillment(donor, oldPost, res)) {
                const dict = donor;
                dict.donationsCompleted.push(oldPost._id);
                dict.lastDonationType = oldPost.donationType;
                dict.lastDonation = new Date();
                await User.findByIdAndUpdate(dict._id, dict);
            }
            else {
                console.log('windwiniwdnidwndiwnindw')
                return;
            }
        }

        const newPost = {...oldPost, ...updates};
        const fulfilledCheck = newPost.fulfilledByPoster && newPost.fulfilledByDonor !== null;
        if (fulfilledCheck) {
            newPost.isFulfilled = true;
        }
        await Post.findByIdAndUpdate(id, newPost);


        if (fulfilledCheck) {
            res.status(200).json({ newPost, isFulfilled: true });
        } else {
            res.status(200).json({ newPost, isFulfilled: false });
        }
    } 
    catch (error) {
        console.log(error)
        res.status(409).json(error);
    }
}

export const searchPosts = async (req, res) => {
    let filters = req.body;
    if (filters.bloodTypes) {
        const bTypes = filters.bloodTypes.split('[')[1].split(']')[0].split(',');
        filters = {...filters, bloodTypes: { $in: bTypes } };
    }
    if (filters.username) {
        const uName = filters.username;
        filters = {...filters, username: { $regex: uName, $options: 'i' }};
    }

    req.body = {};
    req.body.filters = {isActive: true, isFulfilled: false, ...filters};
    req.body.sort = req.body.sort || { '_id': -1 }; //same as sorting by date

    try {
        await paginate(Post, req, res);
        res.status(200).json(res.results);
    } catch (error) {
        console.log(error)
        res.status(404).json({ error });
    }
}