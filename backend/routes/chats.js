import express from 'express';
import { createChat, addMessage, getChat, getMessagesById, getChatsById, updateChat } from '../controllers/chats.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth)

router.post('/messagesById', getMessagesById);
router.post('/chatsById', getChatsById);
router.post('/search', getChat);
router.post('/:id', addMessage);
router.post('/', createChat);
router.patch('/:id', updateChat);

export default router;