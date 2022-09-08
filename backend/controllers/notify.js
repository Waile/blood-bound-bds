import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const notify = async (req, res) => {
    const { usernames, associatedPost, text, givenByPoster, timeCreated } = req.body;

    try {
        await Notification.db.transaction(async (session) => {
            await Promise.allSettled(usernames.map(async (username) => {
                if (givenByPoster) {
                    const oldNotif = await Notification.findOne({ username, associatedPost, givenByPoster }).session(session);
                    if (oldNotif) { //the user has been notified of this already
                        console.log('duplicate reeeeee');
                        return;
                    }
                }
                const notif = new Notification({ username, associatedPost, text, givenByPoster, timeCreated });
                const user = await User.findOne({ username }).select({ notifications: 1 }).session(session);
                console.log(user);
                user.notifications = (user.notifications || []).push(notif._id);
                await notif.save({ session });
                await User.findByIdAndUpdate(user._id, user).session(session);
            }))
        })

        res.status(200).json('Notifications sent!');
    } catch (error) {
        res.status(400).json('Something went wrong');
    }
}

export const markAsRead = async (req, res) => {
    const ids = req.body;

    try {
        await Notification.db.transaction(async (session) => {
            await Promise.all(ids.map(async (id) => {
                await Notification.findByIdAndUpdate(id, { read: true });
            }))
        })

        res.status(200).json('Yay');
    } catch (error) {
        res.status(400).json('Nay');
    }
}

export const getNotificationsById = async (req, res) => {
    const ids = req.body;
    let notifs = [];
    console.log('pp', ids)

    if (ids.length == 0) {
        return res.status(200).json([]);
    }

    try {
        await Notification.db.transaction(async (session) => {
            const currentTime = new Date();
            notifs = await Notification.find({ _id: { $in: ids }, timeCreated: { $lt: currentTime } }).sort({ _id: -1 }).session(session);
            //get notifications that were scheduled to be seen before the current time, and sort them in descending order.
        })

        res.status(200).json(notifs);
    } catch (error) {
        console.log(error)
        res.status(400).json('Nay');
    }
}