const VisionModel = require('../models/visionSchema.js');
const logger = require('../logger');
const { TAMIL_MESSAGE, ENGLISH_MESSAGE, STATUS_CODES, FILE_UPLOAD } = require("../util/constant.js");
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
      const newItem = new VisionModel({
        ...req.body,
        image: req.files.image ? req.files.image[0].filename : undefined
      });
      await newItem.save();
      logger.info('Item created', { item: newItem });

      if (req?.body?.lang === "TA") {
        res.status(STATUS_CODES.SUCCESS).send({
          code: STATUS_CODES.SUCCESS,
          message: TAMIL_MESSAGE.CREATE_SUCC,
          data: newItem,
          status: "success"
        });
      } else {
        res.status(STATUS_CODES.SUCCESS).send({
          code: STATUS_CODES.SUCCESS,
          message: ENGLISH_MESSAGE.CREATE_SUCC,
          data: newItem,
          status: "success"
        });
      }
    } catch (error) {
      logger.error('Error creating item', { error: error.message });

      if (req?.body?.lang === "TA") {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          code: STATUS_CODES.SERVER_ERROR,
          message: TAMIL_MESSAGE.CREATE_FAIL,
          status: "error"
        });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          code: STATUS_CODES.SERVER_ERROR,
          message: ENGLISH_MESSAGE.CREATE_FAIL,
          status: "error"
        });
      }
    }
  });
};

// Retrieve all CMS items (only select specific fields)
const getAllCmsItems = async (req, res) => {
  try {
      const selectedValue = 'title_en title_ta description_en description_ta  imageTitle_en  imageTitle_ta image isDisabled _id'; 

      const items = await VisionModel.find({}, selectedValue);
      logger.info('Retrieved all CMS items');

      res.status(STATUS_CODES.SUCCESS).send({
          code: STATUS_CODES.SUCCESS,
          message: ENGLISH_MESSAGE.GET_SUCC,
          data: items,
          status: "success"
      });

  } catch (error) {
      logger.error('Error retrieving CMS items', { error: error.message });

      res.status(STATUS_CODES.SERVER_ERROR).send({
          code: STATUS_CODES.SERVER_ERROR,
          message: ENGLISH_MESSAGE.GET_FAIL,
          status: "error"
      });
  }
};

// Retrieve all items
const getAllItems = async (req, res) => {
  try {
    let selectedValue = 'title_en description_en imageTitle_en image isDisabled _id';
    if (req.query.lang && req.query.lang === "TA") {
      selectedValue = 'title_ta description_ta imageTitle_ta image isDisabled _id';
    }
    const items = await VisionModel.find({}, selectedValue);
    logger.info('Retrieved all items');

    if (req?.query?.lang === "TA") {
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: TAMIL_MESSAGE.GET_SUCC,
        data: items,
        status: "success"
      });
    } else {
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: ENGLISH_MESSAGE.GET_SUCC,
        data: items,
        status: "success"
      });
    }

  } catch (error) {
    logger.error('Error retrieving items', { error: error.message });

    if (req?.query?.lang === "TA") {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: TAMIL_MESSAGE.GET_FAIL,
        status: "error"
      });
    } else {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: ENGLISH_MESSAGE.GET_FAIL,
        status: "error"
      });
    }
  }
};

// Retrieve an item by ID
const getItemById = async (req, res) => {
  try {
    let selectedValue = 'title_en description_en imageTitle_en image isDisabled _id';
    if (req.query.lang && req.query.lang === "TA") {
      selectedValue = 'title_ta description_ta imageTitle_ta image isDisabled _id';
    }

    const item = await VisionModel.findById(req.params.id, selectedValue);
    if (!item) {
      logger.warn('Item not found', { id: req.params.id });

      if (req?.query?.lang === "TA") {
        res.status(STATUS_CODES.NOT_FOUND).send({
          code: STATUS_CODES.NOT_FOUND,
          message: TAMIL_MESSAGE.GET_BY_ID_FAIL,
          status: "error"
        });
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({
          code: STATUS_CODES.NOT_FOUND,
          message: ENGLISH_MESSAGE.GET_BY_ID_FAIL,
          status: "error"
        });
      }
    }

    logger.info('Retrieved item by ID', { item });

    if (req?.query?.lang === "TA") {
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: TAMIL_MESSAGE.GET_BY_ID_SUCC,
        data: item,
        status: "success"
      });
    } else {
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: ENGLISH_MESSAGE.GET_BY_ID_SUCC,
        data: item,
        status: "success"
      });
    }

  } catch (error) {
    logger.error('Error retrieving item', { error: error.message });

    if (req?.query?.lang === "TA") {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: TAMIL_MESSAGE.GET_BY_ID_FAIL,
        status: "error"
      });
    } else {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: ENGLISH_MESSAGE.GET_BY_ID_FAIL,
        status: "error"
      });
    }
  }
};

