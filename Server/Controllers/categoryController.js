import Category from '../Models/Category.js';
import { cloudinary } from '../Middleware/cloudinary.js';

// @desc    Create a new category
// @route   POST /api/categories
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a category image' });
        }

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({
            name,
            image: req.file.path,
            cloudinary_id: req.file.filename
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('-__v -cloudinary_id');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        let category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (req.file) {
            // Delete old image from cloudinary
            await cloudinary.uploader.destroy(category.cloudinary_id);
            category.image = req.file.path;
            category.cloudinary_id = req.file.filename;
        }

        category.name = name || category.name;
        const updatedCategory = await category.save();

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete image from cloudinary
        await cloudinary.uploader.destroy(category.cloudinary_id);
        await category.deleteOne();

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
