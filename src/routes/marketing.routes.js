import { Router } from 'express';
import {
  createCupon, getCupones, getCuponById, updateCupon, deleteCupon,
  createPromocion, getPromociones, getPromocionById, updatePromocion, deletePromocion
} from '../controllers/marketing.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
 
const router = Router();
 
router.use(authenticateToken);
 
// Cupones
router.post('/cupones', createCupon);
router.get('/cupones', getCupones);
router.get('/cupones/:id', getCuponById);
router.put('/cupones/:id', updateCupon);
router.delete('/cupones/:id', deleteCupon);
 
// Promociones
router.post('/promociones', createPromocion);
router.get('/promociones', getPromociones);
router.get('/promociones/:id', getPromocionById);
router.put('/promociones/:id', updatePromocion);
router.delete('/promociones/:id', deletePromocion);
 
export default router;
 