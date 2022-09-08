import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedData = jwt.verify(token, process.env.SECRET);

        req.userId = decodedData?.id;
        next();
    } catch (error) {
        // console.log(error);
        return res.status(403).json({ errorMessage: "Invalid Token" });
    }
}