
function select_factor() {

	const selected_factor = $("#factor_type").val()

	const factors_raw = localStorage.getItem("factors")

	const factors = JSON.parse(factors_raw)

	let factor_id

	for (factor of factors) {

		console.dir(factor)

		if (selected_factor == factor.factorType) {
			factor_id = factor.id
			localStorage.setItem("factor_id", factor.id)
		}
	}

	console.log("the chosen factor is: " + factor_id)

	$("#choose_factor").hide()

	if (selected_factor == "email") {

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
	    msg = "<p>" + localStorage.getItem("security_question") + "</p>"	
	}
}

function submit_factor(factor_type) {

	console.log("the factor type is: " + factor_type)

	console.log("the factor value is: " + $("#email_code").val())

	$.post(
    "/mfa_response", {
    	factor_type: factor_type,
        mfa_response: $("#email_code").val(),
        factor_id: localStorage.getItem("factor_id"),
        user_id: localStorage.getItem("user_id")
    })
    .done(function( data ) {

    	console.log("Okta MFA result:")

    	console.dir(data)

    	const user_raw = localStorage.getItem("user")

    	const user = JSON.parse(user_raw)

		$("#mfa_success").show()
		$("#factor_email").hide()
		$("#choose_factor").hide()
		$("#mfa_success_username").html(user.first_name)

		if (data.user_id && data.user_id == "00u15j3dq4ntM2SQX0h8") {

    		$("#user_profile").hide()
    		$("#profile_result_div").show()
    		$("#profile_result").html("Your profile was successfully updated.")
		}
    })
}
