import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderbuddyId: {
      type: String,
      required: true,
      unique: true,
    },
    orderbuddyStatus: {
      type: String,
      required: true,
      default: "init",
    },
    status: {
      type: String,
      required: true,
      default: "init",
    },

    orderbuddyDriverId: {
      type: String,
      required: true,
      default: 0,
    },
    driverId: {
      type: String,
      required: true,
      default: 0,
    },
    address: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    streetnumber: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    coord: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: true,
    },
    long: {
      type: String,
      required: true,
    },
    timeSet: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    remarks: {
      type: String,
    },
    payment: [
      {
        method: String,
        total: String,
      },
    ],
    source: [
      {
        sourceType: String,
        sourceId: String,
      },
    ],
    tel: {
      type: String,
    },

    deleted: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
