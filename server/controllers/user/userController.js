import User from "../../models/User.js";

// [GET] /api/users/me 

export const getMe = async (req, res) => {
  try {
    
      const user = await User.findById(req.user.id).select('-password');

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
          message: 'Fetched user info successfully',
          user
      });

  } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ message: 'Failed to get user info', error: error.message });
  }
};

  
  // [PUT] /api/users/me
  export const updateMe = async (req, res) => {
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
  
 