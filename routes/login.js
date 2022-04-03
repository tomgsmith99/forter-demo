
const axios = require('axios')

var qs = require('qs')

const utils = require('../utils.js')

////////////////////////////////////////////////////

module.exports = function(app){

	app.get('/login', function (req, res) {

		const config = req.app.get('config')

		let obj = JSON.parse(JSON.stringify(config))

		obj.users = req.app.get('users')

		obj.login = true

		res.render ('login.html', obj)
	})

	app.post('/login', function (req, res) {

		const {email, password, forter_token}  = req.body

		console.log("the email is: " + email)

		console.log("the forter token is: " + forter_token)

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
		  url: process.env.BASE_URL + '/api/v1/authn',
		  headers: { 
		    'Accept': 'application/json', 
		    'Content-Type': 'application/json'
		  },
		  data: data
		}

		axios(config)
		.then(function (response) {

			const users = req.app.get('users')

			var obj = {}

			if (response.data.status && response.data.status == "SUCCESS") {
				obj.primary_authn = response.data.status

				// okta user id
				const user_id = response.data._embedded.user.id

				const user = users[user_id]

				const data = JSON.stringify({
				  "accountId": user.accountId,
				  "connectionInformation": {
				    "customerIP": user.ip_address,
				    "userAgent": req.headers['user-agent'],
				    "forterTokenCookie": forter_token
				  },
				  "loginMethodType": "PASSWORD",
				  "loginStatus": "SUCCESS",
				  "eventTime": Date.now()
				})

				const config = {
				  auth: {
					username: process.env.FORTER_KEY
				  },
				  method: 'post',
				  url: process.env.FORTER_TENANT + '/v2/accounts/login/' + user.accountId,
				  headers: { 
				    'api-version': '2.36', 
				    'Content-Type': 'application/json'
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

					  	utils.get_factors(user_id, function(err, factors_raw) {

					  		if (err) console.log(err)

					  		let factors = []

					  		for (factor of factors_raw) {

					  			console.log(factor)

					  			let f = {
					  				id: factor.id,
					  				factorType: factor.factorType
					  			}

					  			if (factor.factorType == "question") {
					  				f.question_text = factor.profile.questionText
					  			}
					  			else if (factor.factorType == "email") {
					  				f.email = factor.profile.email
					  			}

					  			factors.push(f)
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

			console.log(error)

			console.log(error.response.status)

			res.json({error: 401})

			return
		})
	})
}
