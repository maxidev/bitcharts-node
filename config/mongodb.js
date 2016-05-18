var mongoose = require('mongoose');
var colors   = require('colors');

mongoose.connect('mongodb://localhost/bc_data', function(err, res) {
    if(err) {
      console.log(('[+] MongoDB '+err).red);
    }
    console.log('[+] Connected to MongoDB'.green);
    console.log('[-]');
});