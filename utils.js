
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

            let factors = []

            for (factor of response.data) {

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

            return callback(null, factors)
        })
        .catch(function (error) {
          console.log(error)
        })
    } 
}
