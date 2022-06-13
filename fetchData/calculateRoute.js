import Driver from "../models/Driver.js";
import Route from "../models/Route.js";
import Order from "../models/Order.js";
import { createError } from "../utils/createError.js";

const getRouteTime = async (origin, destination, mode) => {
  console.log("!!!!!!!!!! -- Routetime request made  -- !!!!!!!!!");
  let apiKey = "PTGK21b4ty6ZyJvkDDj5DotH5lLd3gXm";

  if (mode == "bicycle") {
    var config = {
      method: "get",
      url: `https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json?computeBestOrder=true&routeType=fastest&traffic=true&travelMode=${mode}&vehicleMaxSpeed=25&key=gch7cOKSHaEZtEUli5HqE4jMK6vcyMV1
`,
      headers: {},
    };

    console.log(config);
  } else if (mode == "car") {
    var config = {
      method: "get",
      url: `https://api.tomtom.com/routing/1/calculateRoute/${origin}:${destination}/json?computeBestOrder=true&routeType=fastest&traffic=true&travelMode=${mode}&key=gch7cOKSHaEZtEUli5HqE4jMK6vcyMV1
`,
      headers: {},
    };
    console.log(config);
  }

  const res = await axios(config);
  // console.log(res.data);
  const duration = res.data.routes[0].summary.travelTimeInSeconds;
  // console.log(duration);
  return duration;
};

//calculates the routetime of all the orders in the drivers orders tab (routes)
export const calculateRoute = async () => {
  try {
    //routetime starts at 0
    let routeTime = 0;

    //looks for routes in the database
    let routes = await Route.find();

    //foreach route, searsch for all the orders and calculate the time
    routes.forEach(async (route) => {
      let orders = route.orders;

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
            routeTime += await calcDriverToOrder(orders[0]);
          } else if (i === 0 && orders.length > 1) {
            //only runs if there are more than 1 orders
            console.log("order first to second");
            routeTime += await calcOrderTime();
          } else if (i === orders.length - 1) {
            //for the last order
            console.log("order last to restaurant");
            routeTime += await calcToRestaurantTime();
          } else {
            console.log("order middle");
            routeTime += await calcOrderTime();
          }
        }
      } else {
        routeTime += await calcToRestaurantTime();
      }

      //driver coord to order 1: 10min
      // order 1 order 2: 10min
      // order 2 order 3: 10min
      // order 2 order 3: 10min
      //order 3 to kibboets: 10 min

      console.log(routeTime);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//get the driver coord to calculate the return time
// const getDriverCoord = async (driverId) => {
//   try {
//     let driver = await Driver.findOne({ driverId });
//     if (driver.coord === "") {
//       //if statement for inactive drivers/drivers that didnt open the deliverybuddy app.
//     }
//     return driver.coord;
//   } catch (err) {
//     createError(err.status, err.message);
//   }
// };
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

//from the drivers position to the first next order
const calcDriverToOrder = async (order) => {
  console.log("test");
  let { coord, driverId } = order;
  let drivercoord = await getDriverCoord(driverId).coord;
  console.log(drivercoord);
  console.log(drivercoord);
  console.log(drivercoord);
  console.log(drivercoord);
  console.log(drivercoord);
  console.log(drivercoord);

  // console.log(coord, drivercoord);
  return 10;
};

//from the first order to the second order
const calcOrderTime = async (fromCoord, toCoord) => {
  return 10;
};

//from the last order to the restaurant
const calcToRestaurantTime = async (fromCoord, toCoord) => {
  return 10;
};
