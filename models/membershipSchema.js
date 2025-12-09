
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); 
const { GenderEnum, MemberTypeEnum } = require("../util/constant");

const Membership = sequelize.define("Membership", {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM,
        values: Object.values(GenderEnum), // Use predefined values
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensure email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //     len: [6, 100], // Min 6 characters
        // },
    },
    // confirmPassword: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     validate: {
    //         len: [6, 100],
    //     },
    // },
    membershipType: {
        type: DataTypes.ENUM,
        values: Object.values(MemberTypeEnum),
        allowNull: false,
    },
    additionalInfo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isDisabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetTokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true, // CreatedAt & UpdatedAt
    tableName: "memberships",
});

// Sync model with the database (uncomment only during development)
// sequelize.sync({ force: false }).then(() => console.log("Membership table created."));

module.exports = Membership;


