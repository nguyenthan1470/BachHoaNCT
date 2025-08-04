import { Router } from 'express';
import { createPayment, checkPayment } from '../controllers/vnpay.controller.js';
import auth from '../middleware/auth.js';
const router = Router();

router.post('/create_payment',auth, createPayment);
router.get('/check_payment',auth, checkPayment);

export default router;
