import cron from "node-cron";
import { fetchOrderbuddy } from "./fetchOrderbuddy.js";

fetchOrderbuddy();

cron.schedule("* * * * *", () => {
  fetchOrderbuddy();
  console.log("running a task every minute");
});
