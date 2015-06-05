'use strict';
var AWS = require('../../config/AWS');
//var nodemailer = require('nodemailer');
var config = require('../../config/config');
/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null
	});
};

exports.getS3Policy = function (req, res, next) {
	AWS.createS3Policy(req.query.mimeType, function (creds, err) {
		if (!err) {
			return res.send(200, creds);
		} else {
			return res.send(500, err);
		}
	});
};
