
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Publish = sequelize.define('Publish', {
    title_en: { type: DataTypes.STRING, allowNull: true },
    title_ta: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    file: { type: DataTypes.STRING, allowNull: true },
    isDisabled: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: true, 
    tableName: 'publishs' 
});

module.exports = Publish;