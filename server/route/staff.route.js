// routes/staff.route.js
import express from 'express';
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff
} from '../controllers/staff.controller.js';

const staffRouter = express.Router();

staffRouter.get('/', getAllStaff);
staffRouter.post('/', createStaff);
staffRouter.put('/:id', updateStaff);
staffRouter.delete('/:id', deleteStaff);

export default staffRouter;
