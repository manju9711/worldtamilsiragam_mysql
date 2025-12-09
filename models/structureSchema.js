const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const { TeamTypeEnum } = require('../util/constant');

const Structure = sequelize.define('Structure', {
    title_en: { type: DataTypes.STRING, allowNull: true },
    title_ta: { type: DataTypes.STRING, allowNull: true },
    description_en: { type: DataTypes.STRING, allowNull: true },
    description_ta: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    team_type: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [Object.values(TeamTypeEnum)]
        }
    },
    contactNo_en: { type: DataTypes.STRING, allowNull: true },
    contactNo_ta: { type: DataTypes.STRING, allowNull: true },
    isDisabled: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: true, 
    tableName: 'structures' 
});

module.exports = Structure;
