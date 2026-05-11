require("dotenv").config();
const axios = require("axios");

async function getToken() {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/auth",
      {
        email: process.env.EMAIL,
        name: process.env.NAME,
        rollNo: process.env.ROLLNO,
        accessCode: process.env.ACCESS_CODE,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      },
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Auth Error:", error.response?.data || error.message);

    return null;
  }
}

module.exports = { getToken };
