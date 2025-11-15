const express = require('express');
const router = express.Router();
/* const upload = require('../middlewares/multer'); */

const { signup } = require('../controllers/authentication/signup');
const { login } = require('../controllers/authentication/login');
const { logout } = require('../controllers/authentication/logout');
const { updateProfile } = require('../controllers/authentication/updateProfile');
const { authenticate } = require('../middlewares/authenticate');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.put('/update-profile', authenticate, updateProfile);

module.exports = router;
