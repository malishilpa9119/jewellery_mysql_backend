const express = require('express');
const router = express.Router();
const { signUpValidation, loginValidation, updateProfileValidation } = require('../helpers/validation')
const userController = require('../controllers/userController')

const {isAuthorize} = require('../middleware/auth')

router.post('/signup',signUpValidation, userController.signup);
router.post('/login',loginValidation, userController.login);
router.get('/get-user',isAuthorize, userController.getUser);
router.put('/update',updateProfileValidation,isAuthorize,userController.update )

module.exports = router;