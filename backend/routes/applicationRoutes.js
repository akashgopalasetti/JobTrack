import express from 'express';
import {
  getHealth,
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
} from '../controllers/applicationController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', getHealth);

// Application CRUD routes
router.route('/applications')
  .get(getAllApplications)
  .post(createApplication);

router.route('/applications/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;
