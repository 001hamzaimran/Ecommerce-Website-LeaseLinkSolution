import Product from '../Models/Product.js';

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try {
        let { 
            name, description, price, originalPrice, 
            category, subCategory, image, images, 
            rating, reviews, variants, 
            featured, isNew 
        } = req.body;

        if (req.files && req.files.image) {
            image = req.files.image[0].path;
        }

        if (req.files && req.files.images) {
            const uploadedImages = req.files.images.map(file => file.path);
            const existingLinks = Array.isArray(images) ? images : (images ? [images] : []);
            images = [...uploadedImages, ...existingLinks];
        }

        if (typeof images === 'string') {
            images = [images];
        }

        const product = await Product.create({
            name,
            description,
            price,
            originalPrice,
            category,
            subCategory,
            image,
            images,
            rating,
            reviews,
            variants: typeof variants === 'string' ? JSON.parse(variants) : variants,
            featured: featured === 'true' || featured === true,
            isNew: isNew === 'true' || isNew === true
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .select('-__v')
            .populate('category', 'name image')
            .populate('subCategory', 'name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .select('-__v')
            .populate('category', 'name image')
            .populate('subCategory', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.files && req.files.image) {
            updateData.image = req.files.image[0].path;
        }

        if (req.files && req.files.images) {
            const uploadedImages = req.files.images.map(file => file.path);
            const existingLinks = Array.isArray(req.body.images) ? req.body.images : (req.body.images ? [req.body.images] : []);
            updateData.images = [...uploadedImages, ...existingLinks];
        }

        if (updateData.variants && typeof updateData.variants === 'string') {
            updateData.variants = JSON.parse(updateData.variants);
        }
        if (updateData.sizes && typeof updateData.sizes === 'string') {
            updateData.sizes = JSON.parse(updateData.sizes);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name image').populate('subCategory', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
