const User = require('../models/user')

exports.getCookies = (req, res, next) => {
  const cookies = req.cookies
  // return nothing if there are no cookies to save
  if (!cookies?._jwt) return null

  User.findOne({ tokens: cookies?._jwt })
    .then(user => {
      // delete cookies if no user found
      // user not authorized
      if (!user) {
        const options = {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        }

        res.clearCookie('_uid', options)
        res.clearCookie('_jwt', options)
        res.clearCookie('_urol', options)

        return res.status(401).json()
      }

      // send ok and cookies information if user is logged in
      const _uid = cookies?._uid
      const _jwt = cookies?._jwt
      const _urol = cookies?._urol

      res.status(200).json({ _uid, _jwt, _urol })
    })
    .catch(error => res.status(500).json({ error }))
}
