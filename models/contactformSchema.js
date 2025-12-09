
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Contactform = sequelize.define('Contactform', {
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING,
    allowNull:true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'New'
  }
}, {
  timestamps: true,
  tableName: 'contactforms',
});

module.exports = Contactform;

