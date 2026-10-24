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

const startPlanningButton = document.querySelector(".hero-buttons .btn-primary");
const howItWorksButton = document.querySelector(".hero-buttons .btn-secondary");
const buildMealButton = document.querySelector(".cta-section .btn-primary");

if (startPlanningButton) {
    startPlanningButton.addEventListener("click", function() {
        window.location.href = "signup.html";
    });
}

if (howItWorksButton) {
    howItWorksButton.addEventListener("click", function() {
        const target = document.getElementById("how-it-works");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
}

if (buildMealButton) {
    buildMealButton.addEventListener("click", function() {
        window.location.href = "signup.html";
    });
}