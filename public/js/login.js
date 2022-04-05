
function login() {

    const user_raw = localStorage.getItem("user")

    const user = JSON.parse(user_raw)

	const email = $("#email").val()

	const password = $("#password").val()

    $("#login_error").hide()

    if (user.use_case == "profile") {

        $("#login_form").hide()

        $("#welcome_login_username").html(user.first_name)

        $("#login_success").show()
    }
    else {
        $.post(
            "/login", {
                email: email,
                password: password,
                forter_token: localStorage.getItem("forter_token")
        })
        .done(function( data ) {

            console.log("response:")

            console.dir(data)

            $("#login_form").hide()

            if (data.error) {
                $("#login_error").show()
            }
            else {

                if (data.forter_decision == "APPROVE") {

                    $("#welcome_login_username").html(user.first_name)

                    $("#login_success").show()

                    $("#forter_decision_approve").show()
                }
                else if (data.forter_decision == "DECLINE") {
                    $("#login_decline").show()
                }
                else if (data.forter_decision == "VERIFICATION_REQUIRED") {

                    localStorage.setItem("factors", JSON.stringify(data.factors))

                    $("#choose_factor").show()
                }
            }
        })
    }
}

function logout() {
    localStorage.clear()
    location.reload()
}
