import express from "express";
import { getDriver, getDrivers } from "../controllers/driverController.js";

const router = express.Router();

//get all orders of today
router.get("/", getDrivers);
router.get("/:id", getDriver);

export default router;
