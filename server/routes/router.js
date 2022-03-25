const auth = require('../auth')
const express = require('express')
const UserController = require('../controllers/user-controller')
const router = express.Router()

router.post('/register', UserController.registerUser)
router.post('/user', UserController.loginUser)
router.get('/logout', UserController.logoutUser)
router.get('/loggedIn', UserController.getLoggedIn)

module.exports = router