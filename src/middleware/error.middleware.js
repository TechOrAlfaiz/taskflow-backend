const errorHandler = (err, req, res, next) => {
    if (err.type === "entity.parse.failed" && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON body"
        });
    }
    if (err.type === "entity.too.large") {
        return res.status(413).json({
            message: "Request body is too large"
        });
    }
    console.error(err);

    return res.status(500).json({
        message: "Internal server error"
    });
};

module.exports = errorHandler;