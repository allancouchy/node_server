const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')
const userCtrl = require('../controllers/user')

router.put('/:id', auth, multer, userCtrl.modifyUser)
router.delete('/:id', auth, multer, userCtrl.deleteUser)
router.get('/:id', auth, userCtrl.getOneUser)
router.get('/', auth, userCtrl.getAllUsers)

module.exports = router
