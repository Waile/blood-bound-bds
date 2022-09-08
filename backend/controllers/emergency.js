import mongoose from 'mongoose';
import EmergencyPost from '../models/emergency.model.js'

export const getEmergencyPosts = async (req, res) => {
    try {
        const postMessages = await EmergencyPost.find({ isActive: true }).sort({ '_id': -1 });
        res.status(200).json(postMessages);
    } 
    catch (error) {
        res.status(404).json({ error });
    }
}

export const createEmergencyPost = async (req, res) => {
    const post = req.body;
    const newPost = new EmergencyPost(post);

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } 
    catch (error) {
        res.status(409).json({ error });
    }
}

export const updateEmergencyPost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that ID');

    const updates = req.body;

    try {
        const oldPost = await EmergencyPost.findById(id).lean();
        const newPost = {...oldPost, ...updates};
        await EmergencyPost.findByIdAndUpdate(id, newPost);
        res.status(200).json(newPost);
    } 
    catch (error) {
        res.status(409).json(error);
    }
}