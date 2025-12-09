
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a configured sequelize instance

const News = sequelize.define('News', {
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
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }},
  {
    tableName: 'news',
    timestamps: true
});

module.exports = News;

