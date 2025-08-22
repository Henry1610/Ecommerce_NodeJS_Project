import jwt from 'jsonwebtoken';

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access token ngắn hạn
  });
};

const generateRefreshToken = (id, role, rememberMe = false) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: rememberMe ? '30d' : '1d', // 30 ngày nếu rememberMe, mặc định 1 ngày
  });
};

export { generateAccessToken, generateRefreshToken };
export default generateAccessToken;
