import user from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const Auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const verifiedUser = jwt.verify(token, process.env.SECRET);
        console.log('Auth middleware - Token verified, user ID from token:', verifiedUser.id);
        
        const rootUser = await user.findOne({ _id: verifiedUser.id }).select('-password');
        
        if (!rootUser) {
            console.log('Auth middleware - User not found for ID:', verifiedUser.id);
            return res.status(401).json({ error: 'User not found' });
        }
        
        console.log('Auth middleware - User found:', rootUser.email, rootUser.name);
        
        req.token = token;
        req.rootUser = rootUser;
        req.rootUserId = rootUser._id;
        next();
    } catch (error) {
        console.log('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
}