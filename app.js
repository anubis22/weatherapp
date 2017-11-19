const yargs = require('yargs');
const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');
const express = require('express');
const hbs = require('hbs');
const port = process.env.PORT || 3000;
var app = express();
const argv = yargs
  .options({
    a: {
      demand: true,
      alias:'address',
      describe:'Adress to fetch weather for',
      string:true
      }
  })
.help()
.alias('help','h')
.argv;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.get('/',function(req, res, next){
  res.render('home.hbs')
});

geocode.geocodeAddress(argv.address, function(errorMessage, results){
   if(errorMessage){
     console.log(errorMessage);
   }else{
     console.log(results.address);
     weather.getWeather(results.latitude, results.longitude, function(errorMessage, weatherResult){
       if(errorMessage){
         console.log(errorMessage);
       }else{
         console.log(`Temperature is ${weatherResult.temperature}, but it feels like ${weatherResult.apparentTemperature}`);
       }
     });
   }
});
app.listen(port,function(){
  console.log(`app is running on ${port}`)
});
