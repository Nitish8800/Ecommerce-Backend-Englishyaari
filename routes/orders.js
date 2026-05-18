const express = require("express");
const { celebrate, errors } = require("celebrate");
const { auth, authorize } = require("../middleware/auth");
const orderController = require("../controllers/orderController");
const { createOrderValidation } = require("../validations/orderValidation");

const router = express.Router();

router.post(
    "/",
    auth,
    celebrate(createOrderValidation),
    orderController.createOrder
);

router.get(
    "/me",
    auth,
    orderController.getMyOrders
);

// admin all orders and analytics
router.get(
    "/",
    auth,
    authorize("admin"),
    orderController.getAllOrders
);

router.get(
    "/analytics/monthly-revenue",
    auth,
    authorize("admin"),
    orderController.getMonthlyRevenue
);

router.get(
    "/analytics/user-stats",
    auth,
    authorize("admin"),
    orderController.getUserStats
);

router.use(errors());

module.exports = router;