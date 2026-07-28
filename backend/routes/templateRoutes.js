const express = require('express');
const { body } = require('express-validator');
const {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTemplates)
  .post(
    [
      body('title', 'Template title is required').notEmpty(),
      body('content', 'Template content is required').notEmpty()
    ],
    validate,
    createTemplate
  );

router
  .route('/:id')
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;
