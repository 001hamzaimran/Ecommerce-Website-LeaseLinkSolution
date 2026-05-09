import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Product name is required'],
        trim: true
    },
    description: { 
        type: String, 
        required: [true, 'Product description is required'] 
    },
    price: { 
        type: Number, 
        required: [true, 'Product price is required'],
        min: 0
    },
    originalPrice: { 
        type: Number,
        min: 0
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: [true, 'Product category is required'] 
    },
    subCategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subcategory',
        required: [true, 'Subcategory is required']
    },
    image: { 
        type: String, 
        required: [true, 'Main image URL is required'] 
    },
    images: { 
        type: [String], 
        default: [] 
    },
    rating: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 5
    },
    reviews: { 
        type: Number, 
        default: 0 
    },
    variants: [{
        name: String,
        values: [String]
    }],
    featured: { 
        type: Boolean, 
        default: false 
    },
    isNew: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
