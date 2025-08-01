import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode;
        
        next();
    }
    
    catch (err) {
        return res.status(403).json({ message: 'Bạn không đủ quyền !' });
    }
};
