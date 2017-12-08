const axios    = require('axios')
    , express  = require('express')
    , hbs      = require('hbs')
    , path     = require('path')
    , parser   = require('body-parser')
;

const port           = process.env.PORT || 3000
    , app            = express()
;
/*****************************************************************
 * WEATHER APPLICATION CODE
 *****************************************************************/
const encodedAddress = encodeURIComponent();
const geocodeUrl     = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then(function (response) {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error(`Unable to find ${encodedAddress}`);
    }
    const lat        = response.data.results[0].geometry.location.lat;
    const lng        = response.data.results[0].geometry.location.lng;
    const weatherUrl = `https://api.darksky.net/forecast/3eccb06dafc89ff4c795d5231d7bcd79/${lat},${lng}`;
    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then(function (response) {
    const temperature         = response.data.currently.temperature;
    const apparentTemperature = response.data.currently.apparentTemperature;
    if (temperature === apparentTemperature) {
        console.log(`Temperature is ${temperature}.`);
    } else {
        console.log(`Temperature is ${temperature}. but feels like ${apparentTemperature}.`);
    }
}).catch(function (e) {
    if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers.');
    } else {
        console.log(e.message);
    }
});
/*****************************************************************
 * SETUP EXPRESS-SERVER TO USE THE 'HBS' VIEW ENGINE
 * AND REGISTER PATHS TO PUBLIC DIRECTORIES
 *****************************************************************/
app.set('view engine', 'hbs');
// this is important because only files in this directory will
// be available to the views. Anything outside of them is not
// served by the server.
app.use(express.static(path.join(__dirname, './public')));
/*****************************************************************
 * INCLUDE THE PATH TO RELEVANT SCRIPTS
 *****************************************************************/

// because '/node_modules/' is a folder outside of the '/public' folder
// that we declared above, the client side ('views') will not have access to it. This
// is problematic because we want to use jQuery.

// we can solve this by telling express.js to use a given route ('js/jquery') as
// the path to a resource that we declare as static content (in this case, the folder where
// jquery resides)

// this means that, in the client side, the path 'js/jquery/dist/jquery.min.js' actually
// loads '/node_modules/jquery/dist/jquery.min.js', and serves it with the view properly.
app.use('/js/jquery', express.static(path.join(__dirname, './node_modules/jquery/')));

// this is important because HTML does not natively support partial
// views. We have to be certain that the view engine ('hbs') knows
// where they'll be stored.
hbs.registerPartials(path.join(__dirname, './views/partials'));

/*****************************************************************
 * ENABLE THE BODY PARSER SO THAT WE CAN SEND DATA THROUGH
 * Http POST requests more easily.
 *****************************************************************/

// this is just a simple library so that sending data from
// jQuery and other http clients is a bit less stressful. You
// can learn how to function without it by properly encoding the
// post requests, but that can come later.
app.use(parser.json()); // support json encoded bodies
app.use(parser.urlencoded({ extended: true })); // support form encoded bodies

/*****************************************************************
 * SETUP THE ROUTES FOR THE SERVER
 *
 * These are important because they define the URL endpoints
 * that the client side ('views') can interact with.
 *****************************************************************/

/*****************************************************************
 * [GET]: '/'
 *****************************************************************/
app.get('/', function (req, res) {
    res.render('home.hbs');
});

/*****************************************************************
 * [POST]: '/example'
 *****************************************************************/
app.post('/example', function (req, res) {
    // in the demo I created, I passed data serialized
    // as a type called 'data' through an $.ajax request.
    // This will present itself as a variable called '.data'
    // on the REQUEST body, as seen here.
    console.log('[input]: ', req.body.input);

    // make sure to RESPOND to the request. This is what the
    // CLIENT side ('views') gets back. You'll see this sent to
    // the [console.log] of the BROWSER.
    res.status(200).json({
        message: '[input] was received! Thank you!'
    });
});

/*****************************************************************
 * START EXPRESS SERVER AND LISTEN ON THE DECLARED PORT
 *****************************************************************/

// since we declared the port as '3000' up above, the server
// will be running at 'http://localhost:3000'.
app.listen(port, function () {
    console.log(`server up on ${port}`);
});
