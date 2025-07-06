export const authorize = (requiredRole) => (req, res, next) => {
  console.log('🛡️ Authorize middleware:', { user: req.user, requiredRole });
  if (!req.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  // Nếu đúng role mới cho qua
  next();
};