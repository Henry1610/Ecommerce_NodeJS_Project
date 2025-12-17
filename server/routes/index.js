import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import publicRoutes from './public.routes.js'
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { healthCheck } from '../controllers/authController.js';
function route(app) {
    app.use('/api/auth', authRoutes);
    app.use('/api/users',authenticate, authorize('user'), userRoutes);
    app.use('/api/admin',authenticate, authorize('admin'), adminRoutes);
    app.use('/api', publicRoutes); 
    app.use("/health", healthCheck);

}

export default route;