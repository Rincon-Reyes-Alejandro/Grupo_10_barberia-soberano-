const fs = require('fs');
const path = require('path');

// Ruta para leer el archivo products.json
const productsFilePath = path.join(__dirname, '../data/products.json');

// Función auxiliar para leer los productos actuales
function getProducts() {
    const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

const productsController = {
    // 1. GET /products - Listado de productos
    index: (req, res) => {
        const products = getProducts();
        res.render('products/index', { products });
    },

    // 2. GET /products/create - Formulario de creación
    create: (req, res) => {
        res.render('products/createProduct');
    },

    // 3. GET /products/:id - Detalle de un producto particular
    detail: (req, res) => {
        const products = getProducts();
        const productId = req.params.id;
        const product = products.find(p => p.id == productId);
        
        if (!product) {
            return res.send('Producto no encontrado');
        }
        res.render('products/detail', { product });
    },

    // 4. POST /products - Acción de creación (guarda en el JSON)
    store: (req, res) => {
        const products = getProducts();
        
        const newProduct = {
            id: products.length > 0 ? Number(products[products.length - 1].id) + 1 : 1,
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: "producto-crema.jpg" // Imagen por defecto de las que ya tenemos en public/images
        };

        products.push(newProduct);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

        res.redirect('/');
    },

    // 5. GET /products/:id/edit - Formulario de edición
    edit: (req, res) => {
        const products = getProducts();
        const productId = req.params.id;
        const product = products.find(p => p.id == productId);

        if (!product) {
            return res.send('Producto no encontrado para editar');
        }
        res.render('products/editProduct', { product });
    },

    // 6. PUT /products/:id - Acción de modificación
    update: (req, res) => {
        const products = getProducts();
        const productId = req.params.id;
        const productIndex = products.findIndex(p => p.id == productId);

        if (productIndex !== -1) {
            const productToEdit = products[productIndex];

            products[productIndex] = {
                id: Number(productId),
                name: req.body.name || productToEdit.name,
                description: req.body.description || productToEdit.description,
                price: req.body.price ? Number(req.body.price) : productToEdit.price,
                category: req.body.category || productToEdit.category,
                // Si el usuario subió una nueva imagen, la guarda; si no, mantiene la anterior
                image: req.file ? req.file.filename : productToEdit.image
            };

            fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        }

        res.redirect('/');
    },

    // 7. DELETE /products/:id - Acción de borrado
    destroy: (req, res) => {
        const products = getProducts();
        const productId = req.params.id;

        const filteredProducts = products.filter(p => p.id != productId);

        fs.writeFileSync(productsFilePath, JSON.stringify(filteredProducts, null, 2));

        res.redirect('/products');
    }
};

module.exports = productsController;