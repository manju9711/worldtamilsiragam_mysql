const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.post('/', roleController.createRole);
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.put('/:id', roleController.updateRoleById);
router.delete('/:id', roleController.deleteRoleById);

module.exports = router;
