import { Router } from "express";
import categoryRouter from "./categories.mjs";
import expenseRouter from "./expenses.mjs";
import dotenv from 'dotenv';
import { User } from '../mongoose/schemas/userSchema.mjs';
import { loggingMiddleware, verifyToken } from '../utils/middleware.mjs';
dotenv.config();
const routes = Router();
routes.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Hello this is CashTrack API',
    });
});

routes.post('/auth/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
        const newUser = new User({
            ...req.body,
        });
        newUser.save();
        console.log(newUser);
        return res.status(200).json({ message: 'Registered', user: newUser });
    }
    return res.status(200).json({ message: 'Logged in', user: user });
});


//all routes here
routes.use('/categories', verifyToken, loggingMiddleware, categoryRouter);
routes.use('/expenses', verifyToken, loggingMiddleware, expenseRouter);

export default routes;
