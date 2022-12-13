const productModel = require('../models/Product');

module.exports = {

    async createProduct(req, res, next) {
        try {
            const createdProduct = await productModel.create(req.body);

            return res.status(201).json(createdProduct);

        } catch (e) {
            return next(e);
        }
    },

    async getProducts(req, res, next) {
        try {
            const allProducts = await productModel.find({});

            return res.status(200).json(allProducts);
        } catch (e) {
            return next(e);
        }
    },

    async getProductById(req, res, next) {
        try {
            const product = await productModel.findById(req.params.productId);

            if (!product) {
                return res.status(404).send();
            }

            return res.status(200).json(product);
        } catch (e) {
            console.log(e);
            return next(e);
        }
    },

    async updateProduct(req, res, next) {
        try {

        } catch (e) {
            return next(e);
        }
    }
}