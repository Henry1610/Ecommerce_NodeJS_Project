const User = require('../models/user')
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.login=async function (req,res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // if (!user || !(await bcrypt.compare(password, user.password))) {
    //     return res.status(401).json({ message: 'Invalid credentials' });
    // }
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }
    
    const isValidPassword = await user.isPasswordValid(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }
    
    const token = generateToken(user._id, user.role);
    res.json({ token });
}
exports.register=async function (req,res) {
    try{
        const {username,email,password}=req.body
        const existingUser = await User.findOne({  email  });
        if(existingUser)
        {
            return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
    
        }
        
        const user=await User.create({
            
            username,
            email,
            password
        })
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
            },
            token,
          });
    
    }catch{
        res.status(500).json({ message: 'Lỗi server', error: error.message });

    }
    
}