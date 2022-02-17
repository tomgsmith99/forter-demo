
const axios = require('axios')

////////////////////////////////////////////////////

module.exports = {
    get_factors: function(user_id, callback)
    {
        const url = process.env.BASE_URL
        const apikey = process.env.OKTA_API_KEY

        const config = {
            method: 'get',
            url: `${url}/api/v1/users/${user_id}/factors`,
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json', 
                'Authorization': `SSWS ${apikey}`
            }
        }

        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))

          return callback(null, response.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    } 
}
