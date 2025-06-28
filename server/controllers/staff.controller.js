
import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getAllStaff = async (req, res) => {
  try {
    const staffList = await UserModel.find({ role: 'ADMIN' });
    res.json({ success: true, data: staffList });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const createStaff = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'ADMIN',
    });
    res.json({ success: true, data: newStaff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const updated = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Xoá thành công" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
