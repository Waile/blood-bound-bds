import express from 'express';
import { getPosts, createPost, updatePost, searchPosts, getPostsById } from '../controllers/posts.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', getPosts);
router.post('/postsById', getPostsById);
router.post('/search/', searchPosts);
router.post('/', createPost);
router.patch('/:id', updatePost);

export default router;