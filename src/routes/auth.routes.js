import { Router } from 'express';
import { register, login, acceptUserTerms, logout, updateUserProfile, changePassword, getUserById } from '../controllers/auth.controller.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/:id', getUserById);
router.post('/auth/:id/accept-terms', acceptUserTerms);
router.put('/auth/:id/profile', updateUserProfile);
router.put('/auth/:id/change-password', changePassword);

export default router;


