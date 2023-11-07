const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')
const productCtrl = require('../controllers/product')

router.post('/', auth, multer, productCtrl.createProduct)
router.put('/:id', auth, multer, productCtrl.modifyProduct)
router.delete('/:id', auth, productCtrl.deleteProduct)
router.get('/:id', auth, productCtrl.getOneProduct)
router.get('/', auth, productCtrl.getAllProducts)
router.post('/:id/like', auth, productCtrl.createLike)

module.exports = router
