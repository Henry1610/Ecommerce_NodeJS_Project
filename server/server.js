 import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import route from './routes/index.js';
import path from 'path';
import { stripeWebhook } from './controllers/user/paymentController.js';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Trust proxy for correct req.ip and secure cookies behind proxies
app.set('trust proxy', true);



app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const allowedRegex = process.env.ALLOWED_ORIGIN_REGEX ? new RegExp(process.env.ALLOWED_ORIGIN_REGEX) : null;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin) || (allowedRegex && allowedRegex.test(origin))) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.options('*', cors());
app.post('/api/users/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use(cookieParser());    

connectDB();
route(app);
app.use(errorHandler)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));