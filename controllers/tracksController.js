const TracksModel = require('../models/tracksSchema');
const logger = require('../logger');
const { TAMIL_MESSAGE, ENGLISH_MESSAGE, STATUS_CODES, FILE_UPLOAD } = require("../util/constant");
const upload = require('../middleware/uploadToS3');

// Create a new track
const createTrack = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            logger.error('Error uploading files', { error: err.message });
            return res.status(STATUS_CODES.SERVER_ERROR).json({
                code: STATUS_CODES.SERVER_ERROR,
                message: FILE_UPLOAD.UPLOAD_ERROR,
                status: "error"
            });
        }

        try {
            // Convert date fields to strings (YYYY-MM-DD format)
            const date_en = req.body.date_en ? new Date(req.body.date_en).toISOString().split('T')[0] : null;
            const date_ta = req.body.date_ta ? new Date(req.body.date_ta).toISOString().split('T')[0] : null;

            const processFiles = (files) => {
                return files.map((file, index) => ({
                    id: `${file.fieldname}-${Date.now()}-${index}`,
                    fileName: file.originalname,
                    fileType: file.mimetype,
                    filePath: file.location,
                    fileSize: file.size
                }));
            };

            const newTrack = await TracksModel.create({
                ...req.body,
                date_en,  
                date_ta,  
                gallery_images: req.files['gallery_images'] ? processFiles(req.files['gallery_images']) : []
            });

            logger.info('Track created', { track: newTrack });

            const successMessage = req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_SUCC : ENGLISH_MESSAGE.CREATE_SUCC;
            res.status(STATUS_CODES.SUCCESS).json({
                code: STATUS_CODES.SUCCESS,
                message: successMessage,
                data: newTrack,
                status: "success"
            });

        } catch (error) {
            logger.error('Error creating track', { error: error.message });
            const failMessage = req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_FAIL : ENGLISH_MESSAGE.CREATE_FAIL;
            res.status(STATUS_CODES.SERVER_ERROR).json({
                code: STATUS_CODES.SERVER_ERROR,
                message: failMessage,
                status: "error"
            });
        }
    });
};

  

// Retrieve all CMS items (only select specific fields)
const getAllCmsTracks = async (req, res) => {
    try {
      const items = await TracksModel.findAll({
        attributes: ['id', 'title_en', 'title_ta', 'description_en', 'description_ta', 'date_en', 'date_ta', 'gallery_images', 'isDisabled'],
        order: [['date_en', 'DESC']], // Sorting by date_en in descending order
      });
  
      logger.info('Retrieved all CMS tracks');
  
      res.status(STATUS_CODES.SUCCESS).json({
        code: STATUS_CODES.SUCCESS,
        message: ENGLISH_MESSAGE.GET_SUCC,
        data: items,
        status: 'success'
      });
  
    } catch (error) {
      logger.error('Error retrieving CMS tracks', { error: error.message });
  
      res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message: ENGLISH_MESSAGE.GET_FAIL,
        status: 'error'
      });
    }
  };
  

// Retrieve all tracks
const getAllTracks = async (req, res) => {
    try {
      const langFields = req.query.lang === "TA"
        ? ['title_ta', 'description_ta', 'date_ta']
        : ['title_en', 'description_en', 'date_en'];
  
      const sortField = req.query.lang === "TA" ? ['date_ta', 'DESC'] : ['date_en', 'DESC'];
  
      const tracks = await TracksModel.findAll({
        attributes: ['id', ...langFields, 'gallery_images', 'isDisabled'],
        order: [sortField], // Sorting dynamically based on language selection
      });
  
      logger.info('Retrieved all tracks');
  
      const message = req.query.lang === "TA" ? TAMIL_MESSAGE.GET_SUCC : ENGLISH_MESSAGE.GET_SUCC;
      res.status(STATUS_CODES.SUCCESS).json({
        code: STATUS_CODES.SUCCESS,
        message,
        data: tracks,
        status: "success"
      });
  
    } catch (error) {
      logger.error('Error retrieving tracks', { error: error.message });
  
      const message = req.query.lang === "TA" ? TAMIL_MESSAGE.GET_FAIL : ENGLISH_MESSAGE.GET_FAIL;
      res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message,
        status: "error"
      });
    }
  };
  

// Retrieve a track by ID
const getTrackById = async (req, res) => {
    try {
      const langFields = req.query.lang === "TA" 
        ? ['title_ta', 'description_ta', 'date_ta'] 
        : ['title_en', 'description_en', 'date_en'];
  
      const track = await TracksModel.findOne({
        where: { id: req.params.id },
        attributes: ['id', ...langFields, 'gallery_images', 'isDisabled'],
      });
  
      if (!track) {
        logger.warn('Track not found', { id: req.params.id });
        const message = req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL;
        return res.status(STATUS_CODES.NOT_FOUND).json({
          code: STATUS_CODES.NOT_FOUND,
          message,
          status: "error"
        });
      }
  
      logger.info('Retrieved track by ID', { track });
      const message = req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_SUCC : ENGLISH_MESSAGE.GET_BY_ID_SUCC;
      res.status(STATUS_CODES.SUCCESS).json({
        code: STATUS_CODES.SUCCESS,
        message,
        data: track,
        status: "success"
      });
  
    } catch (error) {
      logger.error('Error retrieving track', { error: error.message });
      const message = req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL;
      res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message,
        status: "error"
      });
    }
  };
  

