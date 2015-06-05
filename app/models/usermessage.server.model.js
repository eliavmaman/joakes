'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Usermessage Schema
 */
var UsermessageSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  name: {
    type: String,
    default: '',
    required: 'Please fill name ',
    trim: true
  },
  subject: {
    type: String,
    default: '',
    required: 'Please fill subject ',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill email ',
    trim: true
  },
  message: {
    type: String,
    default: '',
    required: 'Please fill message subject',
    trim: true
  },
  viewed: {
    type: Boolean,
    default: false
  }

});

mongoose.model('Usermessage', UsermessageSchema);
