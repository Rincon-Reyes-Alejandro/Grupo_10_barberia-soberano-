module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'activo'
        },
        user_id: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'carts',
        timestamps: false
    });

    Cart.associate = function(models) {
        // Un carrito pertenece a un usuario
        Cart.belongsTo(models.User, { 
            as: 'user', 
            foreignKey: 'user_id' 
        });
        
        // Un carrito tiene muchos productos (N a M) a través de la tabla intermedia
        Cart.belongsToMany(models.Product, { 
            as: 'products', 
            through: 'cart_products',
            foreignKey: 'cart_id',
            otherKey: 'product_id',
            timestamps: false
        });
    };

    return Cart;
};