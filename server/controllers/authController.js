import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import transporter from '../config/mailer.js';
import crypto from 'crypto';

export const login = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isValidPassword = await user.isPasswordValid(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }

        const token = generateToken(user._id, user.role);
        res.status(201).json({
            message: 'Đăng nhập thành công',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

export const register = async function (req, res) {
    try {
        const { username, email, password } = req.body;
        const existingUsername = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingUsername && existingEmail) {
            return res.status(400).json({ message: 'Tên đăng nhập và email đã tồn tại' });
        } else if (existingUsername) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
        } else if (existingEmail) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }
        // Tạo token reset
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 phút
        await user.save();
        // Gửi mail bằng nodemailer
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Đặt lại mật khẩu tài khoản của bạn',
            html: `
        <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
        <p>Nhấn vào link dưới đây để đặt lại mật khẩu (có hiệu lực trong 15 phút):</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      `
        });
        res.json({ message: 'Đã gửi email đặt lại mật khẩu (nếu email tồn tại trong hệ thống)' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Đặt lại mật khẩu thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};