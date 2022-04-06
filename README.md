# Forter Trusted Identities demo #

This demo is intended to show what the front-end experience of using Forter is like for an end-user (consumer).

The look and feel demo can be modified to match the brand that you are presenting to.

## Prerequisites ##

This is a NodeJS app that runs on localhost, so you should first [install NodeJS](https://nodejs.org/en/download/) if you haven't already.

## Installing ##

First, copy the repo to your localhost.

If you are using git:

`git clone https://github.com/tomgsmith99/forter-demo.git`

or, you can download and inflate the zip archive from the project's git home page:

`https://github.com/tomgsmith99/forter-demo`

Next, copy the `.env_example` file to a file called `.env`

(If you don't see the .env_example file, you might need to tell your OS to show hidden files. On a Mac, it's command-shift-.)

Add values for OKTA_API_KEY, PUBLIC_PASSWORD, and FORTER_KEY. These values can be obtained from the Google Doc that describes this demo.

Install the required Node modules:

`npm install`

## Running ##

Before customizing the demo, ensure that it runs properly:

`node app.js`

## Customizing ##

To customize the look and feel of the demo for your own customers and prospects, just edit the `config.json` file. You might want to copy the `config.json` file first.

At this point, the only files intending to be easily configured are `config.json` and `.env`.

You may of course edit any other files that you wish, but you do so at your own risk. :)

For your images, you can either upload them to a cloud source (as the example URLs show) or you can store them in your local version of this repo in the `/public` directory.

You might want to create an images directory first:

`/public/images`

You would then save your images in this directory:

`/public/images/my_image.png`

And, the value that you would assign in the `config.json` file would be:

`"img_bottom_left": "/images/my_image.png"`



