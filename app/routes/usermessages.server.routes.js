'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var usermessages = require('../../app/controllers/usermessages.server.controller');

	// Usermessages Routes
	app.route('/usermessages')
		.get(users.requiresLogin, usermessages.read)
        .post(usermessages.addMessage);

    app.route('/usermessages/:userId')
      .get(users.requiresLogin, usermessages.read)
        .post(usermessages.addMessage);

    app.route('/usermessages/unreed/:messageId')
        .get(usermessages.countUnread)
        .post(usermessages.markAsViewed);

	// Finish by binding the Usermessage middleware
	app.param('usermessageId', usermessages.usermessageByID);
};
