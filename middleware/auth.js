const { User } = require('../models/User');

let auth = (req, res, next) => {
  // handle authentication

  // get token from client's cookie
  let token = req.cookies.x_auth;

  // decrypt token and find user
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
  // if user exists, auth Okay

  // else user doesn't exist, auth NO
};

module.exports = { auth };
