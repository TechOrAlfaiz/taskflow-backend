const { rateLimit } = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many authentication requests. Try again later."
    }
});

module.exports = authLimiter;