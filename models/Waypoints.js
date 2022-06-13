import mongoose from "mongoose";
const WaypointSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
  },
  orders: {
    type: [String],
  },
  startTime: new Date(),
  endTime: {
    type: Date,
    required: false,
  },
  estimatedTime: {
    type: Number,
    required: false,
  },
  distance: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Waypoint", WaypointSchema);
