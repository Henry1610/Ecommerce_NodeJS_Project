import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Cấu hình timeout để tránh treo trên Render
  connectionTimeout: 10000, // 10 giây để kết nối
  greetingTimeout: 10000, // 10 giây để greeting
  socketTimeout: 10000, // 10 giây cho socket
  // TLS options
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;