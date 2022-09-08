import mongoose from 'mongoose';
import Chat from '../models/chat.model.js'
import ChatMessage from '../models/chatMessage.model.js';

export const createChat = async (req, res) => {
    const chat = req.body.chat;
    const message = req.body.message;
    
    const newChat = new Chat(chat);
    const newMessage = new ChatMessage({ ...message, associatedChatId: newChat._id });
    newChat.chatMessages.push(newMessage._id);

    try {
        await newChat.save();
        await newMessage.save();
        res.status(201).json(newChat);
    } catch(error) {
        console.log(error)
        res.status(409).json({ error });
    }
}

export const addMessage = async (req, res) => {
    const { id } = req.params;
    const message = req.body.message;

    try {
        const oldChat = await Chat.findById(id).lean();
        if (!oldChat.visible) {
            res.status(200).json({ errorMessage: { visible: false } });
            return;
        } //do something about chats that are de-activated by the support but the other dude is still typing

        const newMessage = new ChatMessage({...message, associatedChatId: oldChat._id});
        oldChat.chatMessages.push(newMessage._id);

        await newMessage.save();
        await Chat.findByIdAndUpdate(oldChat._id, oldChat);

        res.status(200).json({ messages: oldChat.chatMessages, newMessage });
    } catch (error) {
        res.status(409).json({ error });
    }
}

export const getChat = async (req, res) => {
    const { usernames, associatedPost, _id } = req.body;
    let filters = {};

    if (_id) {
        filters = { _id };
    } else {
        filters = { username1: {$in: usernames}, username2: {$in: usernames}, associatedPost, visible: true};
    }

    try {
        const chat = await Chat.findOne(filters);

        if (chat) {
            res.status(200).json(chat);
        } else {
            res.status(200).json({ _id: null, chatMessages: [] })
        }
    } catch (error) {
        res.status(409).json({ error })
    }
}

export const getMessagesById = async (req, res) => {
    const ids = req.body;

    try {
        const messages = await ChatMessage.find({ '_id': { $in: ids } });
        
        res.status(200).json(messages);
    } catch (error) {
        console.log(error)
        res.status(409).json(error);
    }
}

export const getChatsById = async (req, res) => {
    const ids = req.body;

    try {
        const chats = await Chat.find({ '_id': { $in: ids } });

        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
}

export const updateChat = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('No user with that ID');
        return;
    }

    try {
        const oldChat = await Chat.findById(id).lean();

        const newChat = { ...oldChat, ...updates };
        await Chat.findByIdAndUpdate(id, newChat);
        res.status(200).json(newChat);
    } catch (error) {
        console.log(error);
        res.status(409).json(error);
    }
}