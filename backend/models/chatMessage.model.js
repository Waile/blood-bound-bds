import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
    author: {type: String, required: true},
    date: {type: Date, default: new Date()},
    associatedChatId: {type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true},
    body: {type: String},
    hasImage: {type: Boolean, default: false},
    image: {type: String, default: ""}
})

const ChatMessage = mongoose.model('ChatMessage', messageSchema);

export default ChatMessage;