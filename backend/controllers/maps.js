import Post from '../models/post.model.js'
import User from '../models/user.model.js';

const HOUR = 86400 * 1000;

//don't forget to uncomment the filters at some point

export const getNearbyDonors = async (req, res) => {
    const { locationCoords, bloodTypes, distance } = req.body;
    console.log(req.body)
    let donors = [];
    if (!locationCoords) {
        return res.status(400).json('oof');
    }

    try {
        await User.db.transaction(async (session) => {
            const currentDate = new Date();
            donors = await User.find({
                bloodType: { $in: bloodTypes }, 
                // locationTime: { $gte: currentDate.getTime() - HOUR / 2 }, //location should not be stale by more than half an hour
                currentLocation: { 
                    $near: {
                        $geometry: { 
                            type: "Point", coordinates: locationCoords 
                        }, 
                        $maxDistance: distance
                    }
                }
            }).session(session);
        });
        res.status(200).json(donors);
    } catch (error) {
        console.log(error)
        res.status(404).json("Something went wrong");
    } 
}

export const getNearbyRequests = async (req, res) => {
    const { locationCoords, bloodType, distance } = req.body;
    console.log(req.body)
    if (!locationCoords) {
        return res.status(400).json('oof');
    }
    let requests = [];

    try {
        await Post.db.transaction(async (session) => {
            requests = await Post.find({ 
                bloodTypes: { $in: [bloodType] }, 
                isActive: true, 
                isFulfilled: false,
                locationCoords: { 
                    $near: { 
                        $geometry: { 
                            type: "Point", coordinates: locationCoords 
                        }, 
                        $maxDistance: distance
                    }
                }
            }).session(session);
        });
        res.status(200).json(requests);
    } catch (error) {
        console.log(error)
        res.status(404).json("Something went wrong");
    } 
}