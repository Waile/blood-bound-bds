import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Post from '../models/post.model.js'
import Timer from '../models/timer.model.js';

export const getUser = async (req, res) => {
    const { username } = req.query;

    try {
        const user = await User.findOne({ username }).select({ password: 0 });
        //don't display the password
        res.status(200).json(user);
    } 
    catch (error) {
        res.status(404).json({ error });
    }
}

export const searchUsers = async (req, res) => { //get users by specified filters. Mainly for getting users for verification/onboarding.
    const filters = req.body;

    try {
        const users = await User.find(filters);
        res.status(200).json(users);
    } catch(error) {
        console.log(error)
        res.status(404).json({ error })
    }
}

export const getUsersById = async (req, res) => {
    const ids = req.body;

    try {
        const users = await User.find({ _id: { $in: ids } });

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(409).json(error);
    }
}

export const createUser = async (req, res) => {
    const user = req.body;
    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json(newUser);
    } 
    catch (error) {
        res.status(409).json({ error });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('No user with that ID');
        return;
    }

    let updates = req.body;

    
    try {
        const oldUser = await User.findById(id).lean();

        if (updates.setIneligibleBy == null && oldUser.setIneligibleBy != updates.setIneligibleBy) { //must have been set eligible by an ngo/mi worker
            updates.lastDonationType = null; //override last donation type
        }
        if (updates.password) {
            if (updates.oldPassword) {
                if (updates.oldPassword != oldUser.password) {
                    res.status(200).json({errorMessage: "Incorrect current password"})
                    return
                }
                //insert check for actual password
                updates = {password: updates.password}
            } else { //cant update pass without providing the old one
                updates = {}
            }
        }
        
        const newUser = {...oldUser, ...updates};
        await User.findByIdAndUpdate(id, newUser);
        if (updates.isDeleted == false) { //delete the timer event corresponding to this user. Need isDeleted to be not null, and false
            await Timer.findByIdAndDelete(id);
        }
        res.status(200).json(newUser);
    } 
    catch (error) {
        console.log(error)
        res.status(409).json(error);
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('No user with that ID');
        return;
    }

    try {
        const user = await User.findById(id).lean();
        await User.findByIdAndDelete(id);
        await Promise.all(user.posts.map(async post_id => await Post.findByIdAndDelete(mongoose.Types.ObjectId(post_id))));
        await Timer.findByIdAndDelete(id);
        res.json({ id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error in deletion' })
    }
}

export const getSupport = async (req, res) => {
    try {
        const result = await User.aggregate([ { $match: { userType: 'Customer_Support', isDeleted: false } }, { $sample: { size: 1 } } ]);
        //get a random support worker
        const { username } = result[0];
        res.status(200).json({ username });
    } catch (error) {
        console.log(error);
        res.status(404).json('No support found');
    }
}

export const setForDelete = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('No user with that ID');
        return;
    }

    try {
        const oldUser = await User.findById(id).lean();
        const newUser = { ...oldUser, isDeleted: true };
        const updates = { date: new Date(new Date().getTime() + 86400 * 1000 * 7), type: 'User', _id: id };
        //delete the user one week later.
        await Timer.findByIdAndUpdate(id, updates, { upsert: true }); //in case there is an old timer that is still active, update it.
        await User.findByIdAndUpdate(id, newUser);
        res.json({ message: 'success' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error in deletion' })
    }
}