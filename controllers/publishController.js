  
const PublishModel = require('../models/publishSchema.js'); // Adjust the path to your Publish model
const logger = require('../logger');
const { TAMIL_MESSAGE, ENGLISH_MESSAGE, STATUS_CODES, FILE_UPLOAD } = require("../util/constant.js");
const upload = require('../middleware/upload');

// Create a new publish entry
const createPublish = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error('Error uploading file or image', { error: err.message });
      return res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message: FILE_UPLOAD.UPLOAD_ERROR,
        status: "error"
      });
    }

    try {
      const { title_en, title_ta, isDisabled } = req.body;
      const file = req.files?.file ? req.files.file[0].filename : null;
      const image = req.files?.image ? req.files.image[0].filename : null;

      const publishItem = await PublishModel.create({ title_en, title_ta, file, image, isDisabled });

      logger.info('Publish entry created', { id: publishItem.id });
      res.status(STATUS_CODES.SUCCESS).json({
        code: STATUS_CODES.SUCCESS,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_SUCC : ENGLISH_MESSAGE.CREATE_SUCC,
        data: publishItem,
        status: "success"
      });
    } catch (error) {
      logger.error('Error creating publish entry', { error: error.message });
      res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_FAIL : ENGLISH_MESSAGE.CREATE_FAIL,
        status: "error"
      });
    }
  });
};


// Retrieve all CMS publish entries
const getAllCmsPublishes = async (req, res) => {
  try {
    let selectedFields = 'title_en title_ta image file isDisabled id'; // Include image field
    const publishes = await PublishModel.findAll({}, selectedFields);
    logger.info('Retrieved all publish entries');

    res.status(STATUS_CODES.SUCCESS).send({
      code: STATUS_CODES.SUCCESS,
      message: ENGLISH_MESSAGE.GET_SUCC,
      data: publishes,
      status: "success"
    });
  } catch (error) {
    logger.error('Error retrieving publish entries', { error: error.message });

    res.status(STATUS_CODES.SERVER_ERROR).send({
      code: STATUS_CODES.SERVER_ERROR,
      message: ENGLISH_MESSAGE.GET_FAIL,
      status: "error"
    });
  }
};

