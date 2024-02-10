const express = require('express');
const { body } = require('express-validator');

const feedController = require('../contollers/feed');
const idAuth = require('../middleware/is-auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const createTitleChain = () => body('title').trim().isLength({ min: 5 });
const createContentChain = () => body('content').trim().isLength({ min: 5 });

router.get('/posts', isAuth, feedController.getPosts);

router.post('/create-post', isAuth, [createTitleChain(), createContentChain()], feedController.createPost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/update-post/:postId', isAuth, [createTitleChain(), createContentChain()], feedController.updatePost);

router.delete('/delete-post/:postId', isAuth, feedController.deletePost);

module.exports = router;