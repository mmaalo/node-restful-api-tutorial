const express = require('express');
const router = express('router');

const checkAuth = require('../middleware/check-auth');

const upload = require('../middleware/image-upload-multer');

const Product = require('../models/product');

const ProductsController = require('../controllers/products')

const urlAndPorts = require('../../config/urlAndPorts');


router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth.logged_in, upload.single('productImage'), ProductsController.products_post_newProduct);

router.get('/:productId', ProductsController.products_get_productById);

router.patch('/:productId', checkAuth.logged_in, ProductsController.products_patch_productById);

router.delete('/:productId', checkAuth.same_user_or_admin, ProductsController.products_delete_productById);

module.exports = router;
