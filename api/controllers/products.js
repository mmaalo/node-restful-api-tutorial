const mongoose = require('mongoose');
const Product = require('../models/product');

const urlAndPorts = require('../../config/urlAndPorts');


function isEmpty(x) {
   for(var i in x) {
       return false;
   }
   return true;
}

exports.products_get_all = (req, res, next) => {
  Product.find()
  .select('name price _id productImage')
  .exec()
  .then(docs => {
    console.log(docs);
    if(isEmpty(docs) === false) {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: `${urlAndPorts.serverUrl}/products/${doc._id}`
            }
          }
        })
      }
      return res.status(200).json(response);
    } else {
      return res.status(200).json({
        message: 'No entries found'
      });
    }
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({
      error: err
    });
  });
}

exports.products_post_newProduct = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
    .then(result => {
      console.log(result);
      return res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: `${urlAndPorts.serverUrl}/products/${result._id}`
          }
        }
      });
    })
    .catch(err => {
      console.log(err)
      return res.status(500).json({
        err: error
      });
    }
  );
}


exports.products_get_productById = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .select('name price _id productImage')
  .exec()
  .then(doc => {
    console.log('From database', doc);
    if(doc) {
      return res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          discription: 'Get all products',
          url: `${urlAndPorts.serverUrl}/products/`
        }
      });
    }
      return res.status(404).json({message: 'No valid entry found for valid ID'});
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({error: err});
  });
}

exports.products_patch_productById = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      return res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: `${urlAndPorts.serverUrl}/products/${id}`
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

exports.products_delete_productById = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({_id: id})
    .exec()
    .then(result => {
      return res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: `${urlAndPorts.serverUrl}/products/`,
          data: { name: 'String', price: 'number' }
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
