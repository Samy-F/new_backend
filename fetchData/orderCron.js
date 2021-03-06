import cron from "node-cron";
import { fetchDrivers } from "./fetchDrivers.js";
import { fetchOrderbuddy } from "./fetchOrderbuddy.js";
import { calculateRoute } from "./calculateRoute.js";

fetchOrderbuddy();
fetchDrivers();
calculateRoute();

cron.schedule("* * * * *", () => {
  fetchOrderbuddy();
  //   console.log(`fetched new orders: ${Date.now()}`);
});

cron.schedule("*/100 * * * * *", () => {
  fetchDrivers();
  //   console.log(`fetched driver data: ${Date.now()}`);
});

cron.schedule("*/30 * * * * *", () => {
  calculateRoute();
  //   console.log(`fetched driver data: ${Date.now()}`);
});
