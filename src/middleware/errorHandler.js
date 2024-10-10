const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ status: false, message: err.message });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ status: false, message: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ status: false, message: 'Token expired' });
    }

    res.status(500).json({ status: false, message: err.message || 'Something went wrong' });
};

module.exports = errorHandler;