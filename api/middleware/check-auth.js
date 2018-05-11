const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

exports.logged_in = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    console.log(req.userData);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
};

exports.same_user_or_admin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;

    if (req.userData.userId === req.params.userId) {
      next()
    } else {
      User.findById(req.userData.userId)
        .exec()
        .then(doc => {
          if (doc.userType === "admin") {
            next()
          } else {
            return res.status(401).json({
              message: 'Auth failed'
            });
          }
        })
        .catch(err => {
          console.log(err);
          return res.status(500).json({
            error: err
          });
        });

    }

  } catch (error) {
    return res.status(500).json({
      message: error
    });
  }

}

// TODO: sjekke om nåværende bruker har admin rettignheter


  // TODO: hvis ett av alternativener er oppfyllt slett bruker
