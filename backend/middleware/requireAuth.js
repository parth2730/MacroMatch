const User = require("../models/User");

async function requireAuth(req, res, next) {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ message: "Not authenticated. Please log in." });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            req.session.destroy(() => {});
            return res.status(401).json({ message: "Session is no longer valid. Please log in." });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = requireAuth;
