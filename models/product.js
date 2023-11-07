const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  location: { type: String, required: true },
  likes: { type: Number, default: 0 },
  usersLiked: { type: [String], require: true },
})

module.exports = mongoose.model('Product', productSchema)
