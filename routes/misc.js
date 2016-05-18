var express     = require('express');
var router      = express.Router();
var bitcoin     = require('bitcoinjs-lib');
var RateLimiter = require('limiter').RateLimiter;
var request     = require('request');

var limiter = new RateLimiter(10, 'second', true);

function rateLimiter (req, res, next) {

   limiter.removeTokens(1, function(err, remainingRequests) {
      if (remainingRequests < 0) {
         res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
         res.end('Too Many Requests - your IP is being rate limited'+'\n'+'Need more responses? info@bitcharts.io');
      }else{
         return next();
      }
   });
}

router.post('/api/walletgen', rateLimiter, function(req, res) {
   var key = bitcoin.ECKey.makeRandom();
   res.json({wallet: key.pub.getAddress().toString(), privKey: key.toWIF()});
});

router.post('/api/ticker', rateLimiter, function(req, res) {

   request.post('http://10.132.189.37:5000/api/ticker', function (error, response, body) {
     if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.json({success: true, message: data});
     }else{
      res.json({success: false, message: 'error'});
     }
   });
});

router.get('/api/ticker', rateLimiter, function(req, res) {

   request.post('http://10.132.189.37:5000/api/ticker', function (error, response, body) {
     if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.json({success: true, message: data});
     }else{
      res.json({success: false, message: 'error'});
     }
   });
});


router.post('/internal/calc', rateLimiter, function(req, res) {

   request.post('http://10.132.189.37:5000/exchanges/calculator', function (error, response, body) {
     if (!error && response.statusCode == 200){
      var data = JSON.parse(body);
      res.json(data);
     }
   });

});

router.post('/api/graphs/:name', function(req, res) {

  request.post('http://10.132.189.37:5000/exchanges/graphs/'+req.params.name+'?graph_type=linear', function(error, response, body) {

      if (!error && response.statusCode == 200) {
       var data = JSON.parse(body);
       res.jsonp(data);
      }
  });

});

router.post('/api/candlesticks', function(req,res) {

  request.post('http://10.132.189.37:5000/exchanges/graphs/bitstamp?graph_type=candlesticks', function (error, response, body) {

    if (!error && response.statusCode == 200) {
     var data = JSON.parse(body);
     res.json(data);
    }
  });

});

router.post('/exchanges/info', rateLimiter, function(req, res) {

  request.post('http://10.132.189.37:5000/exchanges/info', function (error, response, body) {

    if (!error && response.statusCode == 200) {
     var data = JSON.parse(body);
     res.json(data);
    }

  });
});

router.post('/api/graphs/usd/:tipo', function(req, res) {

  request.post('http://10.132.189.37:5000/exchanges/graphs/infobae_'+req.params.tipo+'?graph_type=linear', function(error, response, body) {

      if (!error && response.statusCode == 200) {
       var data = JSON.parse(body);
       res.json(data);
      }
  });

});

router.post('/internal/stats', rateLimiter, function(req, res) {

  request.get('http://blockchain.info/es/stats?format=json', function(error, response, body) {

      if (!error && response.statusCode == 200) {
       var data = JSON.parse(body);
       res.json(data);
      }
  });

});

router.post('*', function(req, res) {
   res.json({success: false, message: 'invalid route please read the docs'});
});


module.exports = router;
