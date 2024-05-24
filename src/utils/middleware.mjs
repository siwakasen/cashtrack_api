import winston from 'winston';


export const loggingMiddleware = (req, res, next) => {
    if (req.user) {
        logger.info(`Requesting ${req.method} ${req.url} | ${req.ip} | ${req.user._id} | ${req.get('user-agent')} `);
    } else {
        logger.info(`Requesting ${req.method} ${req.url} | ${req.ip} | ${req.get('user-agent')} `);
    }
    next();
}

export const isLoggedin = (req, res, next) => {
    if (!req.session.user) {
        logger.error(`Auth Failed on ${req.method} ${req.url} | ${req.ip} | ${req.get('user-agent')} `);
        return res.status(401).json({
            message: 'Not Authenticated'
        });
    }
    next();
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
