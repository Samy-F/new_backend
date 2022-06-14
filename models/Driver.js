import mongoose from "mongoose";
import Route from "./Route.js";

const DriverSchema = new mongoose.Schema(
  {
    orderbuddyDriverId: {
      type: String,
      required: true,
      unique: true,
    },
    restaurantId: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      default: "",
    },
    login: {
      type: String,
      required: true,
      default: "init",
    },
    coord: {
      type: String,
      default: 0,
    },
    lat: {
      type: String,
    },
    long: {
      type: String,
    },
    coordUpdate: {
      type: Date,
    },
    currentRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      default: undefined,
    },
    routeTime: {
      type: Number,
      default: 0,
      required: true,
    },
    googleMode: {
      type: String,
    },
    tomtomMode: {
      type: String,
    },
    tel: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", DriverSchema);
