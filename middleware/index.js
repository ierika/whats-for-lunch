// Go to the referrer URL if login is needed.
module.exports.requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        const referer = req.url || '/';
        res.redirect(`/login?next=${referer}`);
    }
    return next();
};
