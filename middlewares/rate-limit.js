const rateLimit = require('express-rate-limit')

const limitReached = (req, res) => {
  // what to do when our maximum request rate is breached
  console.warn({ ip: req.ip }, 'Rate limiter triggered')
  return Error(req, res)
}

const createAccountLimiter = rateLimit({
  // limit to five requests per hour
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many request from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
  // limit is reached
  handler: limitReached,
})

module.exports = rateLimit(createAccountLimiter)
