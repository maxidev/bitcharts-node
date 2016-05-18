var express     = require('express');
var router      = express.Router();
var colors      = require('colors');
var bitcoinAddr = require('bitcoin-address');
var RateLimiter = require('limiter').RateLimiter;
var limiter     = new RateLimiter(1, 'second', true);
var request     = require('request');

router.get('/walletinfo', function(req, res) {

   res.render('walletinfo', {wallet: '', valid_wallet: false});

});

function isValidWallet(req, res, next){
   if(!(bitcoinAddr.validate(req.params.addr))){
      res.json({success: false, message: "wallet inválida"});
   }else{
      return next();
   }
}

function rateLimiter (req, res, next) {
   limiter.removeTokens(1, function(err, remainingRequests) {
      if (remainingRequests < 0 && req.session.ignoreRateLimit===0) {
         res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
         res.end('Too Many Requests - your IP is being rate limited'+'\n'+'Need more responses? info@bitcharts.io');
      }else{
         return next();
      }
   });

}

router.get('/walletinfo/:addr', rateLimiter, function(req, res) {

   req.session.ignoreRateLimit = 3;

   if(!(bitcoinAddr.validate(req.params.addr))){
      res.render('walletinfo', {wallet: req.params.addr, valid_wallet: false});
   }else{
      res.render('walletinfo', {wallet: req.params.addr, valid_wallet: true});
   }
});

router.post('/walletinfo/balance/:addr', isValidWallet, rateLimiter, function(req, res) {

   req.session.ignoreRateLimit--;
   var wallet = req.params.addr || '';
   var btc, dolar_blue, dolar_ofi;

   request.post('http://10.132.189.37:5000/exchanges/calculator', function (error, response, body) {

     if (!error && response.statusCode == 200) {
       var data = JSON.parse(body);

       btc        = data.bitstamp.last;
      // dolar_blue = data.geeklab.last;
       dolar_ofi  = data.infobae_oficial.last;

       chain.getAddress(wallet, function(err, data) {

          if (err){
             res.json({success: false, message: 'error'});
          }

          data[0].confirmed.btc              = data[0].confirmed.balance/100000000;
          data[0].confirmed.satoshies        = data[0].confirmed.balance;
          data[0].confirmed.received         /= 100000000;
          data[0].confirmed.sent             /= 100000000;
          data[0].confirmed.bits             = data[0].confirmed.balance*1000000;
          data[0].confirmed.balance_usd      = +(data[0].confirmed.balance/100000000*btc).toFixed(2);
          data[0].confirmed.balance_ars_ofi  = +(data[0].confirmed.balance*btc/100000000*dolar_ofi).toFixed(2);
         //data[0].confirmed.balance_ars_blue = +(data[0].confirmed.balance*btc/100000000*dolar_blue).toFixed(2);

          res.json({success:true, balance: data[0]});
       });

     }else{
      res.json({success: false, message: 'error'});
     }
   });
});



router.post('/walletinfo/txs/:addr', isValidWallet, rateLimiter, function(req, res) {

   req.session.ignoreRateLimit--;
   var wallet   = req.params.addr || '';

   chain.getAddressTransactions(wallet, {limit: 2}, function(err, txs) {

   if (err){
      res.json({success: false, message: err});
   }

   if(txs.length === 0){

      res.json({success: true, txs: [], values: []});

   }else{


      var getValues = function(data) {

        var val;
        var is_input_info, is_output_info;
        var is_input  = false;
        var is_output = false;
        var satoshi   = 100000000;
        var re        = [];

        for (var j = 0; j < data.inputs.length; j++){
           for (var k = 0; k < data.inputs[j].addresses.length; k++){
              if(data.inputs[j].addresses[k] == wallet){
                 is_input = true;
                 is_input_info = j;
              }
           }
        }
        for (var m = 0; m < data.outputs.length; m++){
           for (var n = 0; n < data.outputs[m].addresses.length; n++){
              if(data.outputs[m].addresses[n] == wallet){
                 is_output = true;
                 is_output_info = m;
              }
           }
        }

        var resp;

        if (is_output && is_input){
           //CASE: sent & changeback

           val = (data.inputs[is_input_info].value - data.outputs[is_output_info].value)/satoshi;

           resp = {value: val, operation: 'sentchange', value_usd: +(val*btc).toFixed(2), value_ars_of: +(val*btc*dolar_ofi).toFixed(2)/*, value_ars_blue: +(val*btc*dolar_blue).toFixed(2)*/};

           return resp;

        }else if(is_input && !is_output){
           //CASE: only sent

           val = data.inputs[is_input_info].value/satoshi;

          resp = {value: val, operation: 'sent', value_usd: +(val*btc).toFixed(2), value_ars_of: +(val*btc*dolar_ofi).toFixed(2)/*, value_ars_blue: +(val*btc*dolar_blue).toFixed(2)*/};

          return resp;

        }else if(!is_input && is_output){

           //CASE: recv
           val = data.outputs[is_output_info].value/satoshi;

           resp = {value: val, operation: 'recv', value_usd: +(val*btc).toFixed(2), value_ars_of: +(val*btc*dolar_ofi).toFixed(2)/*, value_ars_blue: +(val*btc*dolar_blue).toFixed(2)*/};

           return resp;

        }else{
           //Problema cap 200 elementos addresses[]

           resp = {value: NaN, operation: 'error', value_usd: NaN, value_ars_of: NaN/*, value_ars_blue: NaN*/};

           return resp;
        }
      };

        chain.getTransaction(txs[0].hash, function(err, data) {

           request.post('http://10.132.189.37:5000/exchanges/calculator', function (error, response, body) {

              if (!error && response.statusCode == 200) {

                 var data_values = JSON.parse(body);

                 btc        = data_values.bitstamp.last;
                 //dolar_blue = data_values.geeklab.last;
                 dolar_ofi  = data_values.infobae_oficial.last;

                  var re = [];
                  re[0]  = getValues(data);

                  chain.getTransaction(txs[1].hash, function(err, data1) {


                      if((txs[0].fees).toString().length > 6){
                         txs[0].fees = txs[0].fees/10000000000;
                      }else{
                        txs[0].fees = txs[0].fees/100000000;
                      }
                      if((txs[1].fees).toString().length > 6){
                         txs[1].fees = txs[1].fees/10000000000;
                      }else{
                        txs[1].fees = txs[1].fees/100000000;
                      }

                      re[1] = getValues(data1);
                      res.json({success: true, txs: txs, values: re});
                  });

             }else{
                 console.log("error", error);
             }

           });//request.post

        }); //getTransaction

     }//else que hay tx

  });//chain.getAddressTransactions
});//router.post

router.post('/walletinfo/op_ret/:addr', isValidWallet, rateLimiter, function(req, res) {

   req.session.ignoreRateLimit--;
   var wallet = req.params.addr || '';

   chain.getAddressOpReturns(wallet, function(err, data) {

      if(err){
         res.json({success: false, message: err});
      }

      if(data.length === 0){
         res.json({success: true, data: ['N/A', 'N/A']});
      }else if(data.length == 1){
         res.json({success: true, data: [data.text, 'N/A']});
      }else{
         var resp = [];

         for (var i = 0; i < 2; i++) {
           resp[i] = data[i].text;
         }
         res.json({success: true, data: resp});
      }
   });
});

module.exports = router;
