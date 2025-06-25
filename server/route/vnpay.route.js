import { Router } from 'express';
import { createPayment, checkPayment } from '../controllers/vnpay.controller.js';

const router = Router();

router.get('/create_payment', createPayment);
router.get('/check_payment', checkPayment);

export default router;
