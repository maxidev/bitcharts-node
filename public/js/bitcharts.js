angular.module('bitcharts', [])
   .controller('calcController', function($scope, $http, $filter) {

    var vm = this;

      $http({method: 'POST', url: '/internal/calc'})
         .success(function(data){

            vm.values = data;
            console.log(vm.values.infobae_oficial.last);

            vm.getSourceValue = function(){
               switch (vm.source){
                  case "argenbtc.com":
                     return vm.values.argenbtc.last;
                  case "bitcharts.io":
                     return vm.values.bitcharts.last;
                  case "bitcoinaverage.com":
                     return vm.values.bitcoin_average.last;
                  case "bitex.la":
                     return vm.values.bitex.last;
                  case "bitfinex.com":
                     return vm.values.bitfinex.last;
                  case "bitstamp.net":
                     return vm.values.bitstamp.last;
                  case "ripio.com":
                     return vm.values.ripio.last;
                  case "satoshitango.com":
                     return vm.values.satoshi_tango.last;
                  default:
                   return NaN;
               } //switch
            }; // getSourceValue

            vm.getNativeCurrency = function(){
               switch (vm.source){
                  case "argenbtc.com":
                     return vm.values.argenbtc.currency_to;
                  case "bitcharts.io":
                     return vm.values.bitcharts.currency_to;
                  case "bitcoinaverage.com":
                     return vm.values.bitcoin_average.currency_to;
                  case "bitex.la":
                     return vm.values.bitex.currency_to;
                  case "bitfinex.com":
                     return vm.values.bitfinex.currency_to;
                  case "bitstamp.net":
                     return vm.values.bitstamp.currency_to;
                  case "ripio.com":
                     return vm.values.ripio.currency_to;
                  case "satoshitango.com":
                     return vm.values.satoshi_tango.currency_to;
                  case "unisend.com":
                     return vm.values.unisend.currency_to;
                  default:
                     return NaN;
               } //switch
            }; // getNativeCurrency

            vm.setTabBtc = function (){
               if (vm.cur == "ARS"){
                  return "ARS";
               }else{
                  return "USD";
               }
            };

            vm.setTabArs = function (){
               if (vm.fiatCur == "ARS"){
                  return "ARS";
               }else {
                  return "USD";
               }
            };

            vm.getDolarBlue = function (){
               return vm.values.infobae_oficial.last;
            }; // getDolarBlue

            vm.getTimestamp = function(){
               return vm.values._timestamp;
            }; // getTimestamp

            vm.getPercent = function(){
               return vm.percent;
            }; // getPercent

            vm.getOperation = function(){
               return vm.percentOperation;
            };// getOperation

            vm.getCurrency = function () {
               if (vm.cur == "ARS") {
                  return vm.values.infobae_oficial.last;
               }else if (vm.cur == "USD"){
                  return 1;
               }else{
                  return NaN;
               }
            }; // getCurrency

            vm.setPercent = function(get_sourValue, get_cur, cant){

               var source       = get_sourValue;
               var currency     = get_cur;
               var cantidad     = cant;
               var nat_currency = vm.getNativeCurrency();
               vm.nSource       = nat_currency;
               var cant_final   = '';
               var toCur        = vm.cur;

                 if (toCur == "ARS" && nat_currency == "ARS"){
                     cant_final = cantidad*source;
                 }else if(toCur == "ARS" && nat_currency == "USD"){
                     cant_final = cantidad*source*(vm.values.infobae_oficial.last);
                 }else if(toCur == "USD" && nat_currency == "ARS"){
                     cant_final = cantidad*source/(vm.values.infobae_oficial.last);
                 } else if(toCur == "USD" && nat_currency == "USD"){
                     cant_final = cantidad*source;
                 }else{
                     cant_final = NaN;
                 }

               if (vm.percentOperation == "+") {
                  return cant_final + (cant_final*vm.percent)/100;
               }else{
                  return cant_final - (cant_final*vm.percent)/100;
               }
            }; // SetPercent

            vm.setDivColor = function (){

               if(vm.percent !== 0){
                  if (vm.percentOperation == "+"){
                     //return "#5CB85C";
                     return "#A2CD5A";
                  }else{
                     //return "#D9534F"
                     return "#F5785A";
                  } // cierra if 2
               }else{
                  return "#272822";
               } // cierra if principal
            }; // setDivColor

            vm.fixSharePercent = function(){

               if(vm.percent === 0){
                  return '';
               }else{
                  if (vm.percentOperation == "+"){
                     return "(más " + vm.percent + "%)";
                  }else{
                     return "(menos " + vm.percent + "%)";
                  }
               }
            }; // fixSharePercent


              vm.setBtcCant = function (){

               var cantTempBtc;
               var cantFinalBtc;
               var nat_currency = vm.getNativeCurrency();

               if(vm.fiatCur == "ARS" && nat_currency == "USD"){

                  cantTempBtc =  vm.fiatcant / vm.values.infobae_oficial.last;

                  switch (vm.source){
                     case "bitcoinaverage.com":
                        return cantTempBtc / vm.values.bitcoin_average.last;
                     case "bitex.la":
                        return cantTempBtc / vm.values.bitex.last;
                     case "bitfinex.com":
                       return cantTempBtc / vm.values.bitfinex.last;
                     case "bitstamp.net":
                        return cantTempBtc / vm.values.bitstamp.last;
                     default:
                        return NaN;
                  }

               }else if(vm.fiatCur == "ARS" && nat_currency == "ARS"){

                  switch(vm.source){
                     case "argenbtc.com":
                        return vm.fiatcant / vm.values.argenbtc.last;
                     case "bitcharts.io":
                        return vm.fiatcant / vm.values.bitcharts.last;
                     case "ripio.com":
                        return vm.fiatcant / vm.values.ripio.last;
                     case "satoshitango.com":
                        return vm.fiatcant / vm.values.satoshi_tango.last;
                     default:
                        return NaN;
                  }

               }else if(vm.fiatCur == "USD" && nat_currency == "USD"){

                  switch (vm.source){
                     case "bitcoinaverage.com":
                        return vm.fiatcant / vm.values.bitcoin_average.last;
                     case "bitex.la":
                        return vm.fiatcant / vm.values.bitex.last;
                     case "bitfinex.com":
                       return vm.fiatcant / vm.values.bitfinex.last;
                     case "bitstamp.net":
                        return vm.fiatcant / vm.values.bitstamp.last;
                     default:
                        return NaN;
                  }


               }else if(vm.fiatCur == "USD" && nat_currency == "ARS"){

                  var dolarBlue = vm.values.infobae_oficial.last;

                  switch(vm.source){
                     case "argenbtc.com":
                        return (vm.fiatcant*dolarBlue) / vm.values.argenbtc.last;
                     case "bitcharts.io":
                        return (vm.fiatcant*dolarBlue) / vm.values.bitcharts.last;
                     case "ripio.com":
                        return (vm.fiatcant*dolarBlue) / vm.values.ripio.last;
                     case "satoshitango.com":
                        return (vm.fiatcant*dolarBlue) / vm.values.satoshi_tango.last;
                     case "unisend.com":
                        return (vm.fiatcant*dolarBlue) / vm.values.unisend.last;
                     default:
                        return NaN;
                  }

               }

            };/* setBtcCant*/

            vm.setBtcPercent = function(btcCant){
               if (vm.percentOperation == "+") {
                  return (btcCant + ((btcCant*vm.percent)/100)).toFixed(5);
               }else if(vm.percentOperation == "-"){
                  return (btcCant - ((btcCant*vm.percent)/100)).toFixed(5);
               }else{
                  return NaN;
               }
            };
         });//success()
}).controller('exchangesController', function($scope, $http, $filter) {

  var vm = this;

   $http({method: 'POST', url: '/exchanges/info'})
      .success(function(data){

         vm.values = data;

         vm.getSource = function(fuente) {
            return vm.values[fuente];
         };

      });//success()
}).controller('statsController', function($scope, $http, $filter) {

  var vm = this;

   $http({method: 'POST', url: '/internal/stats'})
      .success(function(data) {

         vm.TotalBlocks = data.n_blocks_total;
         vm.NetDif      = data.difficulty;
         vm.NetHashRate = data.hash_rate;
         vm.TotalBTC    = (data.totalbc/100000000);
         vm.PercentBTC  = (((data.totalbc/100000000)*100) / 21000000).toFixed(2);
      });
});
