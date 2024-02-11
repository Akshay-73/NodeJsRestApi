const express = require('express');

const userController = require('../contollers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/me', isAuth, userController.getUser);

module.exports = router;