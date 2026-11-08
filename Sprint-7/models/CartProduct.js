module.exports = (sequelize, DataTypes) => {
    const CartProduct = sequelize.define('CartProduct', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        cart_id: {
            type: DataTypes.INTEGER
        },
        product_id: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'cart_products',
        timestamps: false
    });

    CartProduct.associate = function(models) {
        // Relaciones directas con las tablas principales por si necesitas hacer consultas específicas al detalle
        CartProduct.belongsTo(models.Cart, { 
            as: 'cart',
            foreignKey: 'cart_id' 
        });
        CartProduct.belongsTo(models.Product, { 
            as: 'product',
            foreignKey: 'product_id' 
        });
    };

    return CartProduct;
};