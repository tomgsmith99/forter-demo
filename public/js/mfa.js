
function select_factor() {

	const selected_factor = $('input[name="method"]:checked').val()

	const factors_raw = localStorage.getItem("factors")

	const factors = JSON.parse(factors_raw)

	let factor_id

	for (factor of factors) {

		console.dir(factor)

		if (selected_factor == factor.factorType) {
			factor_id = factor.id
			localStorage.setItem("factor_id", factor.id)

			if (factor.factorType == 'question') {
				localStorage.setItem('question', factor.question_text)
			}
		}
	}

	console.log("the chosen factor is: " + factor_id)

	$("#choose_factor").hide()

	if (selected_factor == "email") {

		$("#email_address_on_file").html(localStorage.getItem("email"))

		$("#factor_email").show()

		console.log("sending email challenge to user...")

		$.post(
        "/send_email_challenge", {
            factor_id: factor_id,
            user_id: localStorage.getItem("user_id")
	    })
	    .done(function( data ) {
	    	console.log("Okta response:")
	    	console.dir(data)
	    })
	}
	else {

		$("#factor_question_div").show()

		$("#security_question").html(localStorage.getItem("question"))
	}
}

function submit_factor(factor_type) {

	console.log("the factor type is: " + factor_type)

	let response_val = ''

	if (factor_type == 'email') {
		response_val = $("#email_code").val()
	}
	else {
		response_val = $("#security_answer").val()
	}

	console.log("the factor value is: " + response_val)

	$.post(
    "/mfa_response", {
    	factor_type: factor_type,
        mfa_response: response_val,
        factor_id: localStorage.getItem("factor_id"),
        user_id: localStorage.getItem("user_id")
    })
    .done(function( data ) {

    	console.log("Okta MFA result:")

    	console.dir(data)

    	const user_raw = localStorage.getItem("user")

    	const user = JSON.parse(user_raw)

		$("#login_success").show()
		$("#factor_email").hide()
		$("#factor_question_div").hide()
		$("#choose_factor").hide()
		$("#welcome_login_username").html(user.first_name)

		if (user.use_case == "profile") {
    		$("#user_profile").show()

			show_profile()
		}
    })
}
