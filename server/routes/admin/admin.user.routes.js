import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} from '../../controllers/admin/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
