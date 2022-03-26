const auth = require('../auth')
const express = require('express')
const UserController = require('../controllers/user-controller')
const GameController = require('../controllers/game-controller')
const router = express.Router()

router.get('/search/:query', auth.verify, GameController.search)
router.get('/game/:gameID', auth.verify, GameController.getGame)
router.put('/game/:gameID', auth.verify, GameController.updateGame)         //3 and 4 since they are the same thing (update vote/update comment)
router.put('/game/:email/followers', auth.verify, UserController.updateFollowers)

router.post('/register', UserController.registerUser)
router.post('/user', UserController.loginUser)
router.get('/logout', UserController.logoutUser)
router.get('/loggedIn', UserController.getLoggedIn)

module.exports = router