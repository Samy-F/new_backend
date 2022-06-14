import axios from "axios";
import convert from "xml-js";
import Driver from "../models/Driver.js";
import { createError } from "../utils/createError.js";

//function to get all drivers
export const fetchDrivers = async () => {
  // console.log("loading driver data...");
  let config = {
    method: "get",
    url: "https://api.foodticket.nl/1/deliverers",
    headers: {
      "X-OrderBuddy-Client-Id": "5704",
      "X-OrderBuddy-API-Key": "91ee337266ee0790e95a20bd5793c4dd",
    },
  };

  const res = await axios(config);
  let xml = res.data;
  let data = convert.xml2json(xml, { compact: true, spaces: 4 });
  var json = JSON.parse(data);
  let driversObj = json["data"]["row"];

  let drivers = driversObj.map((driver) => {
    driver.coord._text = driver.coord._text || "";
    let googleMode = driver.google_directions_mode._text || "";
    let tomtomMode;

    if (googleMode === "driving") {
      tomtomMode = "car";
    } else {
      tomtomMode = "bicycle";
    }

    return {
      orderbuddyDriverId: driver.id._text,
      restaurantId: driver.client_id._text,
      firstname: driver.firstname._text,
      lastname: driver.lastname._text || "",
      login: driver.login._text,
      coord: driver.coord._text,
      lat: driver.coord._text.split(",")[0],
      long: driver.coord._text.split(",")[1] || "",
      coordUpdate: driver.coord_update._text,
      googleMode,
      tomtomMode,
      tel: driver.tel._text,
      currentRoute: undefined,
      routeTime: undefined,
    };
  });

  await drivers.forEach(async (driver) => {
    try {
      const updateDriver = await Driver.findOneAndUpdate(
        { orderbuddyDriverId: driver.orderbuddyDriverId },
        { $set: driver },
        { upsert: true }
      );
      // console.log(driver);
    } catch (err) {
      console.log(err);
      createError(500, "Could not update/create driver");
    }
  });
};

//functions for adding orders to database
// const addDriver = async (driver) => {
//   const newDriver = new Driver(driver);
//   try {
//     const savedDriver = await newDriver.save();
//     console.log("Driver created");
//   } catch (err) {
//     if (err.code === 11000) {
//       return;
//     } else {
//       createError(500, "Could not create driver");
//     }
//   }
// };

// const updateDriver = async (driver) => {
//   try {
//     console.log("=============================");
//     console.log("=============================");
//     console.log("=============================");
//     console.log("=============================");
//     console.log("=============================");
//     const updatedDriver = await Driver.findByIdAndUpdate(
//       driver.orderbuddyDriverId
//     );
//     console.log("Driver updated");
//   } catch (err) {
//     createError(500, "Could not update driver");
//   }
// };

//update order
