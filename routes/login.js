
const axios = require('axios')

var qs = require('qs')

const utils = require('../utils.js')

////////////////////////////////////////////////////

module.exports = function(app){

	const cfg = app.get('config')

	app.get('/login', function (req, res) {

		// force a new object to be created
		let obj = JSON.parse(JSON.stringify(cfg))

		obj.users = req.app.get('users')

		obj.home = false // why does obj.home = true persist?

		obj.login = true

		console.dir(obj)

		res.render ('login.html', obj)
	})

	app.post('/login', function (req, res) {

		const {email, password, forter_token, use_case_detail}  = req.body

		console.log("the email is: " + email)

		console.log("the forter token is: " + forter_token)

		console.log("the use_case_detail is: " + use_case_detail)

		var data = JSON.stringify({
		  "username": email,
		  "password": password,
		  "options": {
		    "multiOptionalFactorEnroll": true,
		    "warnBeforePasswordExpired": true
		  }
		})

		var config = {
		  method: 'post',
		  url: process.env.OKTA_BASE_URL + '/api/v1/authn',
		  headers: { 
		    'Accept': 'application/json', 
		    'Content-Type': 'application/json'
		  },
		  data: data
		}

		console.dir(config)

		axios(config)
		.then(function (response) {

			const users = req.app.get('users')

			if (response.data.status && response.data.status == "SUCCESS") {

				// okta user id
				const user_id = response.data._embedded.user.id

				console.log("the user id from okta is: ")

				console.log(user_id)

				const user = users[user_id]

				if (use_case_detail == 'login_decline') {
					ip_address = '0.0.0.2'
				}
				else {
					ip_address = user.ip_address
				}

				const data = JSON.stringify({
				  "accountId": user.accountId,
				  "connectionInformation": {
				    "customerIP": ip_address,
				    "userAgent": req.headers['user-agent'],
				    "forterTokenCookie": forter_token
				  },
				  "loginMethodType": "PASSWORD",
				  "loginStatus": "SUCCESS",
				  "eventTime": Date.now(),
				  "accountData": {
				  	"assetsInAccount": {},
				  	"created": 1641057641,
				  	"personalDetails": {
				  		"email": email
				  	}
				  }
				})

				console.log("the data object being sent to Forter is:")

				console.dir(data)

				const config = {
				  auth: {
					username: process.env.FORTER_KEY
				  },
				  method: 'post',
				  url: process.env.FORTER_BASE_URL + '/v2/accounts/login/' + user.accountId,
				  headers: {
				  	'api-version': process.env.FORTER_API_VERSION,
				    'Content-Type': 'application/json',
				    'x-forter-siteid': process.env.FORTER_SITE_ID
				  },
				  data: data
				}

				axios(config)
				.then(function (response) {

				  	console.log(JSON.stringify(response.data))

					let obj = {
						forter_decision: response.data.forterDecision,
						first_name: users[user_id].first_name,
						user_id: user_id
					}

					if (response.data.forterDecision == "VERIFICATION_REQUIRED") {

					  	utils.get_factors(user_id, function(err, factors) {

					  		if (err) {
					  			console.log(err)

					  			res.json({error: err})
					  		}

					  		obj.factors = factors

					  		res.json(obj)
					  	})
					}
					else {
						res.json(obj)
					}
				})
				.catch(function (error) {
					console.dir(error)
					res.json({"error": "something went wrong with the request to Forter"})
				})
			}
		})
		.catch(function (error) {

			console.dir(error)
			console.log(error)

			console.log(error.response.status)

			res.json({error: 401})

			return
		})
	})
}
