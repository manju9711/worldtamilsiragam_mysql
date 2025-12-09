
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Festival = sequelize.define('Festival', {
    title_en: { type: DataTypes.STRING, allowNull: true },
    title_ta: { type: DataTypes.STRING, allowNull: true  },
    description_en: { type: DataTypes.TEXT, allowNull: true },
    description_ta: { type: DataTypes.TEXT, allowNull: true },
    date_en: { type: DataTypes.DATE, allowNull: true },
    date_ta: { type: DataTypes.DATE, allowNull: true },
    image: { type: DataTypes.JSON, allowNull: true },
    gallery_images: { type: DataTypes.JSON, allowNull: true },
    video: { type: DataTypes.JSON, allowNull: true },
    isDisabled: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: true,
    tableName: 'festivals',
});

module.exports = Festival;
