const User = require('../models/user');

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.userId }, { password: 0 });
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            status: 200,
            message: 'Success',
            data: user
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}