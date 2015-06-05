'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Userreview = mongoose.model('UserReview'),
  _ = require('lodash');
var q = require('q');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var nodemailer = require('nodemailer');
var config = require('../../config/config');
var User = mongoose.model('User');


/**
 * Show the current Usermessage
 */
exports.read = function (req, res) {
  console.log('--------------------' + req.params.userId);
  Userreview.find({user: req.params.userId}).exec(function (err, reviews) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reviews);
    }
  });
};


exports.add = function (req, res) {
  User.findById(req.params.userId)
    .exec(function (err, user) {

      var review = new Userreview(req.body);
      review.user = req.params.userId;
      review.save(function (err, savedComment) {

        if (err) {
          res.status(400).send(err);
        } else {
          console.log('user review saved');

          res.jsonp(savedComment);
        }
      });
    });
};
