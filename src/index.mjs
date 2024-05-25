import express from 'express';

import multer from 'multer';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import routes from './router/index.mjs';
import cookieParser from 'cookie-parser';
import { loggingMiddleware } from './utils/middleware.mjs';
import cors from 'cors';

dotenv.config();
const app = express();
const port = process.env.PORT;

//connect to localhost mongodb
// mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
//     .then(() => console.log('connected to database'))
//     .catch(err => console.log(err));

//connect to mongodb atlas

mongoose.connect(process.env.DB_CONNECTION_STRING, {
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});


app.use(multer().none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
        cookie: {
            httpOnly: true,
            maxAge: 60000 * 60 * 24,
            sameSite: 'none',
            secure: true,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(loggingMiddleware);
app.use(`/api`, routes);

app.listen(port, () => {
    console.log(`listening at ${process.env.BASE_URL}:${port}/api`);
});
