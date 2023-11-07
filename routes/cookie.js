const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/cookie')

router.get('/', userCtrl.getCookies)

module.exports = router