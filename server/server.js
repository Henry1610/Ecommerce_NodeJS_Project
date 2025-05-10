import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import route from './routes/index.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();
route(app);
app.get('/', (req, res) => {
    res.send('Server đang chạy...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));