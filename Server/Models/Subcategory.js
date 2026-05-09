import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Subcategory name is required'],
        trim: true
    },
    parentCategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: [true, 'Parent category is required'] 
    }
}, { timestamps: true });

// Ensure unique subcategory name within the same parent category
subcategorySchema.index({ name: 1, parentCategory: 1 }, { unique: true });

const Subcategory = mongoose.model('Subcategory', subcategorySchema);
export default Subcategory;
