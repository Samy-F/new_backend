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

  try {
    let drivers;
    if (query.active === "true") {
      drivers = await Driver.find({
        coord: { $ne: "" },
      }).populate("currentRoute");
    } else {
      drivers = await Driver.find().populate("currentRoute");
    }
    res.status(200).json(drivers);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
