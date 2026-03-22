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
import passport from 'passport';
import './config/passport.js';
import session from 'express-session';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000'
];
app.use(cors({
    origin: function (origin, callback) {
        // Cho phép cả call từ Postman (origin === undefined)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.post('/api/users/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 5 * 60 * 1000,
    },
}));
app.use(passport.initialize());
app.use(cookieParser());

connectDB();
route(app);
app.use(errorHandler)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));