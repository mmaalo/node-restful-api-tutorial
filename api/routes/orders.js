const express = require('express');
const router = express('router');
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

// Handle incoming GET requests to /orders
router.get("/", checkAuth.same_user_or_admin, OrdersController.orders_get_all);

router.post("/", checkAuth.same_user_or_admin, OrdersController.orders_post_order);

router.get('/:orderId', checkAuth.same_user_or_admin, OrdersController.orders_get_orderById);

router.patch('/:orderId', checkAuth.same_user_or_admin, OrdersController.orders_patch_productById);

router.delete('/:orderId', checkAuth.same_user_or_admin, OrdersController.orders_delete_orderById);

module.exports = router;
