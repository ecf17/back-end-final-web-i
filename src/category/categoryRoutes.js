import express from 'express';
import { authenticateJWT } from '../core/middlewares/authenticateJWT.js';
import { hasRole } from '../core/middlewares/authMiddleware.js';
import categoryController from "./CategoryController.js";

const router = express.Router();

router.get('/', categoryController.getAll);

router.post('/', authenticateJWT, hasRole('admin'), categoryController.create);
router.put('/:id', authenticateJWT, hasRole('admin'), categoryController.update);
router.delete('/:id', authenticateJWT, hasRole('admin'), categoryController.delete);

export default router;
