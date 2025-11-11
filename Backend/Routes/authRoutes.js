const express = require('express');
const router = express.Router();
const signup = require('../Controller/AuthController/sigupController');
const login = require('../Controller/AuthController/loginController');
const logout  = require('../Controller/Authentication/logout');
const updateProfile = require('../Controller/Authentication/updateProfile');
const authenticate = require('../middlewares/authenticate');

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);
router.put('/update-profile',authenticate,updateProfile);

module.exports = router;
