'use strict';
var paypal_api = require('paypal-rest-sdk');


paypal_api.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AXRPBHawhW4jBLfd0FcgLloV7oh-fjeNjrIY3FcOrQyJ2olTrmsWXm5Ne_TeK7J8izqnOzLZ3MuHWwTP',
  'client_secret': 'ENw_CuwHgTEP3W4O6-8tOqE4j634QAo4b7s5jHGX42Mpr6Hq3JM_N7k7LQsArx3a6OKNipUs-gZB9g6M'
});

var config_opts = {
  'mode': 'sandbox',

  'client_id': 'AXRPBHawhW4jBLfd0FcgLloV7oh-fjeNjrIY3FcOrQyJ2olTrmsWXm5Ne_TeK7J8izqnOzLZ3MuHWwTP',
  'client_secret': 'ENw_CuwHgTEP3W4O6-8tOqE4j634QAo4b7s5jHGX42Mpr6Hq3JM_N7k7LQsArx3a6OKNipUs-gZB9g6M'
};

var card_data = {
  "type": "visa",
  "number": "4417119669820331",
  "expire_month": "11",
  "expire_year": "2018",
  "cvv2": "123",
  "first_name": "Joe",
  "last_name": "Shopper"
};



exports.paypalPayment=function(){
  paypal_api.creditCard.create(card_data, function(error, credit_card){
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Create Credit-Card Response");
      console.log(credit_card);
    }
  })
};

