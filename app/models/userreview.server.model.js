'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Usermessage Schema
 */
var UserReviewSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  review: {
    type: String,
    default: '',
    required: 'Please fill review',
    trim: true
  }
});

mongoose.model('UserReview', UserReviewSchema);
