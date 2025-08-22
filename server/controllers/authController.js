import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import transporter from '../config/mailer.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Tạo OTP ngẫu nhiên
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Gửi OTP qua email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Mã xác thực đăng ký tài khoản',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Xác thực đăng ký tài khoản</h2>
        <p>Xin chào!</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã OTP sau để hoàn tất quá trình đăng ký:</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>Lưu ý:</strong></p>
        <ul>
          <li>Mã OTP có hiệu lực trong 5 phút</li>
          <li>Không chia sẻ mã này với bất kỳ ai</li>
          <li>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này</li>
        </ul>
        <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Gửi OTP cho đăng ký
export const sendRegisterOTP = async (req, res) => {
  try {
    const { email, username } = req.body;

    // Kiểm tra email và username đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
      }
    }

    // Tạo OTP mới
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    // Xóa OTP cũ nếu có
    await OTP.deleteMany({ email, type: 'register' });

    // Lưu OTP mới
    await OTP.create({
      email,
      otp,
      type: 'register',
      expiresAt
    });

    // Gửi email OTP
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: 'Mã OTP đã được gửi đến email của bạn',
      email
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Lỗi gửi OTP', error: error.message });
  }
};

// Xác thực OTP và đăng ký
export const verifyOTPAndRegister = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    // Tìm OTP hợp lệ
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: 'register',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
    }

    // Kiểm tra lại email và username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
      }
    }

    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password
    });

    // Đánh dấu OTP đã sử dụng
    await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });

    // Tạo tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role, false);

    // Lưu refresh token vào database (mặc định 1 ngày cho đăng ký)
    await user.addRefreshToken(refreshToken, req.headers['user-agent'], req.ip, false);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const login = async function (req, res) {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    // Tạo tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role, !!rememberMe);

    // Lưu refresh token vào database
    await user.addRefreshToken(refreshToken, req.headers['user-agent'], req.ip, !!rememberMe);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000 // 30 days or 1 day
    });

    res.status(200).json({
      message: 'Đăng nhập thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Refresh token endpoint
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Tìm user và kiểm tra refresh token có trong database không
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const refreshTokenExists = user.refreshTokens.find(rt => rt.token === refreshToken);
    if (!refreshTokenExists) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Kiểm tra token có hết hạn không
    if (refreshTokenExists.expiresAt < new Date()) {
      // Xóa token hết hạn
      await user.removeRefreshToken(refreshToken);
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // Tạo access token mới
    const newAccessToken = generateAccessToken(user._id, user.role);

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Logout endpoint
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Xóa refresh token khỏi database
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          await user.removeRefreshToken(refreshToken);
        }
      } catch (e) {
        // ignore invalid token on logout
      }
    }

    // Xóa cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    console.error('Logout error:', error);
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