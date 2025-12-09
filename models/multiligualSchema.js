
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import database connection

const Multilingual = sequelize.define('Multilingual', {
  name_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name_ta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description_ta: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'multilingual', // Table name in the database
  timestamps: true // Enables createdAt and updatedAt fields
});

module.exports = Multilingual;
