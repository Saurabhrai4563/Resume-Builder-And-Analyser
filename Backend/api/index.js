require("dotenv").config();

const app = require("../src/app");
const connectToDb = require("../src/config/database");

let dbConnectionPromise;

async function handler(req, res) {
    if (!dbConnectionPromise) {
        dbConnectionPromise = connectToDb();
    }

    await dbConnectionPromise;

    return app(req, res);
}

module.exports = handler;