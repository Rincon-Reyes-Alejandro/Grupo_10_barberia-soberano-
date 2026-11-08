module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        image: {
            type: DataTypes.STRING(255),
            defaultValue: 'default-user.png'
        },
        role_id: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'users',
        timestamps: false
    });

    // Relaciones
    User.associate = function(models) {
        // Un usuario pertenece a un rol
        User.belongsTo(models.Role, { 
            as: 'role', 
            foreignKey: 'role_id' 
        });
        
        // Un usuario tiene muchos carritos (Para el reto completo)
        User.hasMany(models.Cart, { 
            as: 'carts', 
            foreignKey: 'user_id' 
        });
    };

    return User;
};