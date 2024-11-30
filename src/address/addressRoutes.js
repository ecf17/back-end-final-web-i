import express from 'express';
import { authenticateJWT } from '../core/middlewares/authenticateJWT.js';
import addressController from "./AddressController.js";

const router = express.Router();

router.get('/', authenticateJWT, addressController.getAll);
router.post('/', authenticateJWT, addressController.create);
router.put('/:id', authenticateJWT, addressController.update);
router.delete('/:id', authenticateJWT, addressController.delete);

export default router;
