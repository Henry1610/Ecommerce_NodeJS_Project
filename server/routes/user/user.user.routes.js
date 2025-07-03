import express from 'express';
import { getMe, updateMe, changePassword } from '../../controllers/user/userController.js';
import { uploadAvatar } from '../../config/cloudinary.js';

const router = express.Router();

router.get('/me', getMe);
router.put('/me', uploadAvatar().single('avatar'), updateMe);
router.post('/change-password', changePassword);

export default router;
