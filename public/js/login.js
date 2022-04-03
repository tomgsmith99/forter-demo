
// window.onload = function() {

//     users_raw = localStorage.getItem("users")

//     users = JSON.parse(users_raw)

//     let login_users_html = profile_users_html = users_html = ""

//     for (user in users) {

//         let link = `<li><a class="dropdown-item" href="#" onclick="select_user('${user}', 'login')">${users[user].full_name}</a></li>`

//         if (users[user].use_case == "login") {
//             login_users_html += link
//         }
//         else if (users[user].use_case == "profile") {
//             profile_users_html += link
//         }
//     }

//     users_html = login_users_html + '<li><hr class="dropdown-divider"></li>' + profile_users_html

//     $("#login_users_list").html(users_html)

//     $("#login_link").hide()
// }

function show_mfa(factors) {

    $("#factors_list_div").show()

    console.dir(factors)

    for (factor of factors) {
        if (factor.factorType == "question") {
            $("#security_question_factor").show()
            localStorage.setItem("security_question", factor.question_text)
            localStorage.setItem("question_factor_id", factor.id)
        }
        else if (factor.factorType == "email") {
            $("#email_factor").show()
            $("#email_addr").html(localStorage.getItem("email"))
            localStorage.setItem("email_factor_id", factor.id)
            localStorage.setItem("email", factor.email)
        }
    }
}

function update_ui(context, data) {

    if (context == "login_profile") {

        $("#reg_link").hide()
        $("#login_link").hide()
        $("#logout_link").show()
        $("#profile_link").show()            

        user_msg = "<h1>Welcome, " + localStorage.getItem("first_name") + "!</h1>"

        $("#login_form").html(user_msg)
    }

    if (context == "login") {
        if (data.forter_decision && data.forter_decision == "APPROVE") {
            user_msg = "<h1>Welcome, " + data.first_name + "!</h1>"

            $("#reg_link").hide()
            $("#login_link").hide()
            $("#logout_link").show()
            $("#profile_link").show()            
        }
        else if (data.forter_decision && data.forter_decision == "VERIFICATION_REQUIRED") {

            user_msg = ""

            show_mfa(data.factors)
        }
        else if (data.forter_decision && data.forter_decision == "DECLINE") {
            user_msg = "Sorry, something is not quite right. Please contact customer support for further assistance."
        }
        else if (data.factorResult && data.factorResult== "SUCCESS") {

            $("#mfa_success").show()
            $("#reg_link").hide()
            $("#login_link").hide()
            $("#logout_link").show()
            $("#profile_link").show()            

            // $("#update_profile").show()
            $("#mfa_response_div").hide()
            $("#incorrect_response").hide()

            $("#forter_decision_div").hide()
            user_msg = "<h1>Welcome, " + localStorage.getItem("first_name") + "!</h1>"
        }
        else {
            $("#mfa_response").val("")
            $("#incorrect_response").show()
        }

        $("#login_form").html(user_msg)
    }
}

function login() {

    const user_raw = localStorage.getItem("user")

    const user = JSON.parse(user_raw)

	const email = $("#email").val()

	const password = $("#password").val()

    $("#login_error").hide()

    if (user.use_case == "profile") {

        $("#login_users").hide()

        update_ui("login_profile", {})
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

            $("#login_users").hide()

            $("#login_form").hide()

            if (data.error) {
                $("#login_error").show()
            }
            else {

                if (data.forter_decision == "APPROVE") {

                    $("#welcome_login_username").html(user.first_name)

                    $("#login_success").show()
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
