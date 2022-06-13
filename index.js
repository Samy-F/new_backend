import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import "./fetchData/orderCron.js";
import orderRoute from "./routes/order.js";
import routesRoute from "./routes/route.js";
import driversRoute from "./routes/driver.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongodb");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/routes", routesRoute);
app.use("/api/v1/drivers", driversRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8000, () => {
  connect();
  console.log("connected to backend");
});
