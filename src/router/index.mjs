import { Router } from "express";
import categoryRouter from "./categories.mjs";
import expenseRouter from "./expenses.mjs";
import '../strategy/localStrategy.mjs';
import '../strategy/googleStrategy.mjs';
import passport from "passport";
import { logger } from '../utils/middleware.mjs';
import dotenv from 'dotenv';

dotenv.config();
const routes = Router();
routes.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Hello this is CashTrack API',
    });
});




routes.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

routes.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    (req, res) => {
        req.logIn(req.user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'An error occurred during login' });
            }
            logger.info(`Received ${req.method} ${req.url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
            req.session.user = req.user;
            return res.redirect(`${process.env.FRONTEND_URL}`);
        });
    }
);

routes.get('auth/failure', (req, res) => {
    logger.error(`Received ${req.method} ${req.url} | ${req.ip} | ${req.get('user-agent')} `);
    return res.status(401).json({ message: 'Authentication failed' });
});

routes.post('/auth/logout', (req, res) => {
    console.log(req.session.cookie);
    console.log(req.session.user);
    logger.info(`Received ${req.method} ${req.url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
    req.session.destroy();
    return res.status(200).json({ message: 'Logged out' });
});

routes.get('/auth/status', (req, res) => {
    if (req.session.user) {
        logger.info(`Received ${req.method} ${req.url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
        return res.status(200).json({
            message: 'Login successful', user: req.user, session: req.session
        });
    } else {
        logger.error(`Failed on ${req.method} ${req.url} | ${req.ip} | ${req.get('user-agent')} `);
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
});

//all routes here
routes.use('/categories', categoryRouter);
routes.use('/expenses', expenseRouter);

export default routes;
