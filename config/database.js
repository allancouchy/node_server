const mongoose = require('mongoose')

const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log('No Database Connexion'))
}

module.exports = connectDB
