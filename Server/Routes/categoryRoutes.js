import express from 'express';
import { upload } from '../Middleware/cloudinary.js';
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from '../Controllers/categoryController.js';

const router = express.Router();

router.post('/', upload.single('image'), createCategory);
router.get('/', getCategories);
router.put('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
