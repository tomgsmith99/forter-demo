
require('dotenv').config()

const express = require('express')

var morgan = require('morgan')

const nunjucks = require('nunjucks')

var session = require('express-session')

/*************************************************/

let config = require('./config.json')

config.public_password = process.env.PUBLIC_PASSWORD

const ip_addresses = {
	APPROVE: "0.0.0.1",
	DECLINE: "0.0.0.2",
	VERIFICATION_REQUIRED: "0.0.0.4"
}

const users_raw = require('./users.json')

const users = get_users(users_raw)

/*************************************************/

const app = express()

app.set('config', config)
app.set('users', users)

app.use(express.json())

app.use(express.urlencoded({extended: true}))

// app.use(morgan('combined'))

app.use(express.static('public'))

app.use(session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false}))

nunjucks
    .configure('views', {
        autoescape: true,
        express: app,
        watch: true,
    })

/*************************************************/

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`)
})

/*************************************************/

require('./routes/login')(app)
require('./routes/mfa')(app)
require('./routes/register')(app)
require('./routes/update_profile')(app)

/*************************************************/

app.get('/favicon.ico', (req, res) => {
	res.sendStatus(200)
	return
})

app.get('/', (req, res) => {
	config.home = true
	res.render ('index.html', config)
})

app.get('/session', function (req, res) {
	if (req.session.authenticated) {
		res.json({authenticated: true})
	}
	else {
		res.json({authenticated: false})
	}
})

app.get('/log_out', function (req, res) {
	req.session.authenticated = false
	res.sendStatus(200)
})

app.get('/users', function (req, res) {
	res.json(users)
})

function get_users(users) {

	for (user in users) {
		console.log(user)

		users[user].full_name = users[user].first_name + " " + users[user].last_name

		users[user].username = (users[user].first_name + "." + users[user].last_name).toLowerCase()

		users[user].email_address = users[user].username + "@mailinator.com"

		const expected_response = users[user].expected_response

		users[user].ip_address = ip_addresses[expected_response]
	}

	console.dir(users)

	return users
}
