import User from "../../models/User.js";
import bcrypt from 'bcrypt';

// [GET] /api/admin/me
export const getAdminMe = async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user || user.role !== 'admin') {
          return res.status(404).json({ message: 'Admin not found' });
      }
      res.status(200).json({
          message: 'Fetched admin info successfully',
          user
      });
  } catch (error) {
      console.error('Error fetching admin info:', error);
      res.status(500).json({ message: 'Failed to get admin info', error: error.message });
  }
};

// [PUT] /api/admin/me
export const updateAdminMe = async (req, res) => {
  try {
    const { username } = req.body;
    const updateFields = {
      updatedAt: new Date(),
    };
    if (username) updateFields.username = username;
    if (req.file && req.file.path) {
      updateFields.avatar = req.file.path;
    }
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') return res.status(404).json({ message: 'Không tìm thấy admin' });
    Object.assign(user, updateFields);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update admin', error });
  }
};

// [POST] /api/admin/change-password
export const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp.' });
    }
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') return res.status(404).json({ message: 'Không tìm thấy admin.' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Đổi mật khẩu thất bại.', error });
  }
}; 