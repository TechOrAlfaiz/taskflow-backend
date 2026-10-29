const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if(
        typeof authorization !== "string" ||
        !authorization.startsWith("Bearer ")
    ){
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    const token = authorization.slice(7).trim();

    try{
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        if(typeof payload.sub !== "string" || !payload.sub){
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.userId = payload.sub;
    }catch(error){
        if(
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ){
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        return next(error);
    }

    next();
};

module.exports = requireAuth;