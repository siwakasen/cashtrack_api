import express from 'express';

import multer from 'multer';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import routes from './router/index.mjs';
import { API_PREFIX } from './utils/constant.mjs';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const port = process.env.PORT;

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    .then(() => console.log('connected to database'))
    .catch(err => console.log(err).status(500));

const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.path} | ${req.ip} | ${new Date().toISOString()} | ${req.get('user-agent')}`);
    next();
}

app.use(multer().none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: 60000 * 60 * 24,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(loggingMiddleware);
app.use(`${API_PREFIX}`, routes);

app.listen(port, () => {
    console.log(`listening at ${process.env.BASE_URL}:${port}`);
});
