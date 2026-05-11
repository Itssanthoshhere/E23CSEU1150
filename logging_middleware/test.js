const { Log } = require("./logger");

async function testLogger() {
  const response = await Log(
    "frontend",
    "info",
    "component",
    "Logger middleware initialized",
  );

  console.log(response);
}

testLogger();
