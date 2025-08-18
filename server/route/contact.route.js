
import express from 'express';
import { getFeedbacks, sendReply, submitContact, submitFeedback } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/submit', submitContact);
router.get('/feedbacks', getFeedbacks);
router.post('/reply', sendReply);
router.post('/submit-feedback', submitFeedback);

export default router;

