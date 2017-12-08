const request = require('request');

function getWeather(lat, lng, callback){
  request({
    url:`https://api.darksky.net/forecast/3eccb06dafc89ff4c795d5231d7bcd79/${lat},${lng}`,
    json:true
  }, function (error, response, body){
    if(error){
      callback('unable to connect to forecast.io server');
    }else if(response.statuscode === 400){
      callback('unable to fetch weather');
    }else{
      callback(undefined,{
        temperature:body.currently.temperature,
        apparentTemperature:body.currently.apparentTemperature
     });
    }
  });
};
module.exports.getWeather = getWeather;
