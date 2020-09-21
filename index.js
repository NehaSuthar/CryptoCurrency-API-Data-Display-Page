
//----------------------Variable decalaration----------------------------//
const cryptoApp = {};

cryptoApp.coinMarketEndPoint = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
cryptoApp.cryptoLiveDataPromise = null;
cryptoApp.apiKey = '43dbf032-cee5-4059-bbc5-913c13faea3a';
cryptoApp.currencyDataList = [];
cryptoApp.recordDisplayCounter = 0;
cryptoApp.currencyName = '';
cryptoApp.currentPrice = 0;
cryptoApp.currentBalance  =0;

//----------------ajax call to get data from coinmarketcap API-----START------//

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
/*
cryptoApp.getLiveCryptoData = () => {
  return $.ajax({
    url: cryptoApp.coinMarketEndPoint,
    dataType: 'JSONP',
    method:'GET',
    data: {
        CMC_PRO_API_KEY: cryptoApp.apiKey,
        start: 1,
        limit: 200,
        convert: 'USD',
      },
  })
}*/
cryptoApp.displayLiveCryptoData = ()=>{
  cryptoApp.getLiveCryptoData().then(response => {
    cryptoApp.currencyDataList = response.data;
    // make call to function that creates html elements for each cryptocurrency coin in the list
    cryptoApp.recordDisplayCounter += 10;
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,0);
  }).catch((err) => {
    console.log("coin market api call error:", err.message);
  });
}
//----------------ajax call to get data from coinmarketcap API--------------END------------//
//-----------------page navigation for prev and next buttons-----START-----------------------//
cryptoApp.decreasePreviousCounter = ()=>{
  if(cryptoApp.recordDisplayCounter > 0){
    cryptoApp.recordDisplayCounter -= 10;
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,cryptoApp.recordDisplayCounter);
  }
}
cryptoApp.increaseNextCounter = ()=>{
  if(cryptoApp.recordDisplayCounter < (cryptoApp.currencyDataList.length)){
    cryptoApp.recordDisplayCounter += 10;
    cryptoApp.renderCurrencyData(cryptoApp.currencyDataList,cryptoApp.recordDisplayCounter);
  }
}
cryptoApp.preNextOnClickEvent = ()=>{
  $('.previous').on('click',()=>{//Previous button functionality
    cryptoApp.decreasePreviousCounter();  
  });
  $('.next').on('click',()=>{//next button functionality
    cryptoApp.increaseNextCounter();
  });
}
//-----------------page navigation for prev and next buttons-----END-----------------------//
//-------------------render coin market API data on UI-------------------------------------//
cryptoApp.renderCurrencyData = (currencyData,start) => {
  $('tbody').empty();
  for(let i=start;i< start+10;i++){
    const cryptoName = $('<td>').text(` ${currencyData[i].name}`);
    const cryptoSymbol = $('<td>').text(`${currencyData[i].symbol}`);
    const cryptoPrice = $('<td>').text(`$${currencyData[i].quote.USD.price}`);
    const cryptoVolumeChange = $('<td>').text(`$${currencyData[i].quote.USD.volume_24h}`);
    const cryptoPriceChange = $('<td>').text(`${currencyData[i].quote.USD.percent_change_24h}%`);
    if(currencyData[i].quote.USD.percent_change_24h <0){
      cryptoPriceChange.addClass('red');
    }else if(currencyData[i].quote.USD.percent_change_24h > 0){
      cryptoPriceChange.addClass('green');
    }
    const tradeButton = $('<td>');
    const buyButton = $('<button>').text(`B`).addClass('buyBtn btn');
    const sellButton = $('<button>').text(`S`).addClass('sellBtn btn');
    tradeButton.append(buyButton,sellButton);
    const cryptoRowContainer = $('<tr>')
    cryptoRowContainer.append(cryptoName,cryptoSymbol,cryptoPrice,cryptoVolumeChange,cryptoPriceChange,tradeButton);
    $('tbody').append(cryptoRowContainer);
  }
}
//--------------------------------------trade buy/Sell button on click event handler----START-----------------//
cryptoApp.tradeButton = ()=>{
  //-------------------------buy Button-----------------------------------//
  $('tbody').on('click','.buyBtn',function(){
    cryptoApp.currencyName  = $(this).parent().parent().children(':nth-child(1)').text();
    cryptoApp.currentPrice = $(this).parent().parent().children(':nth-child(3)').text();
    cryptoApp.currentBalance = $('.userBalanceInfo').children(':nth-child(2)').text();
    console.log('balance'+  cryptoApp.currentBalance );
    $('.formHeaderTrade').css('background','#3385c6');
    $('.currencyInfoTrade').empty();
    $('.validationMsg').empty();
    $('.currencyInfoTrade').empty();
    $('#userTradeActionQty').text(0);
    $('.currencyInfoTrade').append('<h3 class="userInfoLable">Currency: </h3>',`<h3>${cryptoApp.currencyName}</h3>`);
    $('.currencyInfoTrade').append('<h3 class="userInfoLable">Price: </h3>',`<h3>${cryptoApp.currentPrice }</h3>`);
    $('.tradeForm').css("display","block");
  });
  //----------------------------sell Button ------------------------------------//
  $('tbody').on('click','.sellBtn',function(){
    cryptoApp.currencyName  = $(this).parent().parent().children(':nth-child(1)').text();
    cryptoApp.currentPrice = $(this).parent().parent().children(':nth-child(3)').text();
    cryptoApp.currentBalance = $('.accountBalance').text();
    $('.formHeaderTrade').css('background','#D35400');
    $('.currencyInfoTrade').empty();
    $('.validationMsg').empty();
    $('.currencyInfoTrade').empty();
    $('.currencyInfoTrade').append('<h3 class="userInfoLable">Currency: </h3>',`<h3>${cryptoApp.currencyName}</h3>`);
    $('.currencyInfoTrade').append('<h3 class="userInfoLable">Price: </h3>',`<h3>${cryptoApp.currentPrice }</h3>`);
    $('.tradeForm').css("display","block");
  });
}
//-----------------------buy and Sell form submission-----------------------//
$('.tradeDetailForm').on('submit',(event)=>{
  event.preventDefault();
  const tradeQty = $('#userTradeActionQty').val();
  let currentTradePrice= parseInt((cryptoApp.currentPrice).substring(1));
  if(tradeQty * currentTradePrice > cryptoApp.currentBalance){
    $('.validationMsg').empty();
    $('.validationMsg').append('<h3 class="red">insufficient account balance</h3>');
    }else{
      $('.tradeForm').css('display','none');
      let updatedBalance = cryptoApp.currentBalance - (tradeQty * currentTradePrice);
      $('.accountBalance').text(updatedBalance);
      const userCurrencyAdd = $('<h3>').text(cryptoApp.currencyName);
      const userCurrencyQtyAdd = $('<h3>').text(tradeQty);
     $('.currencyOwned').append(userCurrencyAdd,userCurrencyQtyAdd);
    }
});
$('.tradeDetailCloseBtn').on('click',()=>{
  $('.tradeForm').css("display","none");
});
//-----------------------------------------Enter user Detail Click evevnt handler----------//
cryptoApp.enterUserDetails = ()=>{
  $('.toggelUserForm').on('click',()=>{
    for(let i=0;i< cryptoApp.currencyDataList.length;i++){
      const cryptoOption = $('<option>').text(`${ cryptoApp.currencyDataList[i].name}`);
      $('.cryptoOptions').append(cryptoOption);
    }
    $('.detailForm').css('display','block');
  });
}
//------------------------------------user Detail form submit evevnt handler----START-----------//
cryptoApp.userDetailFormSubmit = ()=>{
  $('.userDetailForm').on('submit',(event)=>{
    event.preventDefault();
    const userName = $('#name').val();
    const userEmail = $('#email').val();
    const userBalance = parseInt($('#balance').val());
    const userCurrency = $('#cryptoOptionSelect').val();
    const userCurrencyQty = $('#cryptoQty').val();
    $('.toggelUserForm').hide();
    const userNameF = $('<h3>').text(`${userName}`).addClass('userName');
    $('.userName').append(userNameF);
    const userEmailF = $('<h3>').text(userEmail);
    $('.userEmailInfo').append('<h3 class="userInfoLable">Email: </h3>',userEmailF);
    const balance = (userBalance>0?userBalance:0);
    const userBalanceF = $('<h3>').text(balance).addClass('accountBalance');
    $('.userBalanceInfo').append('<h3 class="userInfoLable">Balance: </h3>',userBalanceF);
    const currecylable = $('<h3>').text('Currency').addClass('userInfoLable');
    const currecyQTYlable = $('<h3>').text('Qty').addClass('userInfoLable');
    $('.currencyHeader').append(currecylable,currecyQTYlable);
    const userCurrencyF = $('<h3>').text(userCurrency);
    const userCurrencyQtyF = $('<h3>').text(userCurrencyQty);
    console.log(userCurrencyQty);
    if(userCurrencyQty > 0 )
      $('.currencyOwned').append(userCurrencyF,userCurrencyQtyF);
    $('.showUserDetail').show();
    $('.detailForm').css('display','none');
  });
}
cryptoApp.userSubmitCloseEvent = ()=>{
  $('.popUpCloseButton').on('click',()=>{
    $('.detailForm').css('display','none');
  });
  $('.userDetailCloseBtn').on('click',()=>{
    $('.detailForm').css('display','none');
  });
}
//------------------------------------user Detail form submit evevnt handler----END-----------//
cryptoApp.init = ()=>{
  cryptoApp.displayLiveCryptoData();
  cryptoApp.preNextOnClickEvent();
  cryptoApp.tradeButton ();
  cryptoApp.enterUserDetails();
  cryptoApp.userDetailFormSubmit();
  cryptoApp.userSubmitCloseEvent ();
}
//---------------------------document ready-------------------------//
$(()=>{
  // $.ajaxSetup({'cache':true});
  cryptoApp.init();
});
