const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


// Connect mongoose to database
// Connect to database
  mongoose.connect('mongodb://node-rest-shop-USER:d7lkj2@localhost:27017/node-rest-shop');
  mongoose.Promise = global.Promise;


// Morgan logging package middleware
app.use(morgan('dev'));

// Make uploads folder public - express  middleware
app.use('/uploads', express.static('uploads'));

// Body parser middleware - parse the body of incoming requests and use the data easily
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Routes witch handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

// Error handling if route is not found
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404;
  next(error);
});

// Error handling, global error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
