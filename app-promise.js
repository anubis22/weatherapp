const yargs = require('yargs');
const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const port = process.env.PORT || 3000;
const frontend = require('./public/frontend.js');
var app = express();
// const argv = yargs
// .options({
//   a: {
//     demand: true,
//     alias:'address',
//     describe:'Adress to fetch weather for',
//     string:true
//   }
// })
// .help()
// .alias('help','h')
// .argv;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname + '/public')));

  var encodedAddress = encodeURIComponent();
  var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

  axios.get(geocodeUrl).then(function (response){
    if (response.data.status === 'ZERO_RESULTS'){
      throw new Error(`Unable to find ${encodedAddress}`);
    }
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/3eccb06dafc89ff4c795d5231d7bcd79/${lat},${lng}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
  }).then(function (response){
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    if(temperature === apparentTemperature){
      console.log(`Temperature is ${temperature}.`);
    }else{
      console.log(`Temperature is ${temperature}. but feels like ${apparentTemperature}.`);
    }
  }).catch(function (e){
    if(e.code === 'ENOTFOUND'){
      console.log('Unable to connect to API servers.');
    }else{
      console.log(e.message);
    }
  });
  app.get('/', function (req, res, next){
    res.render('home.hbs')
  });
app.listen(port, function(){
  console.log(`server up on ${port}`);
});
