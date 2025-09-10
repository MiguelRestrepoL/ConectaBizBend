import { Router } from 'express';
import { register, login, acceptUserTerms, logout } from '../controllers/auth.controller.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/:id/accept-terms', acceptUserTerms);

export default router;


