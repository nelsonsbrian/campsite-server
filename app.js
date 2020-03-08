const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const { mongoUrl } = require('./config');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/updloadRouter');
const favoriteRouter = require('./routes/favoriteRouter');

const app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
    res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
})

const connect = mongoose.connect(mongoUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

connect.then(() => {
  console.log('Connected to Mongodb');
}, err => console.log(err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/campsites', campsiteRouter);
app.use('/api/promotions', promotionRouter);
app.use('/api/partners', partnerRouter);
app.use('/api/imageUpload', uploadRouter);
app.use('/api/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
