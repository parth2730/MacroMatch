const loginButton = document.querySelector(".btn-login");

const getStartedButton =
    document.querySelector(".nav-actions .btn-primary");


if (loginButton) {

    loginButton.addEventListener("click", function() {

        window.location.href = "login.html";

    });

}

if (getStartedButton) {

    getStartedButton.addEventListener("click", function() {

        window.location.href = "signup.html";

    });

}