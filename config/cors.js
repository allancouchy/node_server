const origins = require('./allowed-origins')

const options = {
  origin: (origin, callback) => {
    if (origins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed By CORS'))
    }
  },
  optionsSuccessStatus: 200,
}

module.exports = options
