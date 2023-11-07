const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    first: { type: String },
    last: { type: String },
  },
  address: { type: String },
  imageUrl: { type: String },
  description: { type: String },
  roles: {
    user: { type: Number, default: 4059 },
    admin: { type: Number },
    host: { type: Number },
  },
  tokens: [String],
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
