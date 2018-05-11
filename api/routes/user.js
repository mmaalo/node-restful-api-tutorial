const express = require('express');
const router = express('router');

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');


router.post('/signup', UserController.user_post_newUser);

router.post('/login', UserController.user_post_login);

router.delete('/:userId', checkAuth.same_user_or_admin,  UserController.user_delete_userById);


module.exports = router;
