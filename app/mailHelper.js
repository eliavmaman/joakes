
var nodemailer = require('nodemailer');
var mailDetails = {
    service: 'Mandrill',
  auth: {
    user: 'eliavmaman2@gmail.com',
    pass: 'NT0-XydGtF0rjc0oT60GAw'
  }

};

module.exports.sendMail = function(data, callback){

    if (process.env.NODE_ENV !== 'production'){
        callback();
        return;
    }

    var transporter = nodemailer.createTransport(mailDetails);

   var transporterData = {
        from: 'iteacher@gmail.com', // sender address
        to: data.to,
        subject: data.subject,
        text: data.html
   };

    transporter.sendMail(transporterData, callback);
};
