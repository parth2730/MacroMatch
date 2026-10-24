(function (global) {
    "use strict";

    var API_BASE = global.MM_API_BASE || "/api";

    function buildUrl(path) {
        return API_BASE + path;
    }

    async function request(path, options) {
        options = options || {};

        var fetchOptions = {
            method: options.method || "GET",
            credentials: "same-origin",
            headers: Object.assign(
                { Accept: "application/json" },
                options.body !== undefined ? { "Content-Type": "application/json" } : {},
                options.headers || {}
            )
        };

        if (options.body !== undefined) {
            fetchOptions.body = JSON.stringify(options.body);
        }

        var response;
        try {
            response = await fetch(buildUrl(path), fetchOptions);
        } catch (networkError) {
            var offlineError = new Error("Could not reach the server. Is the backend running?");
            offlineError.status = 0;
            throw offlineError;
        }

        var text = await response.text();
        var data = null;

        if (text) {
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                data = null;
            }
        }

        if (!response.ok) {
            var error = new Error((data && data.message) || "Request failed (" + response.status + ")");
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    global.Api = {
        base: API_BASE,
        request: request,
        get: function (path) { return request(path); },
        post: function (path, body) { return request(path, { method: "POST", body: body === undefined ? {} : body }); },
        put: function (path, body) { return request(path, { method: "PUT", body: body === undefined ? {} : body }); },
        del: function (path) { return request(path, { method: "DELETE" }); }
    };

})(window);
