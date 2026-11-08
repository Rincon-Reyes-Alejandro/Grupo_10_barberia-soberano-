// Importamos la base de datos (asegúrate de que la ruta a 'models' sea la correcta según tu estructura)
const db = require('../models'); // O '../database/models'

const productsController = {
    // 1. GET /products - Listado de productos
    index: async (req, res) => {
        try {
            const products = await db.Product.findAll({
                include: ['category'] // Hace el JOIN con la tabla de categorías
            });
            res.render('products/index', { products });
        } catch (error) {
            console.error("Error en index:", error);
            res.status(500).send('Error interno del servidor');
        }
    },

    // 2. GET /products/create - Formulario de creación
    create: async (req, res) => {
        try {
            // Buscamos todas las categorías para enviarlas al formulario
            const categories = await db.Category.findAll();
            res.render('products/createProduct', { categories });
        } catch (error) {
            console.error("Error en create:", error);
            res.status(500).send('Error interno del servidor');
        }
    },

    // 3. GET /products/:id - Detalle de un producto particular
    detail: async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await db.Product.findByPk(productId, {
                include: ['category']
            });
            
            if (!product) {
                return res.send('Producto no encontrado');
            }
            res.render('products/detail', { product });
        } catch (error) {
            console.error("Error en detail:", error);
            res.status(500).send('Error interno del servidor');
        }
    },

    // 4. POST /products - Acción de creación (guarda en la BD)
    store: async (req, res) => {
        try {
            await db.Product.create({
                name: req.body.name,
                description: req.body.description,
                price: Number(req.body.price),
                category_id: req.body.category, // Asegúrate de que el <select> en tu vista se llame 'category' o 'category_id'
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
            
            // Hacemos las dos consultas al mismo tiempo para mayor velocidad
            const productPromise = db.Product.findByPk(productId);
            const categoriesPromise = db.Category.findAll();
            
            const [product, categories] = await Promise.all([productPromise, categoriesPromise]);

            if (!product) {
                return res.send('Producto no encontrado para editar');
            }
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
            
            // Primero buscamos el producto original para saber qué imagen tenía
            const productToEdit = await db.Product.findByPk(productId);

            if (productToEdit) {
                await db.Product.update({
                    name: req.body.name,
                    description: req.body.description,
                    price: Number(req.body.price),
                    category_id: req.body.category,
                    image: req.file ? req.file.filename : productToEdit.image
                }, {
                    where: { id: productId } // Importante: el WHERE le dice a Sequelize cuál actualizar
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
            const productId = req.params.id;

            await db.Product.destroy({
                where: { id: productId }
            });

            res.redirect('/products');
        } catch (error) {
            console.error("Error en destroy:", error);
            res.status(500).send('Error al eliminar el producto');
        }
    }
};

module.exports = productsController;