/**
 * Campus Notifications - Smart Priority Inbox
 *
 * Fetches campus notifications from the evaluation API
 * and returns the most important notifications first.
 *
 * Priority Order:
 * Placement > Result > Event
 *
 * If two notifications share the same priority,
 * the newer notification gets ranked higher.
 */

const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const axios = require("axios");

const { Log } = require("../logging_middleware/logger");
const { getToken } = require("../logging_middleware/auth");

// API endpoint
const NOTIFICATIONS_API =
  "http://4.224.186.213/evaluation-service/notifications";

/**
 * Priority map
 * Higher value = higher importance
 */
const PRIORITY_LEVELS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Fetch notifications from API
 */
async function fetchNotifications() {
  await Log(
    "backend",
    "info",
    "service",
    "Requesting notifications from evaluation service",
  );

  const token = await getToken();

  const response = await axios.get(NOTIFICATIONS_API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const notifications = response.data.notifications || [];

  await Log(
    "backend",
    "info",
    "service",
    `Received ${notifications.length} notifications`,
  );

  return notifications;
}

/**
 * Generates a score for ranking notifications.
 *
 * Logic:
 * - Priority type decides main ranking
 * - Latest timestamp breaks ties
 */
function calculateScore(notification) {
  const priority = PRIORITY_LEVELS[notification.Type] || 0;

  const timeValue = new Date(notification.Timestamp).getTime();

  // Large multiplier ensures priority dominates timestamp
  return priority * 10000000000000 + timeValue;
}

/**
 * Returns top N important notifications
 */
async function getTopNotifications(notifications, limit = 10) {
  await Log(
    "backend",
    "info",
    "service",
    `Ranking ${notifications.length} notifications`,
  );

  // Attach score to each notification
  const rankedNotifications = notifications.map((item) => ({
    ...item,
    score: calculateScore(item),
  }));

  // Sort in descending order
  rankedNotifications.sort((a, b) => b.score - a.score);

  // Remove internal score before returning
  const finalResult = rankedNotifications
    .slice(0, limit)
    .map(({ score, ...notification }) => notification);

  await Log(
    "backend",
    "info",
    "service",
    `Top ${limit} notifications prepared`,
  );

  return finalResult;
}

/**
 * Print notifications in formatted style
 */
function printNotifications(notifications) {
  console.log("\n══════════════ PRIORITY INBOX ══════════════\n");

  notifications.forEach((notification, index) => {
    console.log(`${index + 1}. ${notification.Type}`);
    console.log(`   Message   : ${notification.Message}`);
    console.log(`   Timestamp : ${notification.Timestamp}`);
    console.log("--------------------------------------------------");
  });

  console.log("\nJSON Response:\n");

  console.log(JSON.stringify(notifications, null, 2));
}

/**
 * Main function
 */
async function main() {
  await Log("backend", "info", "service", "Starting priority inbox service");

  try {
    const notifications = await fetchNotifications();

    const topNotifications = await getTopNotifications(notifications, 10);

    printNotifications(topNotifications);

    await Log(
      "backend",
      "info",
      "service",
      "Priority inbox execution completed",
    );
  } catch (error) {
    await Log(
      "backend",
      "fatal",
      "service",
      `Application crashed: ${error.message}`,
    );

    console.error("\nSomething went wrong:");
    console.error(error.message);

    process.exit(1);
  }
}

main();
