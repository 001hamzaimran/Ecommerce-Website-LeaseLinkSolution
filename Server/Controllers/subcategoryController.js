import Subcategory from '../Models/Subcategory.js';

// @desc    Create a new subcategory
// @route   POST /api/subcategories
export const createSubcategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;
        const subcategory = await Subcategory.create({ name, parentCategory });
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all subcategories
// @route   GET /api/subcategories
export const getSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.query;
        const filter = categoryId ? { parentCategory: categoryId } : {};
        const subcategories = await Subcategory.find(filter).populate('parentCategory', 'name');
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a subcategory
// @route   PUT /api/subcategories/:id
export const updateSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a subcategory
// @route   DELETE /api/subcategories/:id
export const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json({ message: 'Subcategory deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
