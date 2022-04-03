
function register() {

	const email = $("#email").val()
	const first_name = $("#first_name").val()
	const last_name = $("#last_name").val()
	const password = $("#password").val()

    $.post(
        "/register", {
            email: email,
            first_name: first_name,
            last_name: last_name,
            password: password,
            forter_token: localStorage.getItem("forter_token")
    })
    .done(function( data ) {

    	console.log("response:")

    	console.dir(data)

        $("#reg_users").hide()

    	$("#forter_decision_div").show()
    	$("#forter_decision").html(data.forter_decision)

    	let user_msg

        $("#already_have").hide()

    	if (data.error || data.forter_decision == "DECLINE") {

            $("#reg_decline").show()
    	}
    	else {

    		const first_name = localStorage.getItem("first_name")

            $("#first_name_welcome").html(first_name)

            $("#reg_approve").show()
    	}

    	$("#instrux").hide()

    	$("#reg_form").hide()
    	$("#reg_result").html(user_msg)
    	$("#reg_result").show()
    })
}
