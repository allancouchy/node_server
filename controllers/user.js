const fs = require('fs')
const User = require('../models/user')

exports.modifyUser = (req, res, next) => {
  const userObject = req.file
    ? {
        ...JSON.parse(req.body.user),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body }

  delete userObject._userId
  User.findOne({ _id: req.params.id })
    .then(user => {
      // user id and auth user id do not match
      // user not authorized
      if (user.userId !== req.auth.userId) return res.status(401).json()

      // update user
      User.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Modified' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.deleteUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(user => {
      // user id and auth user id do not match
      // user not authorized
      if (user.userId !== req.auth.userId) return res.status(401).json()

      // delete user
      const filename = user.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        User.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Deleted' }))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json({ error }))
}

exports.getAllUsers = (req, res, next) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(500).json({ error }))
}
