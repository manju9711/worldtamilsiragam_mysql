
const StructureModel = require('../models/structureSchema.js');
const logger = require('../logger');
const { TAMIL_MESSAGE, ENGLISH_MESSAGE, STATUS_CODES, FILE_UPLOAD, TeamTypeEnum } = require("../util/constant.js");
const upload = require('../middleware/upload');

// Create a new item
const createItem = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error('Error uploading file', { error: err.message });
      return res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: FILE_UPLOAD.UPLOAD_ERROR,
        status: "error"
      });
    }

    try {
      const { team_type } = req.body;

      // Validate `team_type`
      if (!team_type || !Object.values(TeamTypeEnum).includes(team_type)) {
        return res.status(STATUS_CODES.BAD_REQUEST).send({
          code: STATUS_CODES.BAD_REQUEST,
          message: 'Invalid or missing team_type',
          status: "error"
        });
      }

      const image = req.files?.image ? req.files.image[0].filename : null // Handle image upload

      const newItem = await StructureModel.create({
        ...req.body,
        image,
      });

      logger.info('Item created', { item: newItem });

      return res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_SUCC : ENGLISH_MESSAGE.CREATE_SUCC,
        data: newItem,
        status: "success"
      });

    } catch (error) {
      logger.error('Error creating item', { error: error.message });
      return res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_FAIL : ENGLISH_MESSAGE.CREATE_FAIL,
        status: "error"
      });
    }
  });
};

// Get all CMS items
const getAllCmsItems = async (req, res) => {
  try {
    const items = await StructureModel.findAll({
      attributes: ['id', 'title_en', 'title_ta', 'description_en', 'description_ta', 'image', 'isDisabled', 'team_type', 'contactNo_en', 'contactNo_ta']
    });
    logger.info('Retrieved all CMS items');
    res.status(STATUS_CODES.SUCCESS).json({ code: STATUS_CODES.SUCCESS, message: ENGLISH_MESSAGE.GET_SUCC, data: items, status: 'success' });
  } catch (error) {
    logger.error('Error retrieving CMS items', { error: error.message });
    res.status(STATUS_CODES.SERVER_ERROR).json({ code: STATUS_CODES.SERVER_ERROR, message: ENGLISH_MESSAGE.GET_FAIL, status: 'error' });
  }
};

// Retrieve all items
const getAllItems = async (req, res) => {
  try {
    const attributes = req.query.lang === "TA"
      ? ['title_ta', 'description_ta', 'image', 'isDisabled', 'team_type', 'contactNo_ta', 'id']
      : ['title_en', 'description_en', 'image', 'isDisabled', 'team_type', 'contactNo_en', 'id'];

    const items = await StructureModel.findAll({ attributes });

    logger.info('Retrieved all items');
    return res.status(STATUS_CODES.SUCCESS).send({
      code: STATUS_CODES.SUCCESS,
      message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_SUCC : ENGLISH_MESSAGE.GET_SUCC,
      data: items,
      status: "success"
    });

  } catch (error) {
    logger.error('Error retrieving items', { error: error.message });
    return res.status(STATUS_CODES.SERVER_ERROR).send({
      code: STATUS_CODES.SERVER_ERROR,
      message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_FAIL : ENGLISH_MESSAGE.GET_FAIL,
      status: "error"
    });
  }
};

// Retrieve an item by ID
const getItemById = async (req, res) => {
  try {
    const attributes = req.query.lang === "TA"
      ? ['title_ta', 'description_ta', 'image', 'isDisabled', 'team_type', 'contactNo_ta', 'id']
      : ['title_en', 'description_en', 'image', 'isDisabled', 'team_type', 'contactNo_en', 'id'];

    const item = await StructureModel.findByPk(req.params.id, { attributes });

    if (!item) {
      return res.status(STATUS_CODES.NOT_FOUND).send({
        code: STATUS_CODES.NOT_FOUND,
        message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
        status: "error"
      });
    }

    return res.status(STATUS_CODES.SUCCESS).send({
      code: STATUS_CODES.SUCCESS,
      message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_SUCC : ENGLISH_MESSAGE.GET_BY_ID_SUCC,
      data: item,
      status: "success"
    });

  } catch (error) {
    logger.error('Error retrieving item', { error: error.message });
    return res.status(STATUS_CODES.SERVER_ERROR).send({
      code: STATUS_CODES.SERVER_ERROR,
      message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
      status: "error"
    });
  }
};

// Update an existing item
const updateItem = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error("Error uploading file", { error: err.message });
      return res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: FILE_UPLOAD.UPLOAD_ERROR,
        status: "error",
      });
    }

    try {
      const { team_type } = req.body;

      // Validate `team_type`
      if (team_type && !Object.values(TeamTypeEnum).includes(team_type)) {
        return res.status(STATUS_CODES.BAD_REQUEST).send({
          code: STATUS_CODES.BAD_REQUEST,
          message: "Invalid team_type value",
          status: "error",
        });
      }

      // Create an update object
      const updateData = { ...req.body };

      // Handle image update
      if (req.files?.image) {
        updateData.image = req.files.image[0].filename; // New image uploaded
      } else if (req.body.removeImage === "true") {
        updateData.image = null; // Remove image explicitly
      }

      // Update record
      const [updatedCount, updatedItems] = await StructureModel.update(updateData, {
        where: { id: req.params.id },
        returning: true,
      });

      if (updatedCount === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).send({
          code: STATUS_CODES.NOT_FOUND,
          message: req.body.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL,
          status: "error",
        });
      }

      return res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.UPDATE_SUCC : ENGLISH_MESSAGE.UPDATE_SUCC,
        data: updatedItems[0],
        status: "success",
      });
    } catch (error) {
      logger.error("Error updating item", { error: error.message });
      return res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL,
        status: "error",
      });
    }
  });
};


// Delete an item
const deleteItem = async (req, res) => {
  try {
    const deleted = await StructureModel.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(STATUS_CODES.NOT_FOUND).send({
        code: STATUS_CODES.NOT_FOUND,
        message: ENGLISH_MESSAGE.DELETE_FAIL,
        status: "error"
      });
    }

    return res.status(STATUS_CODES.SUCCESS).send({
      code: STATUS_CODES.SUCCESS,
      message: ENGLISH_MESSAGE.DELETE_SUCC,
      status: "success"
    });

  } catch (error) {
    logger.error('Error deleting item', { error: error.message });
    return res.status(STATUS_CODES.SERVER_ERROR).send({
      code: STATUS_CODES.SERVER_ERROR,
      message: ENGLISH_MESSAGE.DELETE_FAIL,
      status: "error"
    });
  }
};

module.exports = { createItem, getAllCmsItems, getAllItems, getItemById, updateItem, deleteItem };
