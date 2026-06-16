import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  createProveedor,
  getProveedores,
  getProveedorById,
  updateProveedor,
  deleteProveedor,
} from '../controllers/proveedor.controller.js';
 
const router = Router();
router.use(authenticateToken);
 
router.get('/',       getProveedores);
router.post('/',      createProveedor);
router.get('/:id',    getProveedorById);
router.put('/:id',    updateProveedor);
router.delete('/:id', deleteProveedor);
 
export default router;
 