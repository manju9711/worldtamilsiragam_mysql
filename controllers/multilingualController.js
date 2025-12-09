
const MultilingualModel = require('../models/multiligualSchema.js');
const logger = require('../logger');
const { TAMIL_MESSAGE, ENGLISH_MESSAGE, STATUS_CODES } = require("../util/constant.js");

// Create a new item
const createItem = async (req, res) => {
  try {
    const newItem = await MultilingualModel.create(req.body);
    logger.info('Item created', { item: newItem });

    res.status(STATUS_CODES.SUCCESS).json({
      code: STATUS_CODES.SUCCESS,
      message: req?.body?.lang === "TA" ? TAMIL_MESSAGE.CREATE_SUCC : ENGLISH_MESSAGE.CREATE_SUCC,
      data: newItem,
      status: "success"
    });
  } catch (error) {
    logger.error('Error creating item', { error: error.message });

    res.status(STATUS_CODES.SERVER_ERROR).json({
      code: STATUS_CODES.SERVER_ERROR,
      message: req?.body?.lang === "TA" ? TAMIL_MESSAGE.CREATE_FAIL : ENGLISH_MESSAGE.CREATE_FAIL,
      status: "error"
    });
  }
};


// Retrieve all items
const getAllItems = async (req, res) => {
  try {
    const langFields = req.query.lang === "TA" ? ['name_ta', 'description_ta'] : ['name_en', 'description_en'];
    const items = await MultilingualModel.findAll({
      attributes: ['id', ...langFields]
    });

    logger.info('Retrieved all items');

    res.status(STATUS_CODES.SUCCESS).json({
      code: STATUS_CODES.SUCCESS,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.GET_SUCC : ENGLISH_MESSAGE.GET_SUCC,
      data: items,
      status: "success"
    });
  } catch (error) {
    logger.error('Error retrieving items', { error: error.message });

    res.status(STATUS_CODES.SERVER_ERROR).json({
      code: STATUS_CODES.SERVER_ERROR,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.GET_FAIL : ENGLISH_MESSAGE.GET_FAIL,
      status: "error"
    });
  }
};


// Retrieve an item by ID
const getItemById = async (req, res) => {
  try {
    const langFields = req.query.lang === "TA" ? ['name_ta', 'description_ta'] : ['name_en', 'description_en'];
    const item = await MultilingualModel.findOne({
      where: { id: req.params.id },
      attributes: ['id', ...langFields]
    });

    if (!item) {
      logger.warn('Item not found', { id: req.params.id });

      return res.status(STATUS_CODES.NOT_FOUND).json({
        code: STATUS_CODES.NOT_FOUND,
        message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
        status: "error"
      });
    }

    logger.info('Retrieved item by ID', { item });

    res.status(STATUS_CODES.SUCCESS).json({
      code: STATUS_CODES.SUCCESS,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_SUCC : ENGLISH_MESSAGE.GET_BY_ID_SUCC,
      data: item,
      status: "success"
    });

  } catch (error) {
    logger.error('Error retrieving item', { error: error.message });

    res.status(STATUS_CODES.SERVER_ERROR).json({
      code: STATUS_CODES.SERVER_ERROR,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
      status: "error"
    });
  }
};


// Update an existing item
const updateItem = async (req, res) => {
  try {
    const [updated] = await MultilingualModel.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) {
      logger.warn('Item not found for update', { id: req.params.id });

      return res.status(STATUS_CODES.NOT_FOUND).json({
        code: STATUS_CODES.NOT_FOUND,
        message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL,
        status: "error"
      });
    }

    const langFields = req.query.lang === "TA" ? ['name_ta', 'description_ta'] : ['name_en', 'description_en'];
    const updatedItem = await MultilingualModel.findOne({
      where: { id: req.params.id },
      attributes: ['id', ...langFields]
    });

    logger.info('Updated item', { item: updatedItem });

    res.status(STATUS_CODES.SUCCESS).json({
      code: STATUS_CODES.SUCCESS,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.UPDATE_SUCC : ENGLISH_MESSAGE.UPDATE_SUCC,
      data: updatedItem,
      status: "success"
    });

  } catch (error) {
    logger.error('Error updating item', { error: error.message });

    res.status(STATUS_CODES.SERVER_ERROR).json({
      code: STATUS_CODES.SERVER_ERROR,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL,
      status: "error"
    });
  }
};


// Delete an item
const deleteItem = async (req, res) => {
  try {
    const langFields = req.query.lang === "TA" ? ['name_ta', 'description_ta'] : ['name_en', 'description_en'];
    
    const item = await MultilingualModel.findOne({
      where: { id: req.params.id },
      attributes: ['id', ...langFields]
    });

    if (!item) {
      logger.warn('Item not found for deletion', { id: req.params.id });

      return res.status(STATUS_CODES.NOT_FOUND).json({
        code: STATUS_CODES.NOT_FOUND,
        message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.DELETE_FAIL : ENGLISH_MESSAGE.DELETE_FAIL,
        status: "error"
      });
    }

    await MultilingualModel.destroy({ where: { id: req.params.id } });
    logger.info('Deleted item', { item });

    res.status(STATUS_CODES.SUCCESS).json({
      code: STATUS_CODES.SUCCESS,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.DELETE_SUCC : ENGLISH_MESSAGE.DELETE_SUCC,
      data: item,
      status: "success"
    });

  } catch (error) {
    logger.error('Error deleting item', { error: error.message });

    res.status(STATUS_CODES.SERVER_ERROR).json({
      code: STATUS_CODES.SERVER_ERROR,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.DELETE_FAIL : ENGLISH_MESSAGE.DELETE_FAIL,
      status: "error"
    });
  }
};


module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
};
