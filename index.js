const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./server/models/User');
const { auth } = require('./server/middleware/auth');

const config = require('./server/config/key');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse various different custom JSON types as JSON
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/users/register', (req, res) => {
  // store information needed for registering into db
  const user = new User(req.body);
  user.save((err, userInfo) => {
    console.log(userInfo);
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post('/api/users/login', (req, res) => {
  // check if email exists in db
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "User email doesn't exist.",
      });
    }

    // if email exists in db, check if pwd matches
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' });

      // if pwd matches, generate token
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // need to store token.  but where?   local storage, cookie
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.username,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

app.get('/api/hello', (req, res) => {
  return res.send('안녕하세요~');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening at localhost:${port}`);
});
