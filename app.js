//load dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var BoxSDK = require('box-node-sdk');
var fs = require('fs');
var path = require('path');
var util = require('util');

// ------------------------------------------------------------------------------
// Application Parameters - Fill in with your app's values
// ------------------------------------------------------------------------------

/*var CLIENT_ID = '2y3f7wr99x1emxgwuaufiwku9km19kna', 
	CLIENT_SECRET = '5xCJXqmPgliUNZbFCd87R859d1OURER2',
	PUBLIC_KEY_ID = 'ytevi8tw',
	PRIVATE_KEY_PATH = './private_key.txt',
	PRIVATE_KEY_PASSPHRASE = 'b3080980691e02e1d9ce9b1bff4b3b77',
	ENTERPRISE_ID = '16376341';
	*/

	
var CLIENT_ID = 'usn8nf8li1e7filj5nqwkz4vzb8j27wf', 
	CLIENT_SECRET = 'V9WnBBlb5EjiHY1WUvl0G6mCkm3SD5Lw',
	PUBLIC_KEY_ID = 'k74gw4la',
	PRIVATE_KEY_PATH = './private_key.txt',
	PRIVATE_KEY_PASSPHRASE = 'b3080980691e02e1d9ce9b1bff4b3b77',
	ENTERPRISE_ID = '16376341';

	

	
