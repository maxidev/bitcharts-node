 $(document).ready(function(){

Highcharts.createElement('link', {
   href: '../../../bower_components/roboto-fontface/roboto-fontface.css',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   chart: {
      backgroundColor: "#fcfcfc",
   },
   title: {
      style: {
         fontSize: '16px',
         fontWeight: 'bold',
         textTransform: 'uppercase'
      }
  }
};
// Apply the theme
Highcharts.setOptions(Highcharts.theme);

// ***************** Graph 1
$(function () {
    var seriesOptions = [],
        seriesCounter = 0,
        names  = ['bitfinex', 'bitstamp', 'bitcoin_average','bitex'];
        detail = ['Bitfinex.com', 'Bitstamp.net', 'Bitcoinaverage.com', 'Bitex.la'];



      $.each(names, function (i, name) {

      $.ajax({
        type: "POST",
        url: '/api/graphs/'+name,
        dataType: 'json',
        success: function(data){

                  createChart = function () {

                      $('#graph1_2').highcharts('StockChart', {

                          legend: {
                                      enabled: true,
                                      align: 'center',
                                      verticalAlign: 'bottom',
                                  },
                          credits:{
                             enabled: false
                          },
                           title: {
                           text: 'EXCHANGES/SITIOS INTERNACIONALES'
                           },
                          rangeSelector: {
                              selected: 4
                          },
                          scrollbar: {
                            enabled: false
                          },
                          yAxis: {
                              labels: {
                                  formatter: function () {
                                      return this.value ;
                                  }
                              },
                              plotLines: [{
                                  value: 0,
                                  width: 2,
                                  color: 'silver'
                              }]
                          },

                          tooltip: {
                              pointFormat: '<span style="color:{series.color}; padding-top: 5px;">{series.name}</span>: <b>{point.y}</b> USD<br/>',
                              crosshairs: true,
                              shared: true,
                              valueDecimals: 2
                          },
                          series: seriesOptions
                      });
                  };

          var dataGraph = [];
          $.each(data[name], function(i, v){
            dataItem = $.map(v, function(value){
              return [value];
            });
            dataGraph.push(dataItem);
          });

          seriesOptions[i] = {
              name: detail[i],
              data: dataGraph,
/*              marker: {
                enabled: true,
                radius: 3
              },*/
              //shadow: true
          };

          seriesCounter += 1;

          if (seriesCounter === names.length) {
              createChart();
          }
        }
      });
    });
}); // ***************** Graph 1



 // ***************** Graph 1.2
 $(function () {
     var seriesOptions = [],
         seriesCounter = 0,
         names   = ['argenbtc', 'bitcharts', 'ripio', 'satoshi_tango'];
         detail1 = ['ArgenBTC.com', 'Bitcharts.io (average)', 'Ripio.com', 'SatoshiTango.com'];

       $.each(names, function (i, name) {

       $.ajax({
         type: "POST",
         url: '/api/graphs/'+name,
         dataType: 'json',
         success: function(data){

                createChart = function () {

                       $('#graph1_1').highcharts('StockChart', {

                           legend: {
                                       enabled: true,
                                       align: 'center',
                                       verticalAlign: 'bottom',
                                   },
                           credits:{
                              enabled: false
                           },
                            title: {
                            text: 'EXCHANGES/SITIOS ARGENTINOS'
                            },
                           rangeSelector: {
                               selected: 4
                           },
                           scrollbar: {
                             enabled: false
                           },
                           yAxis: {
                               labels: {
                                   formatter: function () {
                                       return this.value ;
                                   }
                               },
                               plotLines: [{
                                   value: 0,
                                   width: 2,
                                   color: 'silver'
                               }]
                           },

                           tooltip: {

                               pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ARS<br/>',
                               crosshairs: true,
                               shared: true,
                               valueDecimals: 2
                           },
                           series: seriesOptions
                       });
                   };

           var dataGraph = [];
           $.each(data[name], function(i, v){
             dataItem = $.map(v, function(value){
               return [value];
             });
             dataGraph.push(dataItem);
           });

           seriesOptions[i] = {
               name: detail1[i],
               data: dataGraph,
/*               marker: {
                 enabled: true,
                 radius: 3
               },*/
               //shadow: true
           };

           seriesCounter += 1;

           if (seriesCounter === names.length) {
               createChart();
           }
         }
       });
     });


 }); // ***************** Graph 1.2


 // ***************** Graph 1.3
$(function () {
    var seriesOptions = [],
        seriesCounter = 0,
        names   = ['blue','oficial'];
        detail2 = ['Dólar Blue', 'Dólar Oficial'];

      $.each(names, function (i, name) {

      $.ajax({
        type: "POST",
        url: '/api/graphs/usd/'+name,
        dataType: 'json',
        success: function(data){

                  createChart = function () {

                      $('#graph1_3').highcharts('StockChart', {

                          legend: {
                                      enabled: true,
                                      align: 'center',
                                      verticalAlign: 'bottom',
                                  },
                          credits:{
                             enabled: false
                          },
                           title: {
                           text: 'Cotización dólar Oficial / Blue'
                           },
                          rangeSelector: {
                              selected: 4
                          },
                          scrollbar: {
                            enabled: false
                          },
                          yAxis: {
                              labels: {
                                  formatter: function () {
                                      return this.value ;
                                  }
                              },
                              plotLines: [{
                                  value: 0,
                                  width: 2,
                                  color: 'silver'
                              }]
                          },

                          tooltip: {
                              pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ARS<br/>',
                              crosshairs: true,
                              shared: true,
                              valueDecimals: 2
                          },
                          series: seriesOptions
                      });
                  };

          var dataGraph = [];
          $.each(data['infobae_'+name], function(i, v){
            dataItem = $.map(v, function(value){
              return [value];
            });
            dataGraph.push(dataItem);
          });

          seriesOptions[i] = {
              name: detail2[i],
              data: dataGraph,
/*              marker: {
                enabled: true,
                radius: 3
              },*/
              //shadow: true,
          };

          seriesCounter += 1;

          if (seriesCounter === names.length) {
              createChart();
          }
        }
      });
    });
}); // ***************** Graph 1.3


/******** Graph 2**********/

$(function () {
  $.ajax({
    type: "POST",
    url: '/api/candlesticks',
    dataType: 'json',
    success: function(data){

        // split the data set into price and volume
        var price = [],
            volume = [],
            dataLength = data.length,
            // set the allowed units for data grouping
            groupingUnits = [[
                'week',                         // unit name
                [1]                             // allowed multiples
            ], [
                'month',
                [1, 2, 3, 4, 5, 6]
            ]],

          i = 0;
          for (i = 0; i < data.bitstamp.length; i++) {

            price[i] =  [data.bitstamp[i].date,
                        data.bitstamp[i].open,
                        data.bitstamp[i].high,
                        data.bitstamp[i].low,
                        data.bitstamp[i].close];

            volume.push([
              data.bitstamp[i].date, // the date
              data.bitstamp[i].volume // the volume
            ]);

          }

        $('#graphCand').highcharts('StockChart', {

            rangeSelector: {
                selected: 1
            },

            credits:{
               enabled: false
            },
            title: {
                text: 'Bitcoin candlestick '
            },
            scrollbar: {
              enabled: false
            },
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Precio'
                },
                height: '60%',
                lineWidth: 2
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volumen'
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],

            series: [{
                type: 'candlestick',
                name: 'Bitstamp',
                data: price,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }]
        });
      }
    });
});
 //###gprah2


}); /*document ready*/


