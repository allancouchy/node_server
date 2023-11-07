const Product = require('../models/product')
const fs = require('fs')

exports.createProduct = (req, res, next) => {
  const productObject = JSON.parse(req.body.product)
  delete productObject._id
  delete productObject._userId

  // create product
  const product = new Product({
    ...productObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  })

  product
    .save()
    .then(() => res.status(201).json())
    .catch(error => res.status(400).json({ error }))
}

exports.getOneProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then(product => res.status(200).json(product))
    .catch(error => res.status(500).json({ error }))
}

exports.getAllProducts = (req, res, next) => {
  Product.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(500).json({ error }))
}

exports.modifyProduct = (req, res, next) => {
  const productObject = req.file
    ? {
        ...JSON.parse(req.body.product),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body }

  delete productObject._userId
  Product.findOne({ _id: req.params.id })
    .then(product => {
      // user id and auth user id do not match
      // user not authorized
      if (product.userId !== req.auth.userId) return res.status(401).json()

      // update product
      Product.updateOne({ _id: req.params.id }, { ...productObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Modified' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.deleteProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then(product => {
      // user id and auth user id do not match
      // user not authorized
      if (product.userId !== req.auth.userId) return res.status(401).json()

      // delete product
      const filename = product.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Product.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Deleted' }))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.createLike = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
  .then(product => {
    let userId = req.auth.userId
    let like = req.body.like
    
    // create like
    if (like === 1) {
      Product.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
      .then(() => res.status(200).json())
      .catch(error => res.status(400).json({ error }))
    }
    
    // user cancelled his like
    if (like === 0) {
      if (product.usersLiked.includes(userId)) {
        Product.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
        .then(() => res.status(200).json())
        .catch(error => res.status(400).json({ error }))
      }
    }
  })
  .catch(error => res.status(500).json({ error }))
}