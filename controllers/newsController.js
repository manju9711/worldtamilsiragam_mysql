
const News = require('../models/newsSchema.js');
const logger = require('../logger');
const { TAMIL_MESSAGE, ENGLISH_MESSAGE, STATUS_CODES, FILE_UPLOAD } = require("../util/constant.js");
const upload = require('../middleware/uploadToS3');

// Create a new item
const createItem = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error('Error uploading file', { error: err.message });
      return res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message: FILE_UPLOAD.UPLOAD_ERROR,
        status: "error"
      });
    }

    try {
      const { title_en, title_ta, description_en, description_ta, isDisabled } = req.body;
      const image = req.files?.image ? req.files.image[0].location : null;


      const newsItem = await News.create({ title_en, title_ta, description_en, description_ta, image, isDisabled });

      logger.info('Item created', { id: newsItem.id });
      res.status(STATUS_CODES.SUCCESS).json({
        code: STATUS_CODES.SUCCESS,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_SUCC : ENGLISH_MESSAGE.CREATE_SUCC,
        data: newsItem,
        status: "success"
      });
    } catch (error) {
      logger.error('Error creating item', { error: error.message });
      res.status(STATUS_CODES.SERVER_ERROR).json({
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
    const items = await News.findAll({
      attributes: ['id', 'title_en', 'title_ta', 'description_en', 'description_ta', 'image', 'isDisabled']
    });
    logger.info('Retrieved all CMS items');
    res.status(STATUS_CODES.SUCCESS).json({ code: STATUS_CODES.SUCCESS, message: ENGLISH_MESSAGE.GET_SUCC, data: items, status: 'success' });
  } catch (error) {
    logger.error('Error retrieving CMS items', { error: error.message });
    res.status(STATUS_CODES.SERVER_ERROR).json({ code: STATUS_CODES.SERVER_ERROR, message: ENGLISH_MESSAGE.GET_FAIL, status: 'error' });
  }
};

// Get all items with language support
const getAllItems = async (req, res) => {
  try {
    const langFields = req.query.lang === "TA" ? ['title_ta', 'description_ta'] : ['title_en', 'description_en'];
    const items = await News.findAll({ attributes: ['id', ...langFields, 'image', 'isDisabled'] });
    logger.info('Retrieved all items');
    res.status(STATUS_CODES.SUCCESS).json({ code: STATUS_CODES.SUCCESS, message: ENGLISH_MESSAGE.GET_SUCC, data: items, status: "success" });
  } catch (error) {
    logger.error('Error retrieving items', { error: error.message });
    res.status(STATUS_CODES.SERVER_ERROR).json({ code: STATUS_CODES.SERVER_ERROR, message: ENGLISH_MESSAGE.GET_FAIL, status: "error" });
  }
};

// Get item by ID
const getItemById = async (req, res) => {
  try {
    const langFields = req.query.lang === "TA" ? ['title_ta', 'description_ta'] : ['title_en', 'description_en'];
    const item = await News.findOne({ where: { id: req.params.id }, attributes: ['id', ...langFields, 'image', 'isDisabled'] });
    if (!item) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ code: STATUS_CODES.NOT_FOUND, message: ENGLISH_MESSAGE.GET_BY_ID_FAIL, status: "error" });
    }
    logger.info('Retrieved item by ID', { id: req.params.id });
    res.status(STATUS_CODES.SUCCESS).json({ code: STATUS_CODES.SUCCESS, message: ENGLISH_MESSAGE.GET_BY_ID_SUCC, data: item, status: "success" });
  } catch (error) {
    logger.error('Error retrieving item', { error: error.message });
    res.status(STATUS_CODES.SERVER_ERROR).json({ code: STATUS_CODES.SERVER_ERROR, message: ENGLISH_MESSAGE.GET_BY_ID_FAIL, status: "error" });
  }
};

// Update an item
const updateItem = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error('Error uploading file', { error: err.message });
      return res.status(STATUS_CODES.SERVER_ERROR).json({ code: STATUS_CODES.SERVER_ERROR, message: FILE_UPLOAD.UPLOAD_ERROR, status: "error" });
    }
    try {
      const { title_en, title_ta, description_en, description_ta, isDisabled } = req.body;
      const image = req.files?.image ? req.files.image[0].location : null;
      const updated = await News.update({ title_en, title_ta, description_en, description_ta, image, isDisabled }, { where: { id: req.params.id } });
      if (!updated[0]) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ code: STATUS_CODES.NOT_FOUND, message: ENGLISH_MESSAGE.UPDATE_FAIL, status: "error" });
      }
      logger.info('Updated item', { id: req.params.id });
      res.status(STATUS_CODES.SUCCESS).json({ code: STATUS_CODES.SUCCESS, message: ENGLISH_MESSAGE.UPDATE_SUCC, status: "success" });
    } catch (error) {
      logger.error('Error updating item', { error: error.message });
      res.status(STATUS_CODES.SERVER_ERROR).json({ code: STATUS_CODES.SERVER_ERROR, message: ENGLISH_MESSAGE.UPDATE_FAIL, status: "error" });
    }
  });
};

// Delete an item
const deleteItem = async (req, res) => {
  try {
    const deleted = await News.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ code: STATUS_CODES.NOT_FOUND, message: ENGLISH_MESSAGE.DELETE_FAIL, status: "error" });
    }
    logger.info('Deleted item', { id: req.params.id });
    res.status(STATUS_CODES.SUCCESS).json({ code: STATUS_CODES.SUCCESS, message: ENGLISH_MESSAGE.DELETE_SUCC, status: "success" });
  } catch (error) {
    logger.error('Error deleting item', { error: error.message });
    res.status(STATUS_CODES.SERVER_ERROR).json({ code: STATUS_CODES.SERVER_ERROR, message: ENGLISH_MESSAGE.DELETE_FAIL, status: "error" });
  }
};

module.exports = { createItem, getAllCmsItems, getAllItems, getItemById, updateItem, deleteItem };

