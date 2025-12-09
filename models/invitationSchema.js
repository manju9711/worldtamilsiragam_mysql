
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Invitation = sequelize.define('Invitation', {
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
  location_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location_ta: {  
    type: DataTypes.STRING,
    allowNull: false
  },
  sub_description_en: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sub_description_ta: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  file: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  isDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'invitations',
  timestamps: true 
});

module.exports = Invitation;