// Update an existing track
const updateTrack = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error('Error uploading files', { error: err.message });
      return res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message: FILE_UPLOAD.UPLOAD_ERROR,
        status: "error"
      });
    }

    try {
      const { title_en, title_ta, description_en, description_ta, date_en, date_ta, isDisabled, existingImages } = req.body;

      // Find the existing track
      const existingTrack = await TracksModel.findOne({ where: { id: req.params.id } });

      if (!existingTrack) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          code: STATUS_CODES.NOT_FOUND,
          message: "Track not found",
          status: "error"
        });
      }

      let updatedGalleryImages = existingTrack.gallery_images || [];

      // If existingImages is provided, filter out the removed images
      if (existingImages) {
        const existingImagesToKeep = JSON.parse(existingImages); // Convert string to array
        updatedGalleryImages = updatedGalleryImages.filter(img => existingImagesToKeep.includes(img.id));
      }

      // Process new gallery images if uploaded
      if (req.files['gallery_images']) {
        const processFiles = (files) => {
          return files.map((file, index) => ({
            id: `${file.fieldname}-${Date.now()}-${index}`,
            fileName: file.originalname,
            fileType: file.mimetype,
            filePath: file.location,
            fileSize: file.size
          }));
        };

        const newImages = processFiles(req.files['gallery_images']);
        updatedGalleryImages = [...updatedGalleryImages, ...newImages];
      }

      // Update track in MySQL
      const [updated] = await TracksModel.update(
        {
          title_en, title_ta, description_en, description_ta, date_en, date_ta,
          gallery_images: updatedGalleryImages,
          isDisabled
        },
        { where: { id: req.params.id } }
      );

      if (!updated) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          code: STATUS_CODES.NOT_FOUND,
          message: "Track not found",
          status: "error"
        });
      }

      logger.info('Track updated', { id: req.params.id });
      const successMessage = req.body.lang === "TA" ? TAMIL_MESSAGE.UPDATE_SUCC : ENGLISH_MESSAGE.UPDATE_SUCC;
      res.status(STATUS_CODES.SUCCESS).json({
        code: STATUS_CODES.SUCCESS,
        message: successMessage,
        status: "success"
      });

    } catch (error) {
      logger.error('Error updating track', { error: error.message });
      const failMessage = req.body.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL;
      res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message: failMessage,
        status: "error"
      });
    }
  });
};


// Delete a track
const deleteTrack = async (req, res) => {
    try {
      const lang = req.query.lang;
      const successMessage = lang === "TA" ? TAMIL_MESSAGE.DELETE_SUCC : ENGLISH_MESSAGE.DELETE_SUCC;
      const failMessage = lang === "TA" ? TAMIL_MESSAGE.DELETE_FAIL : ENGLISH_MESSAGE.DELETE_FAIL;
  
      const deleted = await TracksModel.destroy({ where: { id: req.params.id } });
  
      if (deleted === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
          code: STATUS_CODES.NOT_FOUND,
          message: failMessage,
          status: "error"
        });
      }
  
      logger.info(`Track with ID ${req.params.id} deleted successfully`);
      res.status(STATUS_CODES.SUCCESS).json({
        code: STATUS_CODES.SUCCESS,
        message: successMessage,
        status: "success"
      });
    } catch (error) {
      logger.error(`Error deleting track with ID ${req.params.id}: ${error.message}`);
      res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message: failMessage,
        status: "error"
      });
    }
  };
  
  const updateTrackStatus = async (req, res) => {
  try {
    const { isDisabled } = req.body;
    const { id } = req.params;

    const track = await TracksModel.findOne({ where: { id } });

    if (!track) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        code: STATUS_CODES.NOT_FOUND,
        message: "Track not found",
        status: "error"
      });
    }

    await TracksModel.update({ isDisabled }, { where: { id } });

    res.status(STATUS_CODES.SUCCESS).json({
      code: STATUS_CODES.SUCCESS,
      message: "Status updated successfully",
      status: "success"
    });
  } catch (error) {
    logger.error('Error updating status', { error: error.message });
    res.status(STATUS_CODES.SERVER_ERROR).json({
      code: STATUS_CODES.SERVER_ERROR,
      message: "Failed to update status",
      status: "error"
    });
  }
};


module.exports = {
    createTrack,
    getAllCmsTracks,
    getAllTracks,
    getTrackById,
    updateTrack,
    deleteTrack,
    updateTrackStatus
};