// Update an existing item
const updateItem = async (req, res) => {
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
      const updateData = { ...req.body };
      if (req.files?.image) {
        updateData.image = req.files.image[0].filename; // Update filename if a new image is uploaded
      }

      const item = await VisionModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!item) {
        logger.warn('Item not found for update', { id: req.params.id });

        if (req?.query?.lang === "TA") {
          res.status(STATUS_CODES.NOT_FOUND).send({
            code: STATUS_CODES.NOT_FOUND,
            message: TAMIL_MESSAGE.UPDATE_FAIL,
            status: "error"
          });
        } else {
          res.status(STATUS_CODES.NOT_FOUND).send({
            code: STATUS_CODES.NOT_FOUND,
            message: ENGLISH_MESSAGE.UPDATE_FAIL,
            status: "error"
          });
        }
        return;
      }

      let selectedValue = 'title_en description_en imageTitle_en image isDisabled _id';
      if (req.query.lang && req.query.lang === "TA") {
        selectedValue = 'title_ta description_ta imageTitle_ta image isDisabled _id';
      }
      const updatedItem = await VisionModel.findById(req.params.id, selectedValue);

      logger.info('Updated item', { item: updatedItem });

      if (req?.query?.lang === "TA") {
        res.status(STATUS_CODES.SUCCESS).send({
          code: STATUS_CODES.SUCCESS,
          message: TAMIL_MESSAGE.UPDATE_SUCC,
          data: updatedItem,
          status: "success"
        });
      } else {
        res.status(STATUS_CODES.SUCCESS).send({
          code: STATUS_CODES.SUCCESS,
          message: ENGLISH_MESSAGE.UPDATE_SUCC,
          data: updatedItem,
          status: "success"
        });
      }
    } catch (error) {
      logger.error('Error updating item', { error: error.message });

      if (req?.query?.lang === "TA") {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          code: STATUS_CODES.SERVER_ERROR,
          message: TAMIL_MESSAGE.UPDATE_FAIL,
          status: "error"
        });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({
          code: STATUS_CODES.SERVER_ERROR,
          message: ENGLISH_MESSAGE.UPDATE_FAIL,
          status: "error"
        });
      }
    }
  });
};

// Delete an item
const deleteItem = async (req, res) => {
  try {
    let selectedFields = 'title_en description_en imageTitle_en image isDisabled _id';
    if (req.query.lang && req.query.lang === "TA") {
      selectedFields = 'title_ta description_ta imageTitle_ta image isDisabled _id';
    }

    const dltitem = await VisionModel.findById(req.params.id).select(selectedFields);
    if (!dltitem) {
      logger.warn('Item not found for deletion', { id: req.params.id });

      if (req?.query?.lang === "TA") {
        res.status(STATUS_CODES.NOT_FOUND).send({
          code: STATUS_CODES.NOT_FOUND,
          message: TAMIL_MESSAGE.DELETE_FAIL,
          status: "error"
        });

      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({
          code: STATUS_CODES.NOT_FOUND,
          message: ENGLISH_MESSAGE.DELETE_FAIL,
          status: "error"
        });
      }
    }

    await VisionModel.findByIdAndDelete(req.params.id);
    logger.info('Deleted item', { dltitem });

    if (req?.query?.lang === "TA") {
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: TAMIL_MESSAGE.DELETE_SUCC,
        data: dltitem,
        status: "success"
      });

    } else {
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: ENGLISH_MESSAGE.DELETE_SUCC,
        data: dltitem,
        status: "success"
      });
    }
  } catch (error) {
    logger.error('Error deleting item', { error: error.message });

    if (req?.query?.lang === "TA") {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: TAMIL_MESSAGE.DELETE_FAIL,
        status: "error"
      });

    } else {
      res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: ENGLISH_MESSAGE.DELETE_FAIL,
        status: "error"
      });
    }
  }
};

module.exports = {
  createItem,
  getAllCmsItems,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
};
