const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422;
        error.data = errors.array()
        throw error;

    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({ name: name, email: email, password: hashedPassword });
            return user.save();
        }).then(result => {
            res.status(201).json({
                status: 201,
                message: 'User created successfully.',
                data: result
            });
        }).catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            const error = new Error('Wrong password.');
            error.statusCode = 401;
            throw error;
        }

        const modifiedUser = removePasswordField(user);
        // console.log(modifiedUser);
        const token = jwt.sign({ email: user.email, userId: user._id.toString() },
            'SomeSuperSecreteSecret', { expiresIn: '12h' }
        );

        res.status(200).json({
            status: 200,
            message: 'Success',
            data: { token: token, user: modifiedUser }
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const removePasswordField = (user) => {
    user.password = undefined;
    return user;
}