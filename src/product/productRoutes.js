import express from 'express';
import { authenticateJWT } from '../core/middlewares/authenticateJWT.js';
import { hasRole } from '../core/middlewares/authMiddleware.js';
import productController from "./ProductController.js";
import {upload} from "../core/middlewares/uploadMiddleware.js";

const router = express.Router();

router.get('/', productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/:id', productController.getById);
router.get('/category/:categoryId', productController.getByCategory);

router.post('/',
    authenticateJWT,
    hasRole('admin'),
    upload.array('images', 5),
    productController.create);

router.put(
    '/:id',
    authenticateJWT,
    hasRole('admin'),
    upload.array('images', 5),
    productController.update
);

router.delete('/:id', authenticateJWT, hasRole('admin'), productController.delete);
router.delete('/image/:imageId', authenticateJWT, hasRole('admin'), productController.deleteImage);


export default router;
