import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
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
  deleted: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model("Order", OrderSchema);
