import { combineReducers } from "redux";

import newsfeed from './newsfeed';
import user from './user';
import auth from './auth';
import chats from './chats';
import chatMessages from './chatMessages';
import emergencyPosts from './emergencyPosts';
import posts from './posts';
import reports from './reports';
import otherUsers from './otherUsers';
import notifs from './notifs';

export default combineReducers({
    newsfeed,
    user,
    auth,
    chats,
    chatMessages,
    emergencyPosts,
    posts,
    reports,
    otherUsers,
    notifs,
})