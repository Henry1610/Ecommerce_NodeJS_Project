import express from 'express';
import { getAdminMe, updateAdminMe, changeAdminPassword } from '../../controllers/admin/adminController.js';
import { uploadAvatar } from '../../config/cloudinary.js';

const router = express.Router();

router.get('/me', getAdminMe);
router.put('/me', uploadAvatar().single('avatar'), updateAdminMe);
router.post('/change-password', changeAdminPassword);

export default router; 