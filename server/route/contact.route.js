
import express from 'express';
import { getFeedbacks, sendReply, submitContact, submitfeedback } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/submit', submitContact);
router.get('/feedbacks', getFeedbacks);
router.post('/reply', sendReply);
router.post('/submit-feedback', submitfeedback);

export default router;

