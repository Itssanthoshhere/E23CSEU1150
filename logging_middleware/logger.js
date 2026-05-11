/**
 * Logging Middleware
 * Reusable Log function that sends structured logs
 * to the Affordmed evaluation server.
 */

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const axios = require("axios");
const { getToken } = require("./auth");

const LOG_API = process.env.LOG_API;

async function Log(stack, level, pkg, message) {
  try {
    const token = await getToken();

    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Logging Error:", error.response?.data || error.message);

    return null;
  }
}

module.exports = { Log };
