import Driver from "../models/Driver.js";
import axios from "axios";
import { createError } from "../utils/createError.js";

//update order
export const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
};

//updating the order status and orderbuddyStatus
const updateOrderbuddyStatus = async (orderId, driverId, status, timeSet) => {
  let url = `https://api.foodticket.nl/1/orders?id=${orderId}&deliverer_id=${driverId}&status=${status}&time_set=${timeSet}`;

  var config = {
    method: "patch",
    url,
    headers: {
      "X-OrderBuddy-Client-Id": "5704",
      "X-OrderBuddy-API-Key": "91ee337266ee0790e95a20bd5793c4dd",
    },
  };

  const axiosRes = await axios(config);
  return axiosRes;
};

//get 1 driver by mongodb Id
export const getDriver = async (req, res, next) => {
  try {
    const driver = await Order.findById(req.params.id);
    res.status(200).json(driver);
  } catch (err) {
    next(err);
  }
};

//get all today drivers
export const getDrivers = async (req, res, next) => {
  let query = req.query;
  console.log(query);
  try {
    let drivers;
    if (query.active === "true") {
      drivers = await Driver.find({
        coord: { $ne: "" },
      });
    } else {
      drivers = await Driver.find();
    }
    res.status(200).json(drivers);
  } catch (err) {
    next(err);
  }
};
