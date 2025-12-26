import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Hàm chung để gửi email
export const sendEmail = async (email, subject, html) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

// Gửi OTP qua email
export const sendOTPEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Xác thực đăng ký tài khoản</h2>
      <p>Xin chào!</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã OTP sau để hoàn tất quá trình đăng ký:</p>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
      </div>
      <ul>
        <li>Mã OTP có hiệu lực trong 5 phút.</li>
        <li>Không chia sẻ mã này với bất kỳ ai.</li>
      </ul>
      <p>Trân trọng,<br/>Pro shop</p>
    </div>
  `;
  await sendEmail(email, "Mã xác thực đăng ký tài khoản", html);
};

// Gửi email reset password
export const sendResetPasswordEmail = async (email, resetLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Đặt lại mật khẩu</h2>
      <p>Xin chào!</p>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
      <p>Nhấn vào nút dưới đây để đặt lại mật khẩu (có hiệu lực trong 15 phút):</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Đặt lại mật khẩu</a>
      </div>
      <p>Hoặc copy và paste link sau vào trình duyệt:</p>
      <p style="word-break: break-all; color: #007bff;">${resetLink}</p>
      <p style="color: #666; font-size: 14px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Pro shop</p>
    </div>
  `;
  await sendEmail(email, "Đặt lại mật khẩu tài khoản của bạn", html);
};