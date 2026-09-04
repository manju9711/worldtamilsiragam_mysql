const FestivalModel = require('../models/festivalSchema.js');
const logger = require('../logger');
const { TAMIL_MESSAGE, ENGLISH_MESSAGE, STATUS_CODES, FILE_UPLOAD } = require("../util/constant.js");
const upload = require('../middleware/uploadToS3');

// Create a new item
const createItem = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        logger.error('Error uploading files', { error: err.message });
        return res.status(STATUS_CODES.SERVER_ERROR).send({
          code: STATUS_CODES.SERVER_ERROR,
          message: FILE_UPLOAD.UPLOAD_ERROR,
          status: "error"
        });
      }
  
      try {
        const { 
          title_en, title_ta, description_en, description_ta, isDisabled 
        } = req.body;
  
        // Validate and convert date fields
        const parseDate = (dateStr) => {
          if (!dateStr) return null; // If date is empty, return null
          const date = new Date(dateStr);
          return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]; // Check if the date is valid
        };
  
        const date_en = parseDate(req.body.date_en);
        const date_ta = parseDate(req.body.date_ta);
  
        // Extract file names from uploaded files
        const image = req.files?.image ? req.files.image[0].location : null;
        const gallery_images = req.files?.gallery_images ? req.files.gallery_images.map(file => file.location) : [];
        const video = req.files?.video ? req.files.video.map(file => file.location) : [];
  
        const newFestival = await FestivalModel.create({
          title_en, title_ta, description_en, description_ta,
          date_en, date_ta, image, gallery_images, video, isDisabled
        });
  
        logger.info('Festival created', { festival: newFestival });
  
        return res.status(STATUS_CODES.SUCCESS).send({
          code: STATUS_CODES.SUCCESS,
          message: req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_SUCC : ENGLISH_MESSAGE.CREATE_SUCC,
          data: newFestival,
          status: "success"
        });
  
      } catch (error) {
        logger.error('Error creating festival', { error: error.message });
        return res.status(STATUS_CODES.SERVER_ERROR).send({
          code: STATUS_CODES.SERVER_ERROR,
          message: req.body.lang === "TA" ? TAMIL_MESSAGE.CREATE_FAIL : ENGLISH_MESSAGE.CREATE_FAIL,
          status: "error"
        });
      }
    });
  };
  

// Retrieve all CMS items (only select specific fields)
const getAllCmsItems = async (req, res) => {
    try {
      const items = await FestivalModel.findAll({
        attributes: [
          'id', 'title_en', 'title_ta', 'description_en', 'description_ta',
          'date_en', 'date_ta', 'image', 'video', 'gallery_images', 'isDisabled'
        ],
        order: [['date_en', 'DESC']] // Sorting by `date_en` in descending order
      });
  
      logger.info('Retrieved all CMS items');
  
      res.status(STATUS_CODES.SUCCESS).json({
        code: STATUS_CODES.SUCCESS,
        message: ENGLISH_MESSAGE.GET_SUCC,
        data: items,
        status: "success"
      });
  
    } catch (error) {
      logger.error('Error retrieving CMS items', { error: error.message });
  
      res.status(STATUS_CODES.SERVER_ERROR).json({
        code: STATUS_CODES.SERVER_ERROR,
        message: ENGLISH_MESSAGE.GET_FAIL,
        status: "error"
      });
    }
  };
  

// Retrieve all items (based on language preference)
const getAllItems = async (req, res) => {
    try {
        let selectedAttributes;
        let orderField;

        if (req.query.lang === "TA") {
            selectedAttributes = ['id', 'title_ta', 'description_ta', 'date_ta', 'image', 'video', 'gallery_images', 'isDisabled'];
            orderField = [['date_ta', 'DESC']];
        } else {
            selectedAttributes = ['id', 'title_en', 'description_en', 'date_en', 'image', 'video', 'gallery_images', 'isDisabled'];
            orderField = [['date_en', 'DESC']];
        }

        const items = await FestivalModel.findAll({
            attributes: selectedAttributes,
            order: orderField
        });

        logger.info('Retrieved all Festival items');

        res.status(STATUS_CODES.SUCCESS).json({
            code: STATUS_CODES.SUCCESS,
            message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_SUCC : ENGLISH_MESSAGE.GET_SUCC,
            data: items,
            status: "success"
        });

    } catch (error) {
        logger.error('Error retrieving Festival items', { error: error.message });

        res.status(STATUS_CODES.SERVER_ERROR).json({
            code: STATUS_CODES.SERVER_ERROR,
            message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_FAIL : ENGLISH_MESSAGE.GET_FAIL,
            status: "error"
        });
    }
};


// Retrieve an item by ID (based on language preference)
const getItemById = async (req, res) => {
    try {
        let selectedAttributes;

        if (req.query.lang === "TA") {
            selectedAttributes = ['id', 'title_ta', 'description_ta', 'date_ta', 'image', 'video', 'gallery_images', 'isDisabled'];
        } else {
            selectedAttributes = ['id', 'title_en', 'description_en', 'date_en', 'image', 'video', 'gallery_images', 'isDisabled'];
        }

        const item = await FestivalModel.findOne({
            where: { id: req.params.id },
            attributes: selectedAttributes
        });

        if (!item) {
            logger.warn('Item not found', { id: req.params.id });

            return res.status(STATUS_CODES.NOT_FOUND).json({
                code: STATUS_CODES.NOT_FOUND,
                message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_FAIL : ENGLISH_MESSAGE.GET_BY_ID_FAIL,
                status: "error"
            });
        }

        logger.info('Retrieved item by ID', { item });

        res.status(STATUS_CODES.SUCCESS).json({
            code: STATUS_CODES.SUCCESS,
            message: req.query.lang === "TA" ? TAMIL_MESSAGE.GET_BY_ID_SUCC : ENGLISH_MESSAGE.GET_BY_ID_SUCC,
            data: item,
            status: "success"
        });

    } catch (error) {
        logger.error('Error retrieving item', { error: error.message });

        res.status(STATUS_CODES.SERVER_ERROR).json({
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
            logger.error('Error uploading files', { error: err.message });
            return res.status(STATUS_CODES.SERVER_ERROR).json({
                code: STATUS_CODES.SERVER_ERROR,
                message: FILE_UPLOAD.UPLOAD_ERROR,
                status: "error"
            });
        }

        try {
            const processFiles = (files) => {
                return files.map((file, index) => ({
                    id: `${file.fieldname}-${Date.now()}-${index}`,  // or use a different id logic if needed
                    fileName: file.originalname,
                    fileType: file.mimetype,
                    filePath: file.path,
                    fileSize: file.size
                }));
            };

              // Retrieve the existing item to merge the new data with the old data
            const existingItem = await FestivalModel.findOne({ where: { id: req.params.id } });

            let updateData = {
                ...req.body,
                isDisabled: req.body.isDisabled,
                // image: req.files['image'] ? processFiles(req.files['image'])[0] : undefined,
                image: req.files['image']
    ? req.files['image'][0].location
    : existingItem.image,
            };

          

            if (!existingItem) {
                return res.status(STATUS_CODES.NOT_FOUND).json({
                    code: STATUS_CODES.NOT_FOUND,
                    message: "Item not found",
                    status: "error"
                });
            }

            // Process existing gallery images based on incoming data
            if (req.body.existingImages) {
                const existingImagesToKeep = JSON.parse(req.body.existingImages); // IDs of images to keep

                // Filter out images that are not in the keep list
                updateData.gallery_images = existingItem.gallery_images.filter(img =>
                    // existingImagesToKeep.includes(img.id)
                    existingImagesToKeep.includes(img)
                );
            } else {
                updateData.gallery_images = existingItem.gallery_images; // Retain all existing images if no instructions provided
            }

            // Append new images if provided in the request
            if (req.files['gallery_images']) {
                // const newImages = processFiles(req.files['gallery_images']);
                const newImages = req.files['gallery_images'].map(file => file.location);
                updateData.gallery_images = [...updateData.gallery_images, ...newImages];
            }

            // Process existing video based on incoming data
            if (req.body.existingVideos) {
                const existingVideosToKeep = JSON.parse(req.body.existingVideos); // IDs of videos to keep

                // Filter out videos that are not in the keep list
                updateData.video = existingItem.video.filter(vid =>
                    // existingVideosToKeep.includes(vid.id)
                    existingVideosToKeep.includes(vid)
                );
            } else {
                updateData.video = existingItem.video; // Retain all existing videos if no instructions provided
            }

            // Append new videos if provided in the request
            if (req.files['video']) {
                // const newVideos = processFiles(req.files['video']);
                const newVideos = req.files['video'].map(file => file.location);
                updateData.video = [...updateData.video, ...newVideos];
            }

            // Update the item in the database using Sequelize
            const [updatedRowCount, updatedItem] = await FestivalModel.update(updateData, {
                where: { id: req.params.id },
                returning: true, // To get the updated item back
            });

            if (updatedRowCount === 0) {
                return res.status(STATUS_CODES.NOT_FOUND).json({
                    code: STATUS_CODES.NOT_FOUND,
                    message: "Item not found for update",
                    status: "error"
                });
            }

            logger.info('Item updated', { item: updatedItem });

            const successMessage = req.body.lang === "TA" ? TAMIL_MESSAGE.UPDATE_SUCC : ENGLISH_MESSAGE.UPDATE_SUCC;
            res.status(STATUS_CODES.SUCCESS).json({
                code: STATUS_CODES.SUCCESS,
                message: successMessage,
                data: updatedItem[0], // Get the updated item
                status: "success"
            });

        } catch (error) {
            logger.error('Error updating item', { error: error.message });
            const failMessage = req.body.lang === "TA" ? TAMIL_MESSAGE.UPDATE_FAIL : ENGLISH_MESSAGE.UPDATE_FAIL;
            res.status(STATUS_CODES.SERVER_ERROR).json({
                code: STATUS_CODES.SERVER_ERROR,
                message: failMessage,
                status: "error"
            });
        }
    });
};


