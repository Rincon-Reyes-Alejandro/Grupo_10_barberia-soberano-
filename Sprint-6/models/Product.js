module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(255),
            defaultValue: 'default-product.png'
        },
        category_id: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'products',
        timestamps: false
    });

    // Relaciones
    Product.associate = function(models) {
        // Un producto pertenece a una categoría
        Product.belongsTo(models.Category, { 
            as: 'category', 
            foreignKey: 'category_id' 
        });
        
        // Relación de N a M con Carritos (Para el reto completo)
        Product.belongsToMany(models.Cart, { 
            as: 'carts', 
            through: 'cart_products', // Nombre de la tabla intermedia
            foreignKey: 'product_id',
            otherKey: 'cart_id',
            timestamps: false
        });
    };

    return Product;
};