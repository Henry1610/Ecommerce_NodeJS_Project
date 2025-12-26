import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '/assets/logo/avatar-IG-mac-dinh-1.jpg' },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  refreshTokens: [{
    token: { type: String, required: true },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

// TTL index để tự động xóa refresh token hết hạn
userSchema.index({ 'refreshTokens.expiresAt': 1 }, { expireAfterSeconds: 0 });

userSchema.pre('save', async function () {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10)
  }
});

userSchema.methods.isPasswordValid = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method để thêm refresh token
userSchema.methods.addRefreshToken = function(token, deviceInfo, ipAddress, rememberMe = false) {
  const oneDayMs = 1 * 24 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + (rememberMe ? thirtyDaysMs : oneDayMs));
  
  // Giới hạn số lượng refresh token (tối đa 5 thiết bị)
  if (this.refreshTokens.length >= 5) {
    // Xóa token cũ nhất
    this.refreshTokens.sort((a, b) => a.createdAt - b.createdAt);
    this.refreshTokens.shift();
  }
  
  this.refreshTokens.push({
    token,
    deviceInfo,
    ipAddress,
    expiresAt
  });
  return this.save();
};

// Method để xóa refresh token
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
  return this.save();
};

export default mongoose.model('User', userSchema);
