const Role = require('../models/roleSchema');
const logger = require('../logger'); 
const { ENGLISH_MESSAGE, STATUS_CODES } = require('../util/constant');
const { Op } = require('sequelize'); 

// Create a new role
const createRole = async (req, res) => {
    try {
        const { role_name, role_code } = req.body;

        // Check if the role_code already exists
        const existingRole = await Role.findOne({ where: { role_code } });
        if (existingRole) {
            logger.warn(`Role creation failed: Role code ${role_code} already exists`);
            return res.status(STATUS_CODES.BAD_REQUEST).json({ error: ENGLISH_MESSAGE.CREATE_FAIL });
        }

        const data = new Role({ role_name, role_code });
        await data.save();
        logger.info(`Role created successfully: ${role_name} (${role_code})`);
        res.status(STATUS_CODES.SUCCESS).json({ message: ENGLISH_MESSAGE.CREATE_SUCC, data });
    } catch (error) {
        logger.error('Failed to create role', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: ENGLISH_MESSAGE.CREATE_FAIL });
    }
};

// Get all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        logger.info('Fetched all roles successfully');
        res.status(STATUS_CODES.SUCCESS).json({ message: ENGLISH_MESSAGE.GET_SUCC, roles });
    } catch (error) {
        logger.error('Failed to fetch roles', { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: ENGLISH_MESSAGE.GET_FAIL });
    }
};

// Get a single role by ID
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            logger.warn(`Role not found: ID ${req.params.id}`);
            return res.status(STATUS_CODES.NOT_FOUND).json({ error: ENGLISH_MESSAGE.GET_BY_ID_FAIL });
        }
        logger.info(`Fetched role successfully: ID ${req.params.id}`);
        res.status(STATUS_CODES.SUCCESS).json({ message: ENGLISH_MESSAGE.GET_BY_ID_SUCC, role });
    } catch (error) {
        logger.error(`Failed to fetch role: ID ${req.params.id}`, { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({ error: ENGLISH_MESSAGE.GET_BY_ID_FAIL });
    }
};

// Update a role by ID
const updateRoleById = async (req, res) => {
    try {
        const { role_name, role_code } = req.body;
        const roleId = req.params.id;

        // Check if the role_code already exists for another role
        const existingRole = await Role.findOne({ where: { role_code, id: { [Op.ne]: roleId } } });

        if (existingRole) {
            logger.warn(`Role update failed: Role code ${role_code} already exists`);
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                code: STATUS_CODES.BAD_REQUEST,
                message: ENGLISH_MESSAGE.UPDATE_FAIL,
                status: "error"
            });
        }

        // Update the role
        const [updatedRows] = await Role.update(
            { role_name, role_code }, 
            { where: { id: roleId } }
        );

        if (updatedRows === 0) {
            logger.warn(`Role not found for update: ID ${roleId}`);
            return res.status(STATUS_CODES.NOT_FOUND).json({
                code: STATUS_CODES.NOT_FOUND,
                message: ENGLISH_MESSAGE.UPDATE_FAIL,
                status: "error"
            });
        }

        // Fetch the updated role
        const updatedRole = await Role.findByPk(roleId);

        logger.info(`Role updated successfully: ID ${roleId}`);
        res.status(STATUS_CODES.SUCCESS).json({
            code: STATUS_CODES.SUCCESS,
            message: ENGLISH_MESSAGE.UPDATE_SUCC,
            data: updatedRole,
            status: "success"
        });

    } catch (error) {
        logger.error(`Failed to update role: ID ${req.params.id}`, { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({
            code: STATUS_CODES.SERVER_ERROR,
            message: ENGLISH_MESSAGE.UPDATE_FAIL,
            status: "error"
        });
    }
};


// Delete a role by ID
const deleteRoleById = async (req, res) => {
    try {
        const roleId = req.params.id;

        // Check if the role exists
        const role = await Role.findByPk(roleId);
        if (!role) {
            logger.warn(`Role not found for deletion: ID ${roleId}`);
            return res.status(STATUS_CODES.NOT_FOUND).json({
                code: STATUS_CODES.NOT_FOUND,
                message: ENGLISH_MESSAGE.DELETE_FAIL,
                status: "error"
            });
        }

        // Delete the role
        await Role.destroy({ where: { id: roleId } });

        logger.info(`Role deleted successfully: ID ${roleId}`);
        res.status(STATUS_CODES.SUCCESS).json({
            code: STATUS_CODES.SUCCESS,
            message: ENGLISH_MESSAGE.DELETE_SUCC,
            status: "success"
        });

    } catch (error) {
        logger.error(`Failed to delete role: ID ${req.params.id}`, { error: error.message });
        res.status(STATUS_CODES.SERVER_ERROR).json({
            code: STATUS_CODES.SERVER_ERROR,
            message: ENGLISH_MESSAGE.DELETE_FAIL,
            status: "error"
        });
    }
};


module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRoleById,
    deleteRoleById
};
