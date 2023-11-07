const mongoose = require('mongoose')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const connectDB = require('./config/database')
const credentials = require('./middlewares/credentials')
const options = require('./config/cors')
const errorHandler = require('./config/error-handler')
const PORT = process.env.PORT || 3300

// define routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const cookieRoutes = require('./routes/cookie')

// dotenv config
dotenv.config()

// connect to MongoDB
connectDB()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// handle options credentials check - before CORS!
// fetch cookies credentials requirement
app.use(credentials)

// cross origin resource sharing
app.use(cors(options))

// middleware handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

// serve static files
app.use('/images', express.static(path.join(__dirname, 'images')))

// routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/lodges', productRoutes)
app.use('/cookies', cookieRoutes)

// error handler
app.use(errorHandler)

mongoose.connection.once('open', () => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`))
})