// Retrieve all publish entries
const getAllPublishes = async (req, res) => {
  try {
    let selectedFields = 'title_en image file isDisabled _id'; // Include image field
    if (req.query.lang && req.query.lang === "TA") {
      selectedFields = 'title_ta image file isDisabled _id'; // Include image field for Tamil
    }
    const publishes = await PublishModel.findAll({}, selectedFields);
    logger.info('Retrieved all publish entries');

    if (req?.query?.lang === "TA") {
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: TAMIL_MESSAGE.GET_SUCC,
        data: publishes,
        status: "success"
      });
    } else {
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: ENGLISH_MESSAGE.GET_SUCC,
        data: publishes,
        status: "success"
      });
    }
  } catch (error) {
    logger.error('Error retrieving publish entries', { error: error.message });

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


// Retrieve a single publish entry by ID
const getPublishById = async (req, res) => {
  try {
    const selectedFields = req.query.lang === "TA" 
      ? ['title_ta', 'image', 'file', 'isDisabled', 'id'] 
      : ['title_en', 'image', 'file', 'isDisabled', 'id'];

    const publish = await PublishModel.findByPk(req.params.id, { attributes: selectedFields });

    if (!publish) {
      logger.warn('Publish entry not found', { id: req.params.id });
      return res.status(STATUS_CODES.NOT_FOUND).json({
        code: STATUS_CODES.NOT_FOUND,
        message: req.query.lang === "TA" 
          ? TAMIL_MESSAGE.GET_BY_ID_FAIL 
          : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
        status: 'error',
      });
    }

    logger.info('Retrieved publish entry by ID', { publish });
    res.status(STATUS_CODES.SUCCESS).json({
      code: STATUS_CODES.SUCCESS,
      message: req.query.lang === "TA" 
        ? TAMIL_MESSAGE.GET_BY_ID_SUCC 
        : ENGLISH_MESSAGE.GET_BY_ID_SUCC,
      data: publish,
      status: 'success',
    });
  } catch (error) {
    logger.error('Error retrieving publish entry', { error: error.message });
    res.status(STATUS_CODES.SERVER_ERROR).json({
      code: STATUS_CODES.SERVER_ERROR,
      message: req.query.lang === "TA" 
        ? TAMIL_MESSAGE.GET_BY_ID_FAIL 
        : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
      status: 'error',
    });
  }
};


// Update an existing publish entry
const updatePublish = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error('Error uploading file or image', { error: err.message });
      return res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: FILE_UPLOAD.UPLOAD_ERROR,
        status: "error"
      });
    }

    try {
      const updateData = { ...req.body };

      // Check if files are being uploaded and update the fields
      if (req.files?.file) {
        updateData.file = req.files.file[0].filename;
      }
      if (req.files?.image) {
        updateData.image = req.files.image[0].filename; // Add image field for update
      }

      // Perform the update operation
      const [updatedCount] = await PublishModel.update(updateData, {
        where: { id: req.params.id }, // Specify which record to update
        returning: true, // This returns the updated object
        plain: true      // This ensures you get a single record back instead of an array
      });

      if (updatedCount === 0) {
        // If no record was updated, return a not found response
        logger.warn('Publish entry not found for update', { id: req.params.id });
        return res.status(STATUS_CODES.NOT_FOUND).send({
          code: STATUS_CODES.NOT_FOUND,
          message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL,
          status: "error"
        });
      }

      // Fetch the updated record
      const updatedPublish = await PublishModel.findByPk(req.params.id);

      logger.info('Updated publish entry', { publish: updatedPublish });

      // Return success response with the updated record
      res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.UPDATE_SUCC : ENGLISH_MESSAGE.UPDATE_SUCC,
        data: updatedPublish,
        status: "success"
      });

    } catch (error) {
      logger.error('Error updating publish entry', { error: error.message });

      // Return error response if something goes wrong
      res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL,
        status: "error"
      });
    }
  });
};


// Delete a publish entry
const deletePublish = async (req, res) => {
  try {
    // Determine the fields to select based on language query parameter
    let selectedFields = ['title_en', 'image', 'file', 'isDisabled', 'id']; // Sequelize does not use _id, use the model's primary key 'id'
    if (req.query.lang && req.query.lang === "TA") {
      selectedFields = ['title_ta', 'image', 'file', 'isDisabled', 'id']; // Fields for Tamil
    }

    // Find the publish entry by id
    const dltpublish = await PublishModel.findByPk(req.params.id, {
      attributes: selectedFields, // Use attributes to specify fields in Sequelize
    });

    if (!dltpublish) {
      logger.warn('Publish entry not found for deletion', { id: req.params.id });
      return res.status(STATUS_CODES.NOT_FOUND).send({
        code: STATUS_CODES.NOT_FOUND,
        message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.DELETE_FAIL : ENGLISH_MESSAGE.DELETE_FAIL,
        status: "error"
      });
    }

    // Delete the publish entry
    await PublishModel.destroy({
      where: { id: req.params.id }, // Specify the condition for deletion
    });

    logger.info('Deleted publish entry', { dltpublish });

    res.status(STATUS_CODES.SUCCESS).send({
      code: STATUS_CODES.SUCCESS,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.DELETE_SUCC : ENGLISH_MESSAGE.DELETE_SUCC,
      data: dltpublish,
      status: "success"
    });
  } catch (error) {
    logger.error('Error deleting publish entry', { error: error.message });

    res.status(STATUS_CODES.SERVER_ERROR).send({
      code: STATUS_CODES.SERVER_ERROR,
      message: req?.query?.lang === "TA" ? TAMIL_MESSAGE.DELETE_FAIL : ENGLISH_MESSAGE.DELETE_FAIL,
      status: "error"
    });
  }
};


module.exports = {
  createPublish,
  getAllCmsPublishes,
  getAllPublishes,
  getPublishById,
  updatePublish,
  deletePublish
};

  
