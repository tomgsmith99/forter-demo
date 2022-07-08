require('dotenv').config({ path: 'env.txt' })

const express = require('express')

var morgan = require('morgan')

const nunjucks = require('nunjucks')

/*************************************************/

const config = require('./config/brand.json')

config.forter_eu = process.env.FORTER_EU
config.forter_site_id = process.env.FORTER_SITE_ID
config.year = new Date().getFullYear()
config.public_password = process.env.PUBLIC_PASSWORD

const ip_addresses = {
	APPROVE: '0.0.0.1',
	DECLINE: '0.0.0.2',
	VERIFICATION_REQUIRED: '0.0.0.4'
}

const users_raw = require('./data/users.json')

const users = get_users(users_raw)

/*************************************************/

const app = express()

app.set('config', config)
app.set('users', users)

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))

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

app.get('/users', function (req, res) {
	res.json(users)
})

function get_users(users) {

	for (user in users) {
		console.log(user)

		users[user].full_name = users[user].first_name + " " + users[user].last_name

		users[user].username = (users[user].first_name + "." + users[user].last_name).toLowerCase()

		const expected_response = users[user].expected_response

		users[user].ip_address = ip_addresses[expected_response]
	}

	console.dir(users)

	return users
}
