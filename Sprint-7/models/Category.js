module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'categories',
        timestamps: false
    });

    // Relación (1 a Muchos)
    Category.associate = function(models) {
        Category.hasMany(models.Product, { 
            as: 'products', 
            foreignKey: 'category_id' 
        });
    };

    return Category;
};