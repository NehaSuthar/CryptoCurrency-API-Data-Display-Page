
//----------------------Variable decalaration----------------------------//
const cryptoApp = {};

cryptoApp.coinMarketEndPoint = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
cryptoApp.cryptoLiveDataPromise = null;
cryptoApp.apiKey = '43dbf032-cee5-4059-bbc5-913c13faea3a';
cryptoApp.currencyDataList = [];

//----------------ajax call to get data from coinmarketcap API-----------//

cryptoApp.getLiveCryptoData = () => {
  return $.ajax({
    url: 'http://proxy.hackeryou.com',
    dataType: 'json',
    method:'GET',
    data: {
      reqUrl: cryptoApp.coinMarketEndPoint,
      params: {
        CMC_PRO_API_KEY: cryptoApp.apiKey,
        start: 1,
        limit: 200,
        convert: 'USD',
      },
      proxyHeaders: {
        'Some-Header': 'goes here'
      },
      xmlToJSON: false,
      useCache: false
    }
  })
}
cryptoApp.renderCurrencyData = (currencyData) => {
  currencyData.forEach(coin => {
    coin = $("<h2></h2>").text(`name: ${coin.name} | symbol: ${coin.symbol} | price: $${coin.quote.USD.price}`).addClass("coin");
    $(".coin-display").append(coin, $("<br>"));
  })  
}
cryptoApp.init = ()=>{
  cryptoApp.getLiveCryptoData().then(response => {
    // console.log("API call response:", response.data);
    cryptoApp.currencyDataList = response.data;
    // make call to function that creates html elements for each cryptocurrency coin in the list
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList);
  }).catch((err) => {
    console.log("api call error:", err.message);
  });
}




//---------------------------document ready-------------------------//
$(()=>{
  // $.ajaxSetup({'cache':true});
  cryptoApp.init();
});
