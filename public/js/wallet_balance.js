$(document).ready(function(){

   $('#fa-spinner').hide();
   $('#divWalletBalance').hide();
   $('#alerta').hide();
   $('#alerta1').hide();

   //Solapa Wallet
   $('#wallet').on('input',function(e){ //input wallet
       if($(this).val().length >= 33){ //Cadena Valida
          getJson($(this).val());
       }else if($(this).val().length === 0){
         $('#alerta').hide();
         $('#alerta1').hide();
         $('#divwalletbalance').hide();
       }else{
         $('#divwalletbalance').hide();
         $('#alerta').hide();
         $('#alerta1').show();
       }
   });
}); //document ready

function getJson (address) {

   $('#fa-spinner').show();

   $.ajax({
      url: "/api/wallet/"+address,
      type: "POST",
      datatype: "JSON",
      success: function(data) {

         if (!data.success){
            $('#fa-spinner').hide();
            $('#alerta1').hide();
            $("#wallet").css("background-color", "#FFE5E4");
            $("#wallet").css("border-color", "#CC3A3A");
            $('#wallet').css("color", "#CC3A3A");
            $('#alerta').show();
            $('#divWalletBalance').hide();
         }else {
            $('#fa-spinner').hide();
            $("#wallet").css("background-color", "#DFF0D8");
            $("#wallet").css("border-color", "#3C763D");
            $("#wallet").css("color", "#3C763D");
            $('#alerta').hide();
            $('#alerta1').hide();
            $("#divWalletBalance").show();
            $("#balance").html(data.message.balance_btc);
            $("#balance_satoshis").html(data.message.balance_satoshis);
            $("#balance_bits").html(data.message.balance_bits);
            $("#balance_btc_usd").html((data.message.balance_btc_usd).toFixed(2));
            //$("#balance_ars_blue").html((data.message.balance_ars_blue).toFixed(2));
            $("#recv").html(data.message.recv);
            $("#sent").html(data.message.sent);
         } /* else*/
      }, //success

      done: function(){
         $('#fa-spinner').hide();
      },
      error: function(jqXHR, textStatus, error) {
         console.log('error: '+jqXHR.responseText);
      }
   }); //$.ajax
}//getJson

