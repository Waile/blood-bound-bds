import * as api from '../api';

import { GET_CHATS_BY_ID, REMOVE_CHAT, GET_CHAT, UPDATE_CHAT, GET_MESSAGES_BY_ID, UPDATE_USER } from '../constants/actionTypes';

export const getChatsbyId = (ids, { username, userType }) => async (dispatch) => {
    try {
        let { data } = await api.getChatsById(ids);
        if (userType != 'Customer_Support') {
            data = data.filter(chat => chat.visible); //can only see unresolved chats
        }
        data = data.map(chat => {
            const retVal = {};
            if (username == chat.username1) {
                retVal[chat._id] = { ...chat, username1: '' } //cheap way to get the other person's username
                return retVal;
            }
            retVal[chat._id] = { ...chat, username2: '' };
            return retVal;
        });
        const payload = data.reduce((acc, chat) => ({ ...acc, ...chat }), {});

        dispatch({ type: GET_CHATS_BY_ID, payload });
    } catch (error) {
        console.log(error);
    }
}

export const updateChat = (id, updates, { username }) => async (dispatch) => {
    try {
        const { data } = await api.updateChat(id, updates);

        if (username == data.username1) {
            data.username1 = '';
        } else {
            data.username2 = '';
        }
        
        dispatch({ type: UPDATE_CHAT, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const removeChat = (id) => async (dispatch) => {
    dispatch({ type: REMOVE_CHAT, payload: id });
}

export const getChat = (filters, { username }) => async (dispatch) => {
    try {
        const { data } = await api.getChat(filters);

        if (data.username1 == username) {
            data.username1 = '';
        } else {
            data.username2 = '';
        }

        const payload = {};
        payload[data._id] = data;

        dispatch({ type: GET_CHAT, payload });
        return data._id;
    } catch (error) {
        console.log(error);   
    }
}

export const addMessage = (_id, chatMessage) => async (dispatch) => {
    try {
        const { data } = await api.addMessage(_id, chatMessage);

        if (data?.errorMessage) {
            return data.errorMessage;
        }

        const message = {};
        message[data.newMessage._id] = data.newMessage;

        dispatch({ type: GET_MESSAGES_BY_ID, payload: message });
        dispatch({ type: UPDATE_CHAT, payload: { _id, chatMessages: data.messages } });
    } catch (error) {
        console.log(error);
    }
}

export const createChat = (chat, message, { username, userChatsWithSupport, userChatsWithUser }) => async (dispatch) => {
    try {
        const { data } = await api.createChat(chat, message);
        
        if (data.username1 == username) {
            data.username1 = '';
        } else {
            data.username2 = '';
        }

        let updates = {}; //user updates
        if (data.chatType == 'U2S') {
            updates = { userChatsWithSupport: [ ...userChatsWithSupport, data._id ] };
        } else {
            updates = { userChatsWithUser: [ ...userChatsWithUser, data._id ] };
        }
        dispatch({ type: UPDATE_USER, payload: updates });
        
        const update = {}; //chat updates
        update[data._id] = data;
        
        dispatch({ type: GET_CHAT, payload: update });
        return data._id
    } catch (error) {
        console.log(error);
    }
}