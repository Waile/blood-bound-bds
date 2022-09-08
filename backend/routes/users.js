import express from 'express';
import { getUser, createUser, updateUser, deleteUser, searchUsers, getSupport, setForDelete, getUsersById } from '../controllers/users.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth)

router.get('/support', getSupport);
router.get('/', getUser);
router.post('/search/', searchUsers);
router.post('/usersById', getUsersById);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.patch('/delete/:id', setForDelete);
router.delete('/:id', deleteUser);

export default router;