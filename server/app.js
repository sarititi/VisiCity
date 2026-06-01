import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import productRoutes from './routes/productRoutes.js'; -- הוסיפי routes נוספים כאן

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));

app.use(express.json());

// Routes
app.use('/', authRoutes);
// app.use('/users', userRoutes);
// app.use('/products', productRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;