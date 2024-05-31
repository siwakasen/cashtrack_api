import express from 'express';

import multer from 'multer';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import dotenv from 'dotenv';
import routes from './router/index.mjs';
import cookieParser from 'cookie-parser';
import { loggingMiddleware } from './utils/middleware.mjs';

import cors from 'cors';
dotenv.config();
const app = express();
const port = process.env.PORT;
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionSuccessStatus: 200,
};
function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}
mongoose.connect(process.env.DB_CONNECTION_STRING, {
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(setCorsHeaders);
app.use(express.json());
app.use(loggingMiddleware);
app.use(`/api`, routes);

app.listen(port, () => {
    console.log(`listening at port:${port}`);
});
