import winston from 'winston';
import { User } from '../mongoose/schemas/userSchema.mjs';
import jwt from 'jsonwebtoken';

export const loggingMiddleware = async (req, res, next) => {
    logger.info(`Requesting... ${req.method} ${req.url} ${req.ip} ${req.user._id} ${req.headers['user-agent']}`);
    console.log(`${req.method} ${req.url}`);
    next();
}

export const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({
        message: 'No authorization',
        data: [],
    });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        const user = await User.findOne({ email: req.user.id });
        req.user._id = user._id;
    } catch (err) {
        return res.status(401).json({
            message: 'No authorization',
            data: [],
        });
    }
    return next();
};

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.File({ filename: ".logs/app.log" }),
    ],
});
