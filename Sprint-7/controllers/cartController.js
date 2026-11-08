const db = require('../models');

const cartController = {
    // 1. Mostrar el carrito del usuario activo
    index: async (req, res) => {
        try {
            const userId = req.session.usuarioLogueado.id;
            
            const cart = await db.Cart.findOne({
                where: { user_id: userId, status: 'activo' },
                include: [{
                    model: db.Product,
                    as: 'products',
                    through: { attributes: ['quantity', 'price'] } 
                }]
            });

            let formattedCart = null;
            if (cart) {
                const plainCart = cart.get({ plain: true });

                formattedCart = {
                    id: plainCart.id,
                    total_price: plainCart.total_price,
                    products: plainCart.products.map(p => {
                        // Sequelize con through string mapea los datos intermedios en 'cart_products'
                        const cp = p.cart_products || p.CartProduct || {};
                        return {
                            id: p.id,
                            name: p.name,
                            image: p.image,
                            price: Number(cp.price !== undefined ? cp.price : p.price),
                            quantity: Number(cp.quantity !== undefined ? cp.quantity : 1)
                        };
                    })
                };
            }

            return res.render('cart/index', { cart: formattedCart, success: req.query.success });
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            return res.status(500).send("Error interno del servidor");
        }
    },

    // 2. Agregar un producto al carrito
    add: async (req, res) => {
        try {
            const userId = req.session.usuarioLogueado.id;
            const productId = req.body.productId;

            const product = await db.Product.findByPk(productId);
            if (!product) return res.status(404).send("Producto no encontrado");

            let cart = await db.Cart.findOne({
                where: { user_id: userId, status: 'activo' }
            });

            if (!cart) {
                cart = await db.Cart.create({ user_id: userId, total_price: 0, status: 'activo' });
            }

            const cartProduct = await db.CartProduct.findOne({
                where: { cart_id: cart.id, product_id: productId }
            });

            if (cartProduct) {
                await cartProduct.update({ quantity: cartProduct.quantity + 1 });
            } else {
                await db.CartProduct.create({
                    cart_id: cart.id,
                    product_id: productId,
                    quantity: 1,
                    price: product.price
                });
            }

            const allItems = await db.CartProduct.findAll({ where: { cart_id: cart.id } });
            let newTotal = allItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
            await cart.update({ total_price: newTotal });

            return res.redirect('/cart');
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            return res.status(500).send("Error al procesar la compra");
        }
    },

    // 3. Modificar cantidad (+ / - / eliminar)
    update: async (req, res) => {
        try {
            const { productId, action } = req.body;
            const userId = req.session.usuarioLogueado.id;

            const cart = await db.Cart.findOne({
                where: { user_id: userId, status: 'activo' }
            });

            if (!cart) return res.redirect('/cart');

            const cartProduct = await db.CartProduct.findOne({
                where: { cart_id: cart.id, product_id: productId }
            });

            if (cartProduct) {
                if (action === 'increase') {
                    await cartProduct.update({ quantity: cartProduct.quantity + 1 });
                } else if (action === 'decrease') {
                    if (cartProduct.quantity > 1) {
                        await cartProduct.update({ quantity: cartProduct.quantity - 1 });
                    } else {
                        await cartProduct.destroy();
                    }
                } else if (action === 'delete') {
                    await cartProduct.destroy();
                }

                const allItems = await db.CartProduct.findAll({ where: { cart_id: cart.id } });
                let newTotal = allItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
                await cart.update({ total_price: newTotal });
            }

            return res.redirect('/cart');
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
            return res.status(500).send("Error al actualizar el carrito");
        }
    },

    // 4. Proceder al pago (Checkout)
    checkout: async (req, res) => {
        try {
            const userId = req.session.usuarioLogueado.id;

            const cart = await db.Cart.findOne({
                where: { user_id: userId, status: 'activo' }
            });

            if (cart) {
                await cart.update({ status: 'completado' });
            }

            return res.redirect('/cart?success=true');
        } catch (error) {
            console.error("Error en checkout:", error);
            return res.status(500).send("Error al procesar el pago");
        }
    }
};

module.exports = cartController;