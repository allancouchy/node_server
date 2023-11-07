const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/auth')

router.post('/signup', authCtrl.handleSignup)
router.post('/login', authCtrl.handleLogin)
router.post('/logout', authCtrl.handleLogout)

module.exports = router