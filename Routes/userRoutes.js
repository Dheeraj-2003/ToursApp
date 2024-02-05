const express = require('express');
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

//Routes

const router = express.Router();

router.route('/').get(userController.getAllUsers).post(userController.createUser)

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)

router.post('/forgotPassword',authController.forgotPassword)
router.post('/resetPassword', authController.resetPasseword)

router.route('/:id').get(userController.getUSerById).patch(userController.updateUser).delete(userController.deleteUser)

module.exports=router;