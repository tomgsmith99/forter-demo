
const axios = require('axios')

var qs = require('qs')

////////////////////////////////////////////////////

module.exports = function(app){

	app.get('/register', (req, res) => {

		const config = req.app.get('config')

		let obj = JSON.parse(JSON.stringify(config))

		obj.register = true

		obj.users = req.app.get('users')

		res.render ('register.html', obj)
	})

	app.post('/register', function (req, res) {

		const users = req.app.get('users')

		const {email, first_name, last_name, password, forter_token}  = req.body

		const user_id = first_name.toLowerCase()

		const user = users[user_id]

		console.log("the email is: " + email)
		console.log("the first name is: " + first_name)
		console.log("the last name is: " + last_name)

		console.log("the forter token is: " + forter_token)

		const data = JSON.stringify({
		  "accountId": "NO_ACCOUNT_ID",
		  "connectionInformation": {
		    "customerIP": user.ip_address,
		    "userAgent": req.headers['user-agent'],
		    "forterTokenCookie": forter_token
		  },
		  "eventTime": Date.now()
		})

		console.log("the data object being sent to Forter is:")

		console.dir(data)

		const config = {
		  auth: {
			username: process.env.FORTER_KEY
		  },
		  method: 'post',
		  url: process.env.FORTER_TENANT + '/v2/accounts/signup/NO_ACCOUNT_ID',
		  headers: { 
		    'api-version': '2.36', 
		    'Content-Type': 'application/json'
		  },
		  data: data
		}

		axios(config)
		.then(function (response) {

			const forter_decision = response.data.forterDecision

		  	console.log(JSON.stringify(response.data))

		  	res.json({forter_decision: response.data.forterDecision})

		})
		.catch(function (error) {
			console.dir(error)
			res.json({"error": "something went wrong with the request to forter"})
		})
	})
}
