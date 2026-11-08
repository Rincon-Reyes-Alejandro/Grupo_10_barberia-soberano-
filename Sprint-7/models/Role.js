module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'roles',
        timestamps: false // Lo ponemos en false porque no creamos las columnas createdAt/updatedAt en el SQL
    });

    // Aquí definimos la relación (1 a Muchos)
    Role.associate = function(models) {
        Role.hasMany(models.User, { 
            as: 'users', 
            foreignKey: 'role_id' 
        });
    };

    return Role;
};