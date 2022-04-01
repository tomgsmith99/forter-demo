
window.onload = function() {

    users_raw = localStorage.getItem("users")

    users = JSON.parse(users_raw)

    let reg_users_html = ""

    for (user in users) {
    	if (users[user].use_case == "registration") {
        	reg_users_html += `<li><a class="dropdown-item" href="#" onclick="select_user('${user}', 'register')">${users[user].full_name}</a></li>`
    	}
    }

    $("#reg_users_list").html(reg_users_html)

    $("#login_link").hide()
}

function register() {

	const email = $("#email").val()
	const first_name = $("#first_name").val()
	const last_name = $("#last_name").val()
	const password = $("#password").val()

	console.log("the register button was clicked.")
	console.log(email)

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

    		// user_msg = "<p style='background-color: palegreen'>Success!</p><p>Thanks for creating an account with us, " + first_name + "!"
    	}

    	$("#instrux").hide()

    	$("#reg_form").hide()
    	$("#reg_result").html(user_msg)
    	$("#reg_result").show()
    })
}
