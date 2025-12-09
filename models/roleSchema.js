
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import Sequelize instance

// Define Role Model
const Role = sequelize.define('Role', {
    role_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    role_code: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        unique: true 
    }
}, {
    timestamps: true, 
    tableName: 'roles' 
});

// Export Models
module.exports = Role ;