import Driver from "../models/Driver.js";
import Route from "../models/Route.js";
import Order from "../models/Order.js";
import { createError } from "../utils/createError.js";
import axios from "axios";

const getRouteTime = async (origin, destination, mode) => {
  // console.log(mode);
  // console.log("!!!!!!!!!! -- Routetime request made  -- !!!!!!!!!");
  let apiKey = "PTGK21b4ty6ZyJvkDDj5DotH5lLd3gXm";

  if (mode == "bicycle") {
    var config = {
      method: "get",
      url: `https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json?computeBestOrder=true&routeType=fastest&traffic=true&travelMode=${mode}&vehicleMaxSpeed=16&key=gch7cOKSHaEZtEUli5HqE4jMK6vcyMV1
`,
      headers: {},
    };

    // console.log(config);
  } else if (mode == "car") {
    var config = {
      method: "get",
      url: `https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json?computeBestOrder=true&routeType=fastest&traffic=true&travelMode=${mode}&key=gch7cOKSHaEZtEUli5HqE4jMK6vcyMV1
`,
      headers: {},
    };
    // console.log(config);
  }

  const res = await axios(config);
  // console.log(res.data);
  const duration = res.data.routes[0].summary.travelTimeInSeconds;
  // console.log(duration);

  // console.log(`tomtom req: ${duration}`);
  return duration;
};

//calculates the routetime of all the orders in the drivers orders tab (routes)
export const calculateRoute = async () => {
  try {
    //routetime starts at 0
    let routeTime = 0;

    //looks for routes in the database
    let routes = await Route.find().populate("driverId");

    routes = routes.filter(async (route) => {
      console.log(route.driverId);
      return route.driverId.coord !== "";
    });

    // console.log(routes);
    //foreach route, searsch for all the orders and calculate the time
    routes.forEach(async (route) => {
      let orders = route.orders;
      let driver = route.driverId;

      //if driver did not turn location on
      if (driver.coord !== "") {
        // console.log(driver.coord);
        orders = await Promise.all(
          orders.map(async (orderId) => {
            let order = await Order.findById(orderId);
            return order;
          })
        );

        //filter out the orders that are already delivered
        orders = orders.filter((order) => {
          return order.status === "enroute";
        });

        if (orders.length > 0) {
          for (let i = -1; i < orders.length; i++) {
            if (i === -1) {
              console.log("from driver coord to first order: 10");
              routeTime += await calcDriverToOrder(driver, orders[0]);
            } else if (i === 0 && orders.length > 1) {
              //only runs if there are more than 1 orders
              console.log("order first to second");
              routeTime += await calcOrderTime(
                driver,
                orders[i],
                orders[i + 1]
              );
            } else if (i === orders.length - 1) {
              //for the last order
              console.log("order last to restaurant");
              routeTime += await calcOrderToRestaurant(driver, orders[i]);
            } else {
              console.log("order middle");
              routeTime += await calcOrderTime(
                driver,
                orders[i],
                orders[i + 1]
              );
            }
          }
        } else {
          routeTime += await calcDriverToRestaurant(driver);
        }

        routeTime /= 60;

        if (routeTime < 0.2) routeTime = 0;

        console.log(routeTime);
      }
      updateDriver(driver._id, routeTime);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getDriver = async (driverId) => {
  try {
    let driver = await Driver.findOne({ driverId });

    if (driver.coord === "") {
      //if statement for inactive drivers/drivers that didnt open the deliverybuddy app.
      return undefined;
    }
    return driver;
  } catch (err) {
    createError(err.status, err.message);
  }
};

const updateDriver = async (driverId, routeTime) => {
  try {
    const updatedOrder = await Driver.findByIdAndUpdate(
      driverId,
      { $set: { routeTime } },
      { new: true }
    );
    console.log("updated drivers routeTime");
  } catch (err) {
    console.log(err);
    createError(err);
  }
};

//from the drivers position to the first next order
const calcDriverToOrder = async (driver, order) => {
  try {
    let routeTime = await getRouteTime(
      driver.coord,
      order.coord,
      driver.tomtomMode
    );

    console.log(
      `From driver location to the ${order.street}: ${routeTime / 60}`
    );

    return routeTime;
  } catch (err) {
    console.log(err);
  }
};

//from the first order to the second order
const calcOrderTime = async (driver, order1, order2) => {
  try {
    let routeTime = await getRouteTime(
      order1.coord,
      order2.coord,
      driver.tomtomMode
    );
    // console.log(`From ${order1.street} to ${order2.street}: ${routeTime / 60}`);
    return routeTime;
  } catch (err) {
    console.log("test");
    console.log(err);
  }
};

//from the last order to the restaurant
const calcOrderToRestaurant = async (driver, order) => {
  try {
    const restaurant = "52.293069,4.861301";

    let routeTime = await getRouteTime(
      order.coord,
      restaurant,
      driver.tomtomMode
    );
    console.log(`From last order to the restaurant: ${routeTime / 60}`);
    return routeTime;
  } catch (err) {
    console.log(err);
  }
};

//from the last order to the restaurant
const calcDriverToRestaurant = async (driver) => {
  try {
    const restaurant = "52.293069,4.861301";

    let routeTime = await getRouteTime(
      driver.coord,
      restaurant,
      driver.tomtomMode
    );
    // console.log(`From driver location to the restaurant: ${routeTime / 60}`);
    return routeTime;
  } catch (err) {
    console.log(err);
  }
};
