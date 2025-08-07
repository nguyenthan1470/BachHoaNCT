import express from 'express';
import { getProductRecommendations, getTrendingProducts } from '../controllers/recommendation.controller.js';

const router = express.Router();

router.post('/recommendations', getProductRecommendations);
router.post('/trending', getTrendingProducts);

export default router;
