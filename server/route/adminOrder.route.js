import express from 'express';
import { admin } from '../middleware/Admin.js';
import auth from '../middleware/auth.js';
import { getAllOrdersController, updateOrderStatusController } from '../controllers/adminOrder.controller.js';

const router = express.Router();

router.get('/all-orders', auth, admin, getAllOrdersController);
router.put('/update-order-status', auth, admin, updateOrderStatusController);

export default router;
