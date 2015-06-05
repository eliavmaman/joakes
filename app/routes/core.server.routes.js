'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core');
	var paypal = require('../../app/controllers/paypal');
	app.route('/').get(core.index);
	app.route('/paypal').get(paypal.paypalPayment);
	app.route('/s3upload').get(core.getS3Policy);
};
