'use strict';

module.exports = function (app) {
  var users = require('../../app/controllers/users.server.controller');
  var userreviews = require('../../app/controllers/userreview.server.controller');


  app.route('/userreviews/:userId')
    .get(users.requiresLogin, userreviews.read)
    .post(userreviews.add);
};