// Set up Express and App Auth for the Box SDK
var app = express(),
	sdk = new BoxSDK({
		clientID: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		appAuth: {
			keyID: PUBLIC_KEY_ID,
//			privateKey: fs.readFileSync(path.resolve(__dirname, PRIVATE_KEY_PATH)),
//			privateKey: '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIa2EMu0IJHZICAggA\nMBQGCCqGSIb3DQMHBAi/YR96Dyp1CgSCBMgax1YYpo4qIePaTt0HB61rKh92KczL\nkdCpjVyoOGTKZrobTMR+sUYdiQr3TXMgoIekM1l7oaWCUGJ86AN9Px8+JTG46xIF\nW4uIBxAdVDD3xx0nILU1KzxSZTVNNsdMAj81429Q14QqyEQqiIDeGLdAhsYkRknw\npPClqygZ5STnk9zfO9j8naRIsZ3uPWqOrJWfGJ+Ou8cqk0tL3RS6qEnNhmB8mJc2\n/Pamj6FgFIiXCxtwQkblExQk3FJK32d8g2nD0CyqQtsDXMIvgMoGN8Qwv8fbuS0y\nZDxrae8jipGcPcGpWBN6rAsJK6m2S7va3JN6ehip07lWrTfmhNoXkKdQhOU/sicK\nkV6y/ah6xFh5spre4o4JPftMqgYBOWG6i6A2krrqzMzbUMBZI/hJfsw86Z3oZOtM\nJUzAyThfP2jb03TznaH/k0GS+msORZ/jCbY71D7VrUqEsC6tCZtdbGXzdXn4ZT7i\nB1zGYuMvchOrNdAnfIpGMvcXjCrY0h49LoRs6By1IbErEbPSKwnXOB68I+nJwZq9\nc6G3tN1fV1gnCCTsgPLYIMygNWJAZ5d3UP8+98i1qSLM9CDqaO/nmRq/q8PgVkx0\n/pb8xUWEKv13pp/9Hq043vTbnMd+qrB1au7X9LFEKxLsJBQL1b2ZL3vI51LjQhDQ\ncbiC1LvZ1G7kbgQ8L158CEoQddxDm6GVN0lDEgZ8lSIPcmASyyv/ivIh9T6V8mND\nYFG89uJhpcXNvnxS+inlmnbr12mjIOSi6Cwkt496vdtgu1Bj1Z4YrK4+pro8LkuP\nCgLG80oq2TsdcsaGUOGGTJbVqvLJM0ki4rdNsyWAgBMtdeZv4agyfkHCCzfTNWf8\nII42P+puCnWbE2V+xy1yzh775Asb2633Xc8nNIkCrxuxisRe1CSouKmOnqn7G7fa\nUlzvLfpoQ6Yer5bnGjqtQhyEu5pnSRU8PPPt1Hyd/oMd+0oC3TrCXuCJf93udJ0A\nNktPX85VbD5xhF57N1W9IfjdKjR8WUcbxU+N/cHjZf1bssSKlaQLAioClht/YhOq\nZ6KDNGj8ULhUEJhhUofQmk+z8cwOllI+GDrKBLutQxAMmWZ7xcQD0K+zmVMyB4Fr\n2dAmzYwHVYotmYGeDhrcHev0ENTz3Wb5US16WFmXC3BRKoBtpfvi4CpjuQuWJEoz\nP542bUBWstZ0Xc7zFYKlyRfhOyUQfcw1911TmIS/DFu74NAB688wcX6a6940s6i5\n+tMGqtNJKrv5BMLrzLXm/9pFlUvmcoCFPvQtMvCG/oOeU2BEmfD4qyyXHJJdJfP1\nIrOwUZLj+/Pdgjh3JeRC5egyiCbQ5P7qaNAv6NWfm2oZiOnEZkm77Vb6U5is7S8P\nya/98i3DNC+13gZszlr4ZnmOHghAlE5IXuRYO2FQPIDZaWuK2RrJYCxQTTjyDtjJ\nFCMtKsWEVKVEVU3dVJsCZisRTNJs63hmLDXzSu7ItUZZBCdd9Lj38LfmSAQingpZ\nErKT3TwkwiOv1A8YzbJvNM1SYnFml1Mm4h+X0Zx7zg5RlSII6tcQ+sCO7oVfy8Od\ng64GmLqrG5WU4t9msw25MjfrQcWFRBE26wN/p6CdLz5TAt6XMqPPCdM5xNuOFgTH\necE=\n-----END ENCRYPTED PRIVATE KEY-----\n',
			privateKey: '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIa2EMu0IJHZICAggA\nMBQGCCqGSIb3DQMHBAi/YR96Dyp1CgSCBMgax1YYpo4qIePaTt0HB61rKh92KczL\nkdCpjVyoOGTKZrobTMR+sUYdiQr3TXMgoIekM1l7oaWCUGJ86AN9Px8+JTG46xIF\nW4uIBxAdVDD3xx0nILU1KzxSZTVNNsdMAj81429Q14QqyEQqiIDeGLdAhsYkRknw\npPClqygZ5STnk9zfO9j8naRIsZ3uPWqOrJWfGJ+Ou8cqk0tL3RS6qEnNhmB8mJc2\n/Pamj6FgFIiXCxtwQkblExQk3FJK32d8g2nD0CyqQtsDXMIvgMoGN8Qwv8fbuS0y\nZDxrae8jipGcPcGpWBN6rAsJK6m2S7va3JN6ehip07lWrTfmhNoXkKdQhOU/sicK\nkV6y/ah6xFh5spre4o4JPftMqgYBOWG6i6A2krrqzMzbUMBZI/hJfsw86Z3oZOtM\nJUzAyThfP2jb03TznaH/k0GS+msORZ/jCbY71D7VrUqEsC6tCZtdbGXzdXn4ZT7i\nB1zGYuMvchOrNdAnfIpGMvcXjCrY0h49LoRs6By1IbErEbPSKwnXOB68I+nJwZq9\nc6G3tN1fV1gnCCTsgPLYIMygNWJAZ5d3UP8+98i1qSLM9CDqaO/nmRq/q8PgVkx0\n/pb8xUWEKv13pp/9Hq043vTbnMd+qrB1au7X9LFEKxLsJBQL1b2ZL3vI51LjQhDQ\ncbiC1LvZ1G7kbgQ8L158CEoQddxDm6GVN0lDEgZ8lSIPcmASyyv/ivIh9T6V8mND\nYFG89uJhpcXNvnxS+inlmnbr12mjIOSi6Cwkt496vdtgu1Bj1Z4YrK4+pro8LkuP\nCgLG80oq2TsdcsaGUOGGTJbVqvLJM0ki4rdNsyWAgBMtdeZv4agyfkHCCzfTNWf8\nII42P+puCnWbE2V+xy1yzh775Asb2633Xc8nNIkCrxuxisRe1CSouKmOnqn7G7fa\nUlzvLfpoQ6Yer5bnGjqtQhyEu5pnSRU8PPPt1Hyd/oMd+0oC3TrCXuCJf93udJ0A\nNktPX85VbD5xhF57N1W9IfjdKjR8WUcbxU+N/cHjZf1bssSKlaQLAioClht/YhOq\nZ6KDNGj8ULhUEJhhUofQmk+z8cwOllI+GDrKBLutQxAMmWZ7xcQD0K+zmVMyB4Fr\n2dAmzYwHVYotmYGeDhrcHev0ENTz3Wb5US16WFmXC3BRKoBtpfvi4CpjuQuWJEoz\nP542bUBWstZ0Xc7zFYKlyRfhOyUQfcw1911TmIS/DFu74NAB688wcX6a6940s6i5\n+tMGqtNJKrv5BMLrzLXm/9pFlUvmcoCFPvQtMvCG/oOeU2BEmfD4qyyXHJJdJfP1\nIrOwUZLj+/Pdgjh3JeRC5egyiCbQ5P7qaNAv6NWfm2oZiOnEZkm77Vb6U5is7S8P\nya/98i3DNC+13gZszlr4ZnmOHghAlE5IXuRYO2FQPIDZaWuK2RrJYCxQTTjyDtjJ\nFCMtKsWEVKVEVU3dVJsCZisRTNJs63hmLDXzSu7ItUZZBCdd9Lj38LfmSAQingpZ\nErKT3TwkwiOv1A8YzbJvNM1SYnFml1Mm4h+X0Zx7zg5RlSII6tcQ+sCO7oVfy8Od\ng64GmLqrG5WU4t9msw25MjfrQcWFRBE26wN/p6CdLz5TAt6XMqPPCdM5xNuOFgTH\necE=\n-----END ENCRYPTED PRIVATE KEY-----\n',	
			passphrase: PRIVATE_KEY_PASSPHRASE,
			expirationTime: 18000,
//			expiredBufferMS: 3000,
//			staleBufferMS: 0,
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

/*		if (err) {
            console.log(err);
			return;
		}
		*/
		if (err) {
			//console.log(err);
			res.render('signup', {
				error: 'An error occurred during login - ' + err.message,
				errorDetails: util.inspect(err)
			});
//			console.log(util.inspect(err));
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

//app.listen(3000);
//console.log('Server started!');
///console.log('Visit http://localhost:3000/signup to start.');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

