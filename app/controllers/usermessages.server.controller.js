'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Usermessage = mongoose.model('Usermessage'),
  _ = require('lodash');
var q = require('q');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var nodemailer = require('nodemailer');
var config = require('../../config/config');
var User = mongoose.model('User');


/**
 * Create a Usermessage
 */
exports.create = function (user) {
  var defered = q.defer();
  var usermessage = new Usermessage({
    user: user,
    messages: []
  });

  usermessage.save(function (err) {
    if (err) {
      defered.reject(err);
    } else {
      user.messages = usermessage;

      user.save(function (err, user) {
        if (err) {
          defered.reject(err);
        } else {
          defered.resolve(usermessage);
        }
      })
    }
  });

  return defered.promise;
};

/**
 * Show the current Usermessage
 */
exports.read = function (req, res) {
  console.log('--------------------' + req.user._id);
  Usermessage.find({user:req.user._id}).exec(function(err,messages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(messages);
    }
  });
  //getByUserId(req.user._id).then(function (user) {
  //
  //  if (userMessages === null) {
  //    exports.create(req.user).then(function (data) {
  //      res.jsonp(data);
  //    }, function (err) {
  //      res.status(400).send(err);
  //    });
  //  } else {
  //    var messages = userMessages.messages.reverse();
  //    res.jsonp(messages);
  //  }
  //}, function (err) {
  //  res.status(400).send(err);
  //});
};

exports.countUnread = function (req, res) {
  Usermessage.findById(req.user.messages).exec(function (err, messages) {
    if (err) {
      res.status(400).send(err);
    } else {
      var count = messages.messages.filter(function (item) {
        return !item.viewed;
      }).length;
      res.send({'count': count})
    }
  });
};

exports.markAsViewed = function (req, res) {
  Usermessage.findById(req.user.messages).exec(function (err, messages) {
    if (err) {
      res.status(400).send(err);
    } else {
      var message = messages.messages.filter(function (item) {
        return item._id.toString() === req.params.messageId;
      })[0];

      if (!message) {
        res.status(400).send('message was not found. ');
      } else {
        message.viewed = true;
        messages.save(function (err, data) {
          res.status(200).send('saved');
        })
      }
    }
  });
};


exports.addMessage = function (req, res) {
  User.findById(req.params.userId)
    .exec(function (err, user) {

      var message = new Usermessage(req.body);
      message.user = req.params.userId;
      message.save(function (err) {

        if (err) {
          res.status(400).send(err);
        } else {
          console.log('userMessage saved');
          //var message = user.messages[user.messages.length - 1];
          res.render('templates/message-received', {
            url: 'http://' + req.headers.host + '/#!/profile/messages/' + message._id
          }, function (err, emailHTML) {
            var smtpTransport = nodemailer.createTransport(config.mailer.options);
            var mailOptions = {
              to: user.email,
              from: config.mailer.from,
              subject: 'התקבלה הודעה חדשה',
              html: emailHTML
            };

            smtpTransport.sendMail(mailOptions, function (err) {
              res.status(201).send('message created');
            });
          });
        }
      });
    });


  //User.findById(req.params.userId)
  //  .populate('messages')
  //  .exec(function (err, user) {
  //    user = user._doc;
  //    user.messages=new Usermessage();
  //    var userMessages = user.messages;
  //
  //    try {
  //
  //      // old users dont have a messages array
  //      if (!userMessages.messages) {
  //        userMessages.messages = [];
  //      }
  //      userMessages.messages.push(req.body);
  //    } catch (e) {
  //      console.log('invalid message');
  //      res.status(400).send('invalid message');
  //      return;
  //    }
  //
  //
  //  }, function (err) {
  //    res.status(400).send(err);
  //  });
};

/**
 * Usermessage middleware
 */
exports.usermessageByID = function (req, res, next, id) {
  Usermessage.findById(id).populate('user', 'displayName').exec(function (err, usermessage) {
    if (err) return next(err);
    if (!usermessage) return next(new Error('Failed to load Usermessage ' + id));
    req.usermessage = usermessage;
    next();
  });
};

/**
 * Usermessage authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.usermessage.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};


function getByUserId(userId) {
  var deferred = q.defer();

  Usermessage.where('user').equals(userId).findOne(function (err, userMessages) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(userMessages);
    }
  });

  return deferred.promise;
}
