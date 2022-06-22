
const axios = require('axios')

const utils = require('../utils.js')

////////////////////////////////////////////////////

module.exports = function(app){

	app.post('/update_profile', function (req, res) {

		const users = req.app.get('users')

		const { forter_token, use_case_detail, user_id } = req.body

		const user = users[user_id]

		if (use_case_detail == 'profile_decline') {
			user.ip_address = '0.0.0.2'
		}

		console.log("the user_id is: " + user_id)
		console.log("the forter token is: " + forter_token)

		const data = JSON.stringify({
		  	"accountId": user.accountId,
		  	"connectionInformation": {
		    	"customerIP": user.ip_address,
		    	"userAgent": req.headers['user-agent'],
		    	"forterTokenCookie": forter_token
		  	},
		  	"eventTime": Date.now(),
		  	"accountOwner": {
				"created": 1641057641,
				"email": user.email_address,
				"firstName": user.first_name,
				"lastName": user.last_name
			}
		})

		const config = {
		  auth: {
			username: process.env.FORTER_KEY
		  },
		  method: 'post',
		  url: process.env.FORTER_TENANT + '/v2/accounts/profile-access/' + user.accountId,
		  headers: { 
		    'api-version': '2.36', 
		    'Content-Type': 'application/json'
		  },
		  data: data
		}

		axios(config)
		.then(function (response) {
		  console.log(JSON.stringify(response.data))

		  if (response.data.forterDecision == "VERIFICATION_REQUIRED") {

		  	utils.get_factors(user_id, function(err, factors) {

		  		if (err) {
		  			console.log(err)

		  			res.json({error: err})
		  		}

		  		response.data.factors = factors

		  		res.json(response.data)
		  	})
		  }
		  else {
		  	res.json(response.data)
		  }
		})
		.catch(function (error) {
		  console.log(error)
		})
	})
}
