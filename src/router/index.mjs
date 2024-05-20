import { Router } from "express";
import usersRouter from "./users.mjs";
import '../strategy/localStrategy.mjs';
import '../strategy/googleStrategy.mjs';
import passport from "passport";
const routes = Router();
routes.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Hello this is CashTrack API',
    });
});


//FOR LOCAL STRATEGY/LOGIN ON API
routes.post('/auth', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'An error occurred during login' });
            }
            user.password = undefined;
            req.session.user = user;
            return res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res);
});

routes.get('/login', (req, res) => {
    res.send('<a href="auth/google"> Login with Google </a>');
});

routes.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Callback route that Google will redirect to after authentication
routes.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    (req, res) => {
        // Successful authentication, redirect home.
        req.logIn(req.user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'An error occurred during login' });
            }
            req.session.user = req.user;
            return res.status(200).json({ message: 'Login successful', user: req.user, session: req.session.user });
        });
    }
);

routes.get('auth/failure', (req, res) => {
    return res.status(401).json({ message: 'Authentication failed' });
});

routes.post('/auth/logout', (req, res) => {
    req.session.destroy();
    return res.status(200).json({ message: 'Logged out' });
});

routes.get('/auth/status', (req, res) => {
    return req.session.user ? res.status(200).json({
        session: req.session.user
    }) : res.status(401).json({
        message: 'Unauthorized'
    });
});

//all routes here
routes.use('/users', usersRouter);


export default routes;
