import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import placeRoutes from './routes/placeRoute.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/places');
});

// Routes
app.use('/auth', authRoutes);
app.use('/places', placeRoutes);



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