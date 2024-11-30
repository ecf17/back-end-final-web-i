import express from 'express';
import userController from './UserController.js';
import { authenticateJWT } from '../core/middlewares/authenticateJWT.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.put('/profile', authenticateJWT, userController.updateProfile);
router.get('/profile', authenticateJWT, userController.getProfile);

export default router;
