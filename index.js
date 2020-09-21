
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
decreasePreviousCounter = ()=>{
  if(cryptoApp.recordDisplayCounter > 0){
    cryptoApp.recordDisplayCounter -= 10;
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,cryptoApp.recordDisplayCounter);
  }
}
increaseNextCounter = ()=>{
  if(cryptoApp.recordDisplayCounter + 10 < (cryptoApp.currencyDataList.length)){
    cryptoApp.recordDisplayCounter += 10;
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,cryptoApp.recordDisplayCounter);
  }
}
$('.previous').on('click',(e)=>{//Previous button functionality
  e.preventDefault();
  decreasePreviousCounter();  
});
$('.previous').on('keypress',(event)=>{//Previous button functionality
  if(event.keyCode == '13')
    decreasePreviousCounter();  
});
$('.next').on('click',(e)=>{//next button functionality
  e.preventDefault();
  increaseNextCounter();
});
$('.next').on('keypress',(event)=>{//Previous button functionality
  if(event.keyCode == '13')
    decreasePreviousCounter();  
});
cryptoApp.renderCurrencyData = (currencyData,start) => {
  $('tbody').empty();
  $('.pageNumber').text(`${start} - ${start + 10}`);
  for(let i=start;i< start+10;i++){
    // const cryptoName = $('<td>').text(`${currencyData[i].name}`);
    // const cryptoSymbol = $('<td>').text(`${currencyData[i].symbol}`);

    const cryptoName = $('<td>').text(`${currencyData[i].name}`);
    const cryptoSymbol = $('<span></span>').text(`${currencyData[i].symbol}`);
    cryptoName.append(cryptoSymbol).addClass('nameWidth');

    let price = currencyData[i].quote.USD.price;
    price = Math.round(price * 100) / 100;
    const cryptoPrice = $('<td>').text(`$${price}`);
    // const cryptoPrice = $('<td>').text(`$${currencyData[i].quote.USD.price}`);
    let volumeChange = currencyData[i].quote.USD.volume_24h;
    volumeChange = Math.round(volumeChange * 100) / 100;
    const cryptoVolumeChange = $('<td>').text(`$${volumeChange}`);
    // const cryptoVolumeChange = $('<td>').text(`$${currencyData[i].quote.USD.volume_24h}`);
    let percentChange = currencyData[i].quote.USD.percent_change_24h;
    percentChange = Math.round(percentChange * 100) / 100;
    // console.log("percent change" + percentChange);
    const cryptoPriceChange = $('<td>').text(`${percentChange}%`);
    // const cryptoPriceChange = $('<td>').text(`${currencyData[i].quote.USD.percent_change_24h}%`);
    if(currencyData[i].quote.USD.percent_change_24h <0){
      cryptoPriceChange.addClass('red');
    }else { 
      cryptoPriceChange.addClass('green');
    }
    const tradeButton = $('<button>').text(`buy`).addClass('btn');
    const cryptoRowContainer = $('<tr>')
    // TODO: re add cryptoPrice to this append
    cryptoRowContainer.append(cryptoName,cryptoPrice,cryptoVolumeChange,cryptoPriceChange,tradeButton);
    $('tbody').append(cryptoRowContainer);

    //coin = $("<h2></h2>").text(`name: ${coin.name} | symbol: ${coin.symbol} | price: $${coin.quote.USD.price}`).addClass("coin");
  }
}
cryptoApp.init = ()=>{
  cryptoApp.getLiveCryptoData().then(response => {
    // console.log("API call response:", response.data);
    cryptoApp.currencyDataList = response.data;
    // make call to function that creates html elements for each cryptocurrency coin in the list
    // cryptoApp.recordDisplayCounter += 10;
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,0);
  }).catch((err) => {
    console.log("api call error:", err.message);
  });
}

//---------------------------document ready-------------------------//
$(()=>{
  // $.ajaxSetup({'cache':true});
  cryptoApp.init();
  $('.toggelUserForm').on('click',()=>{
    $('.detail-form').css('display','block');
  });
  $('form').on('submit',(event)=>{
    event.preventDefault();
    const userName = $('#name').val();
    const userEmail = $('#email').val();
    const userBalance = $('#balance').val();
    $('.toggelUserForm').hide();
    const userNameF = $('<h3>').text(`Name: ${userName}`);
    const userEmailF = $('<h3>').text(`Email: ${userEmail}`);
    const userBalanceF = $('<h3>').text(`Account balance(USD): $${userBalance}`);
    $('.showUserDetail').append(userNameF,userEmailF,userBalanceF);
    $('.showUserDetail').show();
    $('.detail-form').css('display','none');
  });
});
