import winston from 'winston';
import { User } from '../mongoose/schemas/userSchema.mjs';
export const loggingMiddleware = async (req, res, next) => {
    if (req.session.user) {
        if (!req.user) {
            req.user = await User.findOne({ email: req.session.user.email });
            console.log(req.user);
        }
    }
    if (req.user) {
        logger.info(`Requesting ${req.method} ${req.url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
    } else {
        logger.info(`Requesting ${req.method} ${req.url} | ${req.ip} | ${req.get('user-agent')} `);
    }

    next();
}

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
