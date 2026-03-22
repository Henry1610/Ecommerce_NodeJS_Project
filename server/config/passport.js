import passport from 'passport';
import dotenv from "dotenv";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
const callbackURL = `${process.env.SEVER_URL}/api/auth/facebook/callback`;
dotenv.config();

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: callbackURL,
    profileFields: ["id", "email", "displayName", "picture.type(large)"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const facebookId = profile.id;
        const email = profile.emails?.[0]?.value;

        // 1. Tìm theo facebookId
        let user = await User.findOne({ facebookId });

        // 2. Nếu chưa có → tìm theo email
        if (!user && email) {
            user = await User.findOne({ email });

            // Nếu có user → cập nhật thêm facebookId
            if (user) {
                user.facebookId = facebookId;
                await user.save();
            }
        }
        // 3. Nếu vẫn chưa có → tạo mới
        if (!user) {
            user = await User.create({
                email,
                facebookId,
                username: profile.displayName,
                // `User` schema uses field name `avatar`
                avatar: profile.photos?.[0]?.value,
            });
        }

        // 4. Tạo JWT
        const tokens = {
            accessToken: generateAccessToken(user._id, user.role),
            refreshToken: generateRefreshToken(user._id, user.role, false),
        };

        return done(null, { user, tokens });

    } catch (err) {
        return done(err, null);
    }
}));
passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));