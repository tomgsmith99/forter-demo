
function show_profile() {

    const user_raw = localStorage.getItem("user")

    const user = JSON.parse(user_raw)

	$("#user_profile").show()

	$("#first_name").val(user.first_name)

	$("#last_name").val(user.last_name)

	$("#email_addr").val(user.email_address)

	$("#phone").val(user.phone)
}

function update_profile() {

	const first_name = localStorage.getItem("first_name")

	console.log("the user is: " + localStorage.getItem("first_name"))

	$("#mfa_response_div").hide()
	$("#mfa_success").hide()
	$("#update_profile").hide()

    $.post(
        "/update_profile", {
            user_id: localStorage.getItem("user_id"),
            forter_token: localStorage.getItem("forter_token")
    })
    .done(function( data ) {

    	console.log("forter response:")

    	console.dir(data)

    	$("#forter_result_div").show()
    	$("#forter_result").html(data.forterDecision)

    	if (data.forterDecision == "VERIFICATION_REQUIRED") {

    		$("#user_profile").hide()

    		$("#factors_list_div").show()

    		for (factor of data.factors) {

    			if (factor.factorType == "question") {
    				$("#security_question_factor").show()
    				localStorage.setItem("security_question", factor.question_text)
    				localStorage.setItem("question_factor_id", factor.id)
    			}
    			else if (factor.factorType == "email") {
    				$("#email_factor").show()
    				$("#email").html(factor.email)
    				localStorage.setItem("email_factor_id", factor.id)
    			}
    		}
    	}
    	else if (data.forterDecision == "APPROVE") {

    		$("#user_profile").hide()
    		$("#profile_result_div").show()
    		$("#profile_result").html("Your profile was successfully updated.")
    		$("#forter_decision_div").show()
    		$("#forter_decision").html(data.forterDecision)
		}
    	else if (data.forterDecision == "DECLINE") {

    		$("#user_profile").hide()
    		$("#profile_result_div").show()
    		$("#profile_result").html("Sorry, something's not quite right. Please contact customer support.")
    		$("#forter_decision_div").show()
    		$("#forter_decision").html(data.forterDecision)
        }
    })
}
