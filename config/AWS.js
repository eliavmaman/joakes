'use strict';

var AWS = require('aws-sdk'),
    crypto = require('crypto'),
    config = require('./aws.json'),
    createS3Policy,
    getExpiryTime;

getExpiryTime = function () {
    var _date = new Date();
    return '' + (_date.getFullYear()) + '-' + (_date.getMonth() + 1) + '-' +
        (_date.getDate() + 1) + 'T' + (_date.getHours() + 3) + ':' + '00:00.000Z';
};

exports.createS3Policy = function(contentType, callback) {
    var date = new Date();
    var s3Policy = {
        'expiration': getExpiryTime(),
        'conditions': [
            {'bucket': config.bucket},
            ['starts-with', '$key', ''],
            {'acl': 'public-read'},
            ['starts-with', '$Content-Type', ''],
            [ 'content-length-range', 0, 10 * 1024 * 1024 ]
        ]
    };

    // stringify and encode the policy
    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

    // sign the base64 encoded policy
    var signature = crypto.createHmac('sha1', config.secretAccessKey)
        .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

    // build the results object
    var s3Credentials = {
        policy: base64Policy,
        signature: signature,
        key: config.accessKeyId
    };

    // send it back
    callback(s3Credentials);
};
