const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const urlAndPorts = require('../../config/urlAndPorts');

exports.orders_get_all = (req, res, next) => {
  Order.find()
  .select('product quantity _id')
  .populate('product', 'name')
  .exec()
  .then(docs => {
    return res.status(200).json({
    count: docs.length,
    orders: docs.map(doc => {
      return {
        _id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
        request: {
          type: "GET",
          url: `${urlAndPorts.serverUrl}/orders/${doc._id}`
          }
        }
      })
    });
  })
  .catch(err => {
    return res.status(500).json({
      error: err
    })
  });
}

exports.orders_post_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: "GET",
          url: `${urlAndPorts.serverUrl}/orders/${result._id}`
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.orders_get_orderById = (req, res, next) => {
  Order.findById(req.params.orderId)
  .populate('product', 'name price')
  .exec()
  .then(order => {
    if(!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }
    return res.status(200).json({
      order: {
        quantity: order.quantity,
        product: order.product,
        _id: order._id
      },
      request: {
        type: 'GET',
        url: `${urlAndPorts.serverUrl}/orders/`
      }
    })
  })
  .catch(err => {
    return res.status(500).json({
      error: err
    })
  });
}

exports.orders_patch_productById = (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Order.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      return res.status(200).json({
        message: 'Order updated',
        request: {
          type: 'GET',
          url: `${urlAndPorts.serverUrl}/orders/${id}`
        }
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err
      });
    });
}

exports.orders_delete_orderById = (req, res, next) => {
  Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
      return res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: `${urlAndPorts.serverUrl}/orders/`,
          body: { productId: 'ID', quantity: 'Number'}
          }
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err
      })
    });
}
