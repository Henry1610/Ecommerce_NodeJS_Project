// [GET] /api/users/me 
exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user info', error });
    }
  };
  
  // [PUT] /api/users/me
  exports.updateMe = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const updateFields = {
        username,
        email,
        updatedAt: new Date(),
      };
  
      if (password) {
        updateFields.password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updateFields,
        { new: true }
      );
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user', error });
    }
  };
  
 