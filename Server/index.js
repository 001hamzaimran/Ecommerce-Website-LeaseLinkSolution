import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Utils/db.js';
import { securityMiddleware } from './Middleware/security.js';
import categoryRoutes from './Routes/categoryRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import subcategoryRoutes from './Routes/subcategoryRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';



import { secureResponse } from './Middleware/secureResponse.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(securityMiddleware);
app.use(secureResponse);

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subcategories', subcategoryRoutes);


// Serve Static Files in Production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    // Basic Route
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
🚀 Server is firing up!
-------------------------
📡 Status: Running
🔌 Port:   ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
-------------------------
    `);
});
