import mongoose from 'mongoose'
import User from './user.model.js';

const chatSchema = mongoose.Schema({
    username1: {type: String, ref: 'User', required: true},
    username2: {type: String, ref: 'User', required: true},
    chatType: {type: String}, //user-user or user-support
    chatMessages: [{type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage'}],
    associatedPost: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null},
    visible: {type: Boolean, required: true, default: true},
})

chatSchema.pre('save', async function(next) {
    const {username1, username2, associatedPost } = this;

    try {
        let filters = {}
        if (associatedPost) {
            filters = {associatedPost};
        } else {
            filters = {visible: true};
        }
        const usernames = [username1, username2];
        const oldChat = await Chat.findOne({ username1: { $in: usernames }, username2: { $in: usernames }, ...filters });
        //visible should be true if no associated post is given
        if (oldChat && associatedPost) { //already exists
            console.log(oldChat)
            throw new Error("The chat already exists." + username1 + username2, associatedPost)
        }

        const user1 = await User.findOne({username: this.username1 });
        const user2 = await User.findOne({username: this.username2 });
        if (user1 && user2) {
            if (user1.userType == 'Customer_Support') {
                user1.supportChatsWithUser.push(this._id);
                user2.userChatsWithSupport.push(this._id);
                this.chatType = 'U2S';
            } else if (user2.userType == 'Customer_Support') {
                user2.supportChatsWithUser.push(this._id);
                user1.userChatsWithSupport.push(this._id);
                this.chatType = 'U2S';
            } else {
                user1.userChatsWithUser.push(this._id);
                user2.userChatsWithUser.push(this._id);
                this.chatType = 'U2U';
            }
            await User.findByIdAndUpdate(user1._id, user1);
            await User.findByIdAndUpdate(user2._id, user2);
        }
        next();
    } catch (error) {
        console.log(error);
        next(error)
    }
})

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;