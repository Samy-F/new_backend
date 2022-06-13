import mongoose from "mongoose";
const RouteSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true,
  },
  orders: {
    type: [String],
  },
  // startTime: new Date(),
  endTime: {
    type: Date,
    required: false,
  },
  estimatedTimeArrival: {
    type: Number,
    default: 0,
    required: false,
  },
  distance: {
    type: Number,
    default: 0,
    required: false,
  },
});

export default mongoose.model("Route", RouteSchema);
