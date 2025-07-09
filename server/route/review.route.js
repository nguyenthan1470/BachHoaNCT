
import express from 'express'
import { createReview, getProductReviews } from '../controllers/review.controller.js'
import auth  from '../middleware/auth.js'

const router = express.Router()

router.post('/add-review',auth, createReview)
router.post('/get-review', getProductReviews)

export default router
