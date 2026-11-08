const db = require('../models');
// 1. Importamos express-validator
const { validationResult } = require('express-validator');

const productsController = {
    // 1. GET /products - Listado de productos
    index: async (req, res) => {
        try {
            const products = await db.Product.findAll({ include: ['category'] });
            res.render('products/index', { products });
        } catch (error) {
            console.error("Error en index:", error);
            res.status(500).send('Error interno del servidor');
        }
    },

    // 2. GET /products/create - Formulario de creación
    create: async (req, res) => {
        try {
            const categories = await db.Category.findAll();
            res.render('products/createProduct', { categories });
        } catch (error) {
            console.error("Error en create:", error);
            res.status(500).send('Error interno del servidor');
        }
    },

    // 3. GET /products/:id - Detalle
    detail: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await db.Product.findByPk(productId, { include: ['category'] });
            
            if (!product) return res.send('Producto no encontrado');
            res.render('products/detail', { product });
        } catch (error) {
            console.error("Error en detail:", error);
            res.status(500).send('Error interno del servidor');
        }
    },

    // 4. POST /products - Acción de creación
    store: async (req, res) => {
        try {
            // Atrapamos errores de validación
            const resultValidation = validationResult(req);

            if (resultValidation.errors.length > 0) {
                // Volvemos a pedir las categorías para que la vista no se rompa
                const categories = await db.Category.findAll();
                return res.render('products/createProduct', {
                    categories,
                    errors: resultValidation.mapped(),
                    oldData: req.body
                });
            }

            await db.Product.create({
                name: req.body.name,
                description: req.body.description,
                price: Number(req.body.price),
                category_id: req.body.category,
                image: req.file ? req.file.filename : "producto-crema.jpg"
            });

            res.redirect('/');
        } catch (error) {
            console.error("Error en store:", error);
            res.status(500).send('Error al guardar el producto');
        }
    },

    // 5. GET /products/:id/edit - Formulario de edición
    edit: async (req, res) => {
        try {
            const productId = req.params.id;
            const productPromise = db.Product.findByPk(productId);
            const categoriesPromise = db.Category.findAll();
            
            const [product, categories] = await Promise.all([productPromise, categoriesPromise]);

            if (!product) return res.send('Producto no encontrado para editar');
            res.render('products/editProduct', { product, categories });
        } catch (error) {
            console.error("Error en edit:", error);
            res.status(500).send('Error interno del servidor');
        }
    },

    // 6. PUT /products/:id - Acción de modificación
    update: async (req, res) => {
        try {
            const productId = req.params.id;
            const resultValidation = validationResult(req);

            // Si hay errores, devolvemos a la vista con la info previa
            if (resultValidation.errors.length > 0) {
                const productPromise = db.Product.findByPk(productId);
                const categoriesPromise = db.Category.findAll();
                const [product, categories] = await Promise.all([productPromise, categoriesPromise]);

                return res.render('products/editProduct', {
                    product, 
                    categories,
                    errors: resultValidation.mapped(),
                    oldData: req.body
                });
            }
            
            const productToEdit = await db.Product.findByPk(productId);

            if (productToEdit) {
                await db.Product.update({
                    name: req.body.name,
                    description: req.body.description,
                    price: Number(req.body.price),
                    category_id: req.body.category,
                    image: req.file ? req.file.filename : productToEdit.image
                }, {
                    where: { id: productId }
                });
            }

            res.redirect('/');
        } catch (error) {
            console.error("Error en update:", error);
            res.status(500).send('Error al actualizar el producto');
        }
    },

    // 7. DELETE /products/:id - Acción de borrado
    destroy: async (req, res) => {
        try {
            await db.Product.destroy({ where: { id: req.params.id } });
            res.redirect('/products');
        } catch (error) {
            console.error("Error en destroy:", error);
            res.status(500).send('Error al eliminar el producto');
        }
    }
};

module.exports = productsController;