const InvitationModel = require('../models/invitationSchema.js');
const logger = require('../logger');
const { STATUS_CODES, FILE_UPLOAD, TAMIL_MESSAGE, ENGLISH_MESSAGE } = require('../util/constant.js');
const upload = require('../middleware/uploadToS3');

// Create Invitation
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
      const { title_en, title_ta, description_en, description_ta, location_en, location_ta, sub_description_en, sub_description_ta, isDisabled } = req.body;
      const image = req.files?.image ? req.files.image[0].location : null;
      const file = req.files?.file ? req.files.file[0].location : null;

      // Function to validate date
      const isValidDate = (date) => {
        return !isNaN(new Date(date).getTime());
      };

      // Validate and convert date_en
      const date_en = isValidDate(req.body.date_en) ? new Date(req.body.date_en).toISOString().split('T')[0] : null;

      // Validate and convert date_ta
      let date_ta = isValidDate(req.body.date_ta) ? new Date(req.body.date_ta).toISOString().split('T')[0] : null;
      
      // If date_ta is invalid, you can set a fallback value (e.g., current date or date_en)
      if (!date_ta) {
        date_ta = date_en || new Date().toISOString().split('T')[0];
      }

      const newInvitation = await InvitationModel.create({
        title_en,
        title_ta,
        description_en,
        description_ta,
        date_en,
        date_ta, 
        location_en,
        location_ta,
        sub_description_en,
        sub_description_ta,
        image,
        file,
        isDisabled
      });

      logger.info('Invitation created', { invitation: newInvitation });

      return res.status(STATUS_CODES.SUCCESS).send({
        code: STATUS_CODES.SUCCESS,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_SUCC : ENGLISH_MESSAGE.CREATE_SUCC,
        data: newInvitation,
        status: "success"
      });

    } catch (error) {
      logger.error('Error creating invitation', { error: error.message });
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
    const items = await InvitationModel.findAll({
      attributes: ['id', 'title_en', 'title_ta', 'description_en', 'description_ta', 'date_en', 'date_ta','location_en', 'location_ta', 'sub_description_en', 'sub_description_ta', 'image', 'file','isDisabled'],
      order: [
    ['date_en', 'DESC'],
    ['id', 'DESC']
  ]
    });
    logger.info('Retrieved all CMS items');
    res.status(STATUS_CODES.SUCCESS).json({ code: STATUS_CODES.SUCCESS, message: ENGLISH_MESSAGE.GET_SUCC, data: items, status: 'success' });
  } catch (error) {
    logger.error('Error retrieving CMS items', { error: error.message });
    res.status(STATUS_CODES.SERVER_ERROR).json({ code: STATUS_CODES.SERVER_ERROR, message: ENGLISH_MESSAGE.GET_FAIL, status: 'error' });
  }
};

// Get All Invitations
const getAllItems = async (req, res) => {
  try {
    const attributes = req.query.lang === "TA"
      ? ['id', 'title_ta', 'description_ta', 'date_ta',  'location_ta', 'sub_description_ta', 'image', 'file','isDisabled']
      : ['id', 'title_en', 'description_en', 'date_en',  'location_en', 'sub_description_en', 'image', 'file','isDisabled'];

    const invitations = await InvitationModel.findAll({ 
      attributes,
       order: [
    ['date_en', 'DESC'],
    ['id', 'DESC']
  ]
     });

    logger.info('Retrieved all invitations');
    return res.status(STATUS_CODES.SUCCESS).send({
      code: STATUS_CODES.SUCCESS,
      message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_SUCC : ENGLISH_MESSAGE.GET_SUCC,
      data: invitations,
      status: "success"
    });

  } catch (error) {
    logger.error('Error retrieving invitations', { error: error.message });
    return res.status(STATUS_CODES.SERVER_ERROR).send({
      code: STATUS_CODES.SERVER_ERROR,
      message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_FAIL : ENGLISH_MESSAGE.GET_FAIL,
      status: "error"
    });
  }
};

// Get Invitation by ID
const getItemById = async (req, res) => {
  try {
    const attributes = req.query.lang === "TA"
      ? ['id', 'title_ta', 'description_ta', 'date_ta', 'location_ta', 'sub_description_ta', 'image', 'file','isDisabled']
      : ['id', 'title_en', 'description_en', 'date_en', 'location_en', 'sub_description_en', 'image', 'file','isDisabled'];

    const invitation = await InvitationModel.findByPk(req.params.id, { attributes });

    if (!invitation) {
      return res.status(STATUS_CODES.NOT_FOUND).send({
        code: STATUS_CODES.NOT_FOUND,
        message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
        status: "error"
      });
    }

    return res.status(STATUS_CODES.SUCCESS).send({
      code: STATUS_CODES.SUCCESS,
      message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_SUCC : ENGLISH_MESSAGE.GET_BY_ID_SUCC,
      data: invitation,
      status: "success"
    });

  } catch (error) {
    logger.error('Error retrieving invitation', { error: error.message });
    return res.status(STATUS_CODES.SERVER_ERROR).send({
      code: STATUS_CODES.SERVER_ERROR,
      message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
      status: "error"
    });
  }
};

// Update Invitation
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
      const updateData = { ...req.body };

      if (req.files?.image) {
        updateData.image = req.files.image[0].location; // New image uploaded
      } else if (req.body.removeImage === "true") {
        updateData.image = null; // Remove image
      }

      const [updatedCount, updatedItems] = await InvitationModel.update(updateData, {
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
      logger.error("Error updating invitation", { error: error.message });
      return res.status(STATUS_CODES.SERVER_ERROR).send({
        code: STATUS_CODES.SERVER_ERROR,
        message: req.body.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL,
        status: "error",
      });
    }
  });
};

// Delete Invitation
const deleteItem = async (req, res) => {
  try {
    const deleted = await InvitationModel.destroy({ where: { id: req.params.id } });

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
    logger.error('Error deleting invitation', { error: error.message });
    return res.status(STATUS_CODES.SERVER_ERROR).send({
      code: STATUS_CODES.SERVER_ERROR,
      message: ENGLISH_MESSAGE.DELETE_FAIL,
      status: "error"
    });
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
