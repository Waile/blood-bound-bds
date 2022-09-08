import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'

import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import emergencyRoutes from './routes/emergency.js';
import reportRoutes from './routes/reports.js';
import chatRoutes from './routes/chats.js';
import loginSignUpRoutes from './routes/loginSignup.js';
import verifyRoutes from './routes/verification.js';
import mapRoutes from './routes/maps.js';
import notifyRoutes from './routes/notify.js'

import { watch } from './utils/timer.js';

dotenv.config()

const app = express();

app.use(express.json({ limit: "30mb", extended: true })); //limit json size to cater to images
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())

const ATLAS_URI = process.env.ATLAS_URI;
const PORT = process.env.PORT || 5000;

app.use('/loginSignUp', loginSignUpRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/emergency', emergencyRoutes);
app.use('/reports', reportRoutes);
app.use('/chats', chatRoutes);
app.use('/verify', verifyRoutes);
app.use('/map', mapRoutes);
app.use('/notify', notifyRoutes);

app.get('/', (req, res) => {
    res.send('Deadline Passed Please Sorry');
});

mongoose.connect(ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.log(err.message))
    .then(() => watch());