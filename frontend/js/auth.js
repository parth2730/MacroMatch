(function (global) {
    "use strict";

    function displayName(user) {
        if (!user) return "there";
        return user.name || (user.email ? user.email.split("@")[0] : "there");
    }

    async function currentUser() {
        var data = await Api.get("/auth/me");
        return data.user;
    }

    async function requireUser() {
        try {
            return await currentUser();
        } catch (err) {
            if (err.status === 401) {
                window.location.replace("login.html");
                return null;
            }
            throw err;
        }
    }

    async function logout() {
        try {
            await Api.post("/auth/logout");
        } catch (err) {
            console.warn("Logout request failed.", err);
        }
        window.location.href = "index.html";
    }

    function mountNav(user) {
        var navUser = document.getElementById("nav-user");
        if (navUser) {
            navUser.innerHTML = "Hi, <strong>" + escapeHtml(displayName(user)) + "</strong>";
        }

        var logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                logout();
            });
        }
    }

    function escapeHtml(str) {
        var div = document.createElement("div");
        div.textContent = str == null ? "" : String(str);
        return div.innerHTML;
    }

    global.Auth = {
        currentUser: currentUser,
        requireUser: requireUser,
        logout: logout,
        mountNav: mountNav,
        displayName: displayName
    };

})(window);
