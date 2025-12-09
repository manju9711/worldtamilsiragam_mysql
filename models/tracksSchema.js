
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a configured Sequelize instance

const Tracks = sequelize.define('Tracks', {
  title_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title_ta: {
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
  },
  date_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_ta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gallery_images: {
    type: DataTypes.JSON, // JSON format to store an array of objects
    allowNull: false
  },
  isDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'tracks',
  timestamps: true
});

module.exports = Tracks;
