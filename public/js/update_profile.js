
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

    const user_raw = localStorage.getItem("user")

    const user = JSON.parse(user_raw)

    if (user.use_case != "profile") {
    	show_profile()
    	return
    }

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

		    const user_raw = localStorage.getItem("user")

		   	const user = JSON.parse(user_raw)

		   	const user_id = localStorage.getItem("user_id")

            localStorage.setItem("factors", JSON.stringify(data.factors))

			$("#choose_factor").show()

    	}
    	else if (data.forterDecision == "APPROVE") {

    		$("#user_profile").hide()

    		$("#login_success").hide()

    		$("#decline_header").hide()

    		show_profile()
		}
    	else if (data.forterDecision == "DECLINE") {

    		$("#user_profile").hide()

    		$("#login_success").hide()

    		$("#decline_header").hide()

    		$("#login_decline").show()
        }
    })
}
