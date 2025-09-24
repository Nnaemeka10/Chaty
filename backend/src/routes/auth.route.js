import express from 'express';
import { login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

// Apply Arcjet protection middleware to all routes in this router
router.use(arcjetProtection);

//endpoints
router.post('/login', login);

router.post('/signup', signup);


router.post('/logout', logout);
 

router.put('/update-profile', protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

 
export default router;