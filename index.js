
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
$('.previous').on('click',()=>{//Previous button functionality
  if(cryptoApp.recordDisplayCounter > 0){
    cryptoApp.recordDisplayCounter -= 10;
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,cryptoApp.recordDisplayCounter);
  }
});
$('.next').on('click',()=>{//next button functionality
  if(cryptoApp.recordDisplayCounter < (cryptoApp.currencyDataList.length)){
    cryptoApp.recordDisplayCounter += 10;
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,cryptoApp.recordDisplayCounter);
  }
});
cryptoApp.renderCurrencyData = (currencyData,start) => {
  $('tbody').empty();
  for(let i=start;i< start+10;i++){
    const cryptoName = $('<td>').text(` ${currencyData[i].name}`);
    const cryptoSymbol = $('<td>').text(`${currencyData[i].symbol}`);
    const cryptoPrice = $('<td>').text(`$${currencyData[i].quote.USD.price}`);
    const cryptoVolumeChange = $('<td>').text(`$${currencyData[i].quote.USD.volume_24h}`);
    const cryptoPriceChange = $('<td>').text(`${currencyData[i].quote.USD.percent_change_24h}%`);
    const cryptoRowContainer = $('<tr>')
    cryptoRowContainer.append(cryptoName,cryptoSymbol,cryptoPrice,cryptoVolumeChange,cryptoPriceChange);
    $('tbody').append(cryptoRowContainer);
    //coin = $("<h2></h2>").text(`name: ${coin.name} | symbol: ${coin.symbol} | price: $${coin.quote.USD.price}`).addClass("coin");
  }
}
cryptoApp.init = ()=>{
  cryptoApp.getLiveCryptoData().then(response => {
    // console.log("API call response:", response.data);
    cryptoApp.currencyDataList = response.data;
    // make call to function that creates html elements for each cryptocurrency coin in the list
    cryptoApp.recordDisplayCounter += 10;
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
