var express  = require('express');
var router   = express.Router();


router.get('/', function(req, res) {
   res.render('index', {});
});


router.get('/ad', function(req, res) {
   res.render('index-ad', {});
});


router.get('/doc', function(req, res) {
   res.render('doc', {});
});

router.post('/i18n/:lang', function(req, res) {
   var ok = false;
   if(typeof req.params.lang !== 'undefined') {
      res.setLocale(req.session.params.lang);
      req.session.locale = req.params.lang;
      ok = true;
   }
   res.send({success: ok });
});

module.exports = router;