// Delete an item
const deleteItem = async (req, res) => {
    try {
        let selectedFields;

        if (req.query.lang === "TA") {
            selectedFields = 'title_ta description_ta date_ta image video gallery_images isDisabled';
        } else {
            selectedFields = 'title_en description_en date_en image video gallery_images isDisabled';
        }

        // Retrieve the item to be deleted before actually deleting it
        const dltitem = await FestivalModel.findOne({
            where: { id: req.params.id },
            attributes: selectedFields.split(' ')  // Sequelize uses the 'attributes' option to select specific fields
        });

        if (!dltitem) {
            logger.warn('Item not found for deletion', { id: req.params.id });

            const message = req.query.lang === "TA" ? TAMIL_MESSAGE.DELETE_FAIL : ENGLISH_MESSAGE.DELETE_FAIL;
            return res.status(STATUS_CODES.NOT_FOUND).json({
                code: STATUS_CODES.NOT_FOUND,
                message: message,
                status: "error"
            });
        }

        // Proceed with deletion using Sequelize's destroy method
        const deleted = await FestivalModel.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            const message = req.query.lang === "TA" ? TAMIL_MESSAGE.DELETE_FAIL : ENGLISH_MESSAGE.DELETE_FAIL;
            return res.status(STATUS_CODES.NOT_FOUND).json({
                code: STATUS_CODES.NOT_FOUND,
                message: message,
                status: "error"
            });
        }

        logger.info('Deleted item', { item: dltitem });

        const successMessage = req.query.lang === "TA" ? TAMIL_MESSAGE.DELETE_SUCC : ENGLISH_MESSAGE.DELETE_SUCC;
        return res.status(STATUS_CODES.SUCCESS).json({
            code: STATUS_CODES.SUCCESS,
            message: successMessage,
            data: dltitem,
            status: "success"
        });

    } catch (error) {
        logger.error('Error deleting item', { error: error.message });

        const failMessage = req.query.lang === "TA" ? TAMIL_MESSAGE.DELETE_FAIL : ENGLISH_MESSAGE.DELETE_FAIL;
        return res.status(STATUS_CODES.SERVER_ERROR).json({
            code: STATUS_CODES.SERVER_ERROR,
            message: failMessage,
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



