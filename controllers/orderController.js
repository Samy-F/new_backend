import Order from "../models/Order.js";
import date from "date-and-time";
import moment from "moment";
import axios from "axios";
import { createError } from "../utils/createError.js";

//create order
export const createOrder = async (req, res, next) => {
  console.log("req");
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

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

export const updateOrderStatus = async (req, res, next) => {
  try {
    let orderId = req.params.id;
    let driverId = req.query.driverId;
    let status = req.query.status;
    //Order status update

    const order = await Order.findById(req.params.id);
    await updateOrderbuddyStatus(
      order.orderbuddyId,
      driverId,
      status,
      order.timeSet
    );

    const updateOrderStatus = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: status,
          orderbuddyStatus: status,
          driverId: driverId,
          orderbuddyDriverId: driverId,
        },
      },
      { new: true }
    );

    res.status(200).json(`Updated order status to ${req.query.status}`);
  } catch (err) {
    console.log(err.message);
    next(createError(404, "Order Not Found!"));
  }
};

//get 1 order by mongodb Id
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

//get all today orders
export const getOrders = async (req, res, next) => {
  try {
    const query = req.query;
    // let { driverId, status, startDate, endDate, format } = query;

    let { startDate, endDate, ...others } = query;
    console.log("others " + JSON.stringify(others));
    //this part is for all the date related stuf
    const now = new Date();
    const yesterday = date.format(date.addDays(now, -1), "YYYY-MM-DD");

    //If restaurants are open at 2AM it the system has to get the orders from today and yesterday
    //this also checks if the query date is valid
    let resetTime = 7;
    if (!moment(startDate, "YYYY-MM-DD", true).isValid()) {
      startDate = date.format(now, "YYYY-MM-DD");
      if (now.getHours() < resetTime) {
        startDate = yesterday;
      }
    }

    !moment(endDate, "YYYY-MM-DD", true).isValid()
      ? (endDate = date.format(now, "YYYY-MM-DD"))
      : endDate;

    //it selects enddate + 1. otherwise it wont work to query the same start/enddate
    endDate = date.format(date.addDays(now, +1), "YYYY-MM-DD");

    console.log(startDate);
    console.log(endDate);

    const orders = await Order.find({
      ...others,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ timeSet: 1 });

    console.log(orders.length);
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

//delete order
export const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndUpdate(req.params.id, {
      $set: { deleted: 1 },
    });
    res.status(200).json("Deleted order successfully");
  } catch (err) {
    next(createError(404, "Order Not Found!"));
  }
};
