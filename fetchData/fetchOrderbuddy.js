import Order from "../models/Order.js";

import date from "date-and-time";
import moment from "moment";
import axios from "axios";
import convert from "xml-js";

export const createHotel = async (req, res, next) => {};

//function to get all orders from yesterday to today
export const fetchOrderbuddy = async (query, res) => {
  const now = new Date();

  //get yesterday date
  // const startDate = "2022-05-01";
  const startDate = date.format(date.addDays(now, -1), "YYYY-MM-DD");

  //get todays date
  const endDate = date.format(now, "YYYY-MM-DD");

  //fetching orders from orderbuddy api
  let url = `https://api.foodticket.net/1/orders?sdate_start=${startDate}&sdate_end=${endDate}`;
  console.log(url);
  var config = {
    method: "get",
    url,
    headers: {
      "X-OrderBuddy-Client-Id": "5704",
      "X-OrderBuddy-API-Key": "91ee337266ee0790e95a20bd5793c4dd",
    },
  };

  const axiosRes = await axios(config).catch((err) => console.log(err));
  let data = await convert.xml2json(axiosRes.data, {
    compact: true,
    spaces: 4,
  });
  let ordersData = JSON.parse(data);
  let orders;

  if (Object.keys(ordersData["orders"]).length !== 0) {
    if (ordersData["orders"]["order"]["id"] === undefined) {
      orders = ordersData["orders"]["order"];
    } else {
      orders = [ordersData["orders"]["order"]];
      // console.log(orders);
    }

    //formatting the object to the needs
    orders = orders.map((order) => {
      return {
        orderbuddyId: order.id._text,
        orderbuddyStatus: order.status._text,
        status: undefined,
        delivery: order.delivery._text, //pickup or deliver
        driverId: undefined,
        orderbuddyDriverId: order.deliverer_id._text,
        address: order.address._text,
        street: order.street._text,
        streetnumber: order.streetnumber._text,
        zipcode: order.zipcode._text,
        city: order.city._text,
        coord: order.coord._text,
        timeSet: order.time_set._text || "ZSM",
        date: order.date._text,
        remarks: order.remarks._text,
        deleted: order.deleted._text,
      };
    });
    await orders.forEach((order) => {
      if (order.delivery === "deliver") addOrder(order);
      // if (order.delivery !== "deliver") console.log(order);
    });

    console.log("all orders added");
  }
};

//functions for adding orders to database
const addOrder = async (order) => {
  const newOrder = new Order(order);

  try {
    const savedOrder = await newOrder.save();
    console.log("order created");
  } catch (err) {
    if (err.code === 11000) {
      return;
    } else {
      console.log(err.message);
    }
  }
};
