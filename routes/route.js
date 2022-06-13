import express from "express";
import { createRoute, getRoutes } from "../controllers/routeController.js";

const router = express.Router();

//create/update route
router.post("/create", createRoute);

//get routes
router.get("/", getRoutes);

// //update order
// router.put("/:id", updateOrder);

// //update order
// router.put("/order/:id", updateOrderStatus);

// //delete order by id
// router.delete("/:id", deleteOrder);

// //get 1 order by mongodb Id
// router.get("/order/:id", getOrder);

// //get all orders of today
// router.get("/", getOrders);

export default router;
