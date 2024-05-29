import { Router } from "express";
import categoryRouter from "./categories.mjs";
import expenseRouter from "./expenses.mjs";
import '../strategy/localStrategy.mjs';
import '../strategy/googleStrategy.mjs';
import { logger } from '../utils/middleware.mjs';
import dotenv from 'dotenv';
import { User } from '../mongoose/schemas/userSchema.mjs';

dotenv.config();
const routes = Router();
routes.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Hello this is CashTrack API',
    });
});

routes.post('/set-session', (req, res) => {
    const { user } = req.body;
    req.session.user = user;

    User.findOne({ email: user.email }).then(async (userdb) => {
        if (!userdb) {
            const newUser = new User({
                name: user.name,
                email: user.email,
                image: user.image,
            });
            await newUser.save();
        } else {
            if (userdb.name !== user.name) {
                userdb.name = user.name;
            }
            if (userdb.email !== user.email) {
                userdb.email = user.email;
            }
            if (userdb.image !== user.image) {
                userdb.image = user.image;
            }
            await userdb.save();
        }
    })
    res.status(200).send('Session set');
});


routes.post('/auth/logout', (req, res) => {
    req.session.destroy();
    return res.status(200).json({ message: 'Logged out' });
});

routes.get('/auth/status', (req, res) => {
    if (req.session.user) {
        return res.status(200).json({
            message: 'Login successful', user: req.user, session: req.session
        });
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
});

//all routes here
routes.use('/categories', categoryRouter);
routes.use('/expenses', expenseRouter);

export default routes;
