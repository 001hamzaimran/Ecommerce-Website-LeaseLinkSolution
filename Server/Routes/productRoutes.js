import express from 'express';
import { upload } from '../Middleware/cloudinary.js';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../Controllers/productController.js';

const router = express.Router();

// POST: Create product (handles both file uploads and URL links)
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'images', maxCount: 10 }
]), createProduct);

router.get('/', getProducts);
router.get('/:id', getProductById);

// PUT: Update product (handles both file uploads and URL links)
router.put('/:id', upload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'images', maxCount: 10 }
]), updateProduct);

router.delete('/:id', deleteProduct);

export default router;
