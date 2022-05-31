import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

//create order
router.post("/", createOrder);

//update order
router.put("/:id", updateOrder);

//update order
router.put("/order/:id", updateOrderStatus);

//delete order by id
router.delete("/:id", deleteOrder);

//get 1 order by mongodb Id
router.get("/order/:id", getOrder);

//get all orders of today
router.get("/", getOrders);

export default router;
