export const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.path} | ${req.ip} | ${new Date().toISOString()} | ${req.get('user-agent')}`);
    next();
}
export const isLoggedin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: 'Not Authenticated'
        });
    }
    next();
};
