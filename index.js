
//----------------------Variable decalaration----------------------------//
const cryptoApp = {};

cryptoApp.coinMarketEndPoint = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
cryptoApp.cryptoLiveDataPromise = null;
cryptoApp.apiKey = '43dbf032-cee5-4059-bbc5-913c13faea3a';
cryptoApp.currencyDataList = [];
cryptoApp.recordDisplayCounter = 0;

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
        limit: 50,
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
cryptoApp.renderCurrencyData = (currencyData,start) => {
  for(let i=start;i<= start+10;i++){
    const cryptoName = $('<p>').text(` ${currencyData[i].name}`);
    const cryptoSymbol = $('<p>').text(`${currencyData[i].symbol}`);
    const cryptoPrice = $('<p>').text(`$${currencyData[i].quote.USD.price}`);
    const cryptoVolumeChange = $('<p>').text(`$${currencyData[i].quote.USD.volume_24h}`);
    const cryptoPriceChange = $('<p>').text(`${currencyData[i].quote.USD.percent_change_24h}%`);
    const cryptoFlexContainer = $('<div>').addClass("cryptoDataRowChild");///flex class
    const cryptoContainerDiv = $('<div>').addClass("cryptoDataRow");///grid child
    cryptoFlexContainer.append(cryptoName,cryptoSymbol,cryptoVolumeChange,cryptoPriceChange);
    cryptoContainerDiv.append(cryptoFlexContainer);
    $('.grid-container').append(cryptoContainerDiv);
    //coin = $("<h2></h2>").text(`name: ${coin.name} | symbol: ${coin.symbol} | price: $${coin.quote.USD.price}`).addClass("coin");
  }
  
  /*
  let cryptoArraylength =currencyData.length;
  $('.grid-container').css("--row-num",cryptoArraylength);
  currencyData.forEach(coin => {
    const cryptoName = $('<p>').text(` ${coin.name}`);
    const cryptoSymbol = $('<p>').text(`${coin.symbol}`);
    const cryptoPrice = $('<p>').text(`$${coin.quote.USD.price}`);
    const cryptoVolumeChange = $('<p>').text(`$${coin.quote.USD.volume_24h}`);
    const cryptoPriceChange = $('<p>').text(`${coin.quote.USD.percent_change_24h}%`);
    const cryptoFlexContainer = $('<div>').addClass("cryptoDataRowChild");///flex class
    const cryptoContainerDiv = $('<div>').addClass("cryptoDataRow");///grid child
    cryptoFlexContainer.append(cryptoName,cryptoSymbol,cryptoVolumeChange,cryptoPriceChange);
    cryptoContainerDiv.append(cryptoFlexContainer);
    $('.grid-container').append(cryptoContainerDiv);
    //coin = $("<h2></h2>").text(`name: ${coin.name} | symbol: ${coin.symbol} | price: $${coin.quote.USD.price}`).addClass("coin");
    $(".coin-display").append(coin, $("<br>"));
  });*/
}
cryptoApp.init = ()=>{
  cryptoApp.getLiveCryptoData().then(response => {
    // console.log("API call response:", response.data);
    cryptoApp.currencyDataList = response.data;
    // make call to function that creates html elements for each cryptocurrency coin in the list
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,0);
  }).catch((err) => {
    console.log("api call error:", err.message);
  });
}

//---------------------------document ready-------------------------//
$(()=>{
  // $.ajaxSetup({'cache':true});
  cryptoApp.init();
});
