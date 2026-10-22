const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const server = require("../app");

test("Application returns a successful response", async (t) => {
    await new Promise((resolve) => {
        if (server.listening) {
            resolve();
        } else {
            server.once("listening", resolve);
        }
    });

    t.after(() => {
        server.close();
    });

    const address = server.address();

    const response = await new Promise((resolve, reject) => {
        http.get(
            `http://127.0.0.1:${address.port}`,
            (res) => {
                let body = "";

                res.on("data", (chunk) => {
                    body += chunk;
                });

                res.on("end", () => {
                    resolve({
                        statusCode: res.statusCode,
                        body: JSON.parse(body)
                    });
                });
            }
        ).on("error", reject);
    });

    assert.strictEqual(response.statusCode, 200);

    assert.strictEqual(
        response.body.status,
        "success"
    );
});