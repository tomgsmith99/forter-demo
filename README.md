# Forter Trusted Identities demo #

This demo is intended to show what the front-end experience of using Forter is like for an end-user (consumer).

To get an idea of how this app works, you can visit the public version at:

https://trusted-identities.herokuapp.com/

## Setup ##

You must have a Forter tenant to run this demo.

By default, the demo uses Okta as an identity back-end for some use-cases (see below). You will need an Okta tenant and API key in order for these use cases to work.

Copy the file

`env_example.txt`

to

`env.txt`

Update the values in `env.txt` for your environment.

## Run ##

`node app.js`

## Use ##

Load the web app in your browser.

For each use-case, select a user from the drop-down to see a different Forter response.

### Sign-up ###
* Selina Kyle: APPROVE
* Catelyn Stark: DECLINE
* Fraudster: DECLINE

### Sign-in (requires connection to Okta) ###
* Lois Lane: APPROVE
* Clark Kent: VERIFICATION REQUIRED
* (Lois Lane): DECLINE

* Leia Organa: APPROVE
* Lando Calrissian: VERIFICATION REQUIRED
* (Leia Organa): DECLINE
