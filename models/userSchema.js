
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./roleSchema'); // Import Role model

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    mobile: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Role, key: 'id' }
    }
}, {
    tableName: 'users',
    timestamps: true
});

// Define the relationship
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' }); 
Role.hasMany(User, { foreignKey: 'role_id' }); // A Role can have many Users

module.exports = User;


