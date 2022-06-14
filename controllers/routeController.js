import Order from "../models/Order.js";
import Route from "../models/Route.js";
import date from "date-and-time";
import moment from "moment";
import axios from "axios";
import { createError } from "../utils/createError.js";
import Driver from "../models/Driver.js";

//create order
export const createRoute = async (req, res, next) => {
  const driverId = req.body.driverId;
  let orders = req.body.orders || [];

  try {
    const updateRoute = await Route.findOneAndUpdate(
      { driverId },
      { $set: { driverId, orders } },
      { upsert: true, new: true }
    );

    const updateDriver = await Driver.findByIdAndUpdate(
      driverId,
      { $set: { currentRoute: updateRoute._id } },
      { new: true }
    );
    res.status(200).json(updateRoute);
  } catch (err) {
    next(err);
  }
};

export const getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
