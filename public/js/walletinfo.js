'use strict';

(function(angular, QRc, $){

   angular
      .module('walletinfoapp', [])
      .controller('controller.walletinfo',[ '$http', function($http) {
         var vm = this;
         
         vm.getInfo = function(wallet) {
       // el timer es provisorio hasta ver como saltear pace!
        setTimeout(function(){
         $http.post('/walletinfo/balance/' +  wallet)
            .success(function(data, status, headers, config) {
               if (data.success)
                  vm.balance = data.balance;
            })
            .error(function(data, status, headers, config) {
               //kk
            });

          $http.post('/walletinfo/txs/' + wallet)
            .success(function(data, status, headers, config) {
               if (data.success) {
                  vm.txs = data.txs;
                  vm.values = data.values.map(function(value){
                     value.enviado = (value.operation === 'sent' ||
                                      value.operation === 'sentchange');
                     return value;
                  });
               }
            })
            .error(function(data, status, headers, config) {
               //kk
            });
          $http.post('/walletinfo/op_ret/' + wallet)
            .success(function(data, status, headers, config) {
               if (data.success)
                  vm.opret = data.data;
            })
            .error(function(data, status, headers, config) {
               //kk
            });
        }, 1000);

            vm.QRCode = new QRc("qrcode", {
               text: wallet,
               width: 151,
               height: 151,
               colorDark : "#000000",
               colorLight : "#ffffff",
               correctLevel : QRc.CorrectLevel.H
            });

         };

         vm.setTestWallet = function(){
            vm.balance = {
               address : ' ',
               confirmed : {
                  balance : ' ',
                  received : ' ',
                  sent : ' '
               }
            };
            vm.txs = [{
                  block_time: ' ',
                  block_hash:' ',
                  hash:' ',
                  fees: ' ',
                  confirmations : ' '
               },{
                  block_time:' ',
                  block_hash: ' ',
                  hash: ' ',
                  fees: ' ',
                  confirmations : ' '
            }];
            vm.values = [{
                  enviado: ' ',
                  value: ' '
               },{
                  enviado: ' ',
                  value: ' '
            }];
            vm.opret = [' ',' '];

            vm.QRCode = new QRc("qrcode", {
               text: "n/a",
               width: 151,
               height: 151,
               colorDark : "#000000",
               colorLight : "#ffffff",
               correctLevel : QRc.CorrectLevel.H
            });
         };

         vm.tooltips = function() {
            $('[data-toggle="tooltip"]').tooltip();
         };

         $('#wallet-btn').click(function() {
            var wallet = $('#wallet-search').val();
             window.location = "/walletinfo/"+wallet;
          });
         //vm.walletSearch = function() {
            //window.location = '/walletinfo/' + vm.search;
         //}

         // Script Alert, borrar cuando este login 
         $("#test").click(function() {
            if($("#alert").is(":visible")){
               $("#alert").hide();
            }else{
               $("#alert").show();
            }
         });


      }]);

}(angular, QRCode, $));

