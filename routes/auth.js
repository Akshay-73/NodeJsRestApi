const express = require('express');
const { body } = require('express-validator');

const authController = require('../contollers/auth');
const User = require('../models/user');

const createEmailChain = () => body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
            return Promise.reject('E-Mail address already exists.')
        }
    })
}).normalizeEmail();
const createPasswordChain = () => body('password').trim().isLength({ min: 5 });
const createNameChain = () => body('name').trim().not().isEmpty();

const router = express.Router();

router.put('/signup', [createEmailChain(), createPasswordChain(), createNameChain()], authController.signUp);

router.post('/login', authController.login);

module.exports = router;