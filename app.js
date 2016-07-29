//load dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var BoxSDK = require('box-node-sdk');
var fs = require('fs');
var path = require('path');

// ------------------------------------------------------------------------------
// Application Parameters - Fill in with your app's values
// ------------------------------------------------------------------------------

var CLIENT_ID = 'YOUR CLIENT ID',
	CLIENT_SECRET = 'YOUR CLIENT SECRET',
	PUBLIC_KEY_ID = 'YOUR PUBLIC KEY ID',
	PRIVATE_KEY_PATH = './path/to/your_private_key.pem',
	PRIVATE_KEY_PASSPHRASE = 'YOUR PRIVATE KEY PASSPHRASE',
	ENTERPRISE_ID = 'YOUR ENTERPRISE ID';


	
// Set up Express and App Auth for the Box SDK
var app = express(),
	sdk = new BoxSDK({
		clientID: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		appAuth: {
			keyID: PUBLIC_KEY_ID,
			privateKey: fs.readFileSync(path.resolve(__dirname, PRIVATE_KEY_PATH)),
			passphrase: PRIVATE_KEY_PASSPHRASE
		}
	});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:false
}));

// Set up the templating engine (Handlebars)
app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}));
app.set('view engine', 'hbs');

// Use a single SDK client for the app admin, which will perform all operations
// around user management.  Not using this here, but this client is what you would
// use to perform CRUD operations on users
var adminAPIClient = sdk.getAppAuthClient('enterprise', ENTERPRISE_ID);

//route to retreive access token for the given Box app user id
app.get('/api/accesstoken/:box_app_user_id', function(req, res) {
  
  var boxAppUserId = req.params.box_app_user_id;
  req.sdk = sdk.getAppAuthClient('user', boxAppUserId);
  
  // this request gets the user's info.  I am just using it to get the name
  var params = {};
  adminAPIClient.get('/users/' + boxAppUserId, params, adminAPIClient.defaultResponseHandler(function(err, data) {

		if (err) {
			console.log(err);
			return;
		}
		//grab the user's name and user Id
		var appUserName = data.name;
		var appUserId = data.id;
		
		req.sdk._session.tokenManager.getTokensJWTGrant('user', boxAppUserId, function (err, accessTokenInfo) {
            console.log("retrieving access token now...");
            if (err) {
                console.log(err);
            }
            console.log("Access Token: " + accessTokenInfo.accessToken);
            
            //send the response to the iOS app
            res.setHeader('content-type', 'application/json');
            var body = {  'name' : appUserName,
                       'user_id' : appUserId,
                  'access_token' : accessTokenInfo.accessToken };
            
            res.status(200);
            res.send(body);
        });
	}));
});

app.get('/', function(req, res) {
    res.render('signup');
});

app.get('/signup', function(req, res) {
	res.render('signup');
});

//route to create a new app user and 
app.post('/api/users/new', function(req, res) {
	var requestParams = {
		body: {
			name: req.body.name,
			is_platform_access_only: true
		}
	};
	// Create a new Box user record for this user, using the name field to hold the
	// email address they registered with.  This allows us to use Box to keep track
	// of all our users, so we don't need a separate database for this sample app
	adminAPIClient.post('/users', requestParams, adminAPIClient.defaultResponseHandler(function(err, data) {

		if (err) {
            console.log(err);
			return;
		}
        console.log("New app user created with name: " + data.name + ". And ID: " + data.id);
        res.send("New app user created with name: " + data.name + ". And ID: " + data.id);
	}));
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(3000);
console.log('Server started!');
console.log('Visit http://localhost:3000/signup to start.');
