import { Router } from 'express';
import {
  createProducto,
  getProductoById,
  getProductos,
  updateProducto,
  deleteProducto,
  updateStock,
  getProductosStockBajo
} from '../controllers/producto.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Rutas de productos
// POST /api/productos - Crear un nuevo producto
router.post('/', createProducto);

// GET /api/productos - Obtener todos los productos del usuario autenticado
router.get('/', getProductos);

// GET /api/productos/stock-bajo - Obtener productos con stock bajo
router.get('/stock-bajo', getProductosStockBajo);

// GET /api/productos/:id - Obtener un producto específico por ID
router.get('/:id', getProductoById);

// PUT /api/productos/:id - Actualizar un producto específico
router.put('/:id', updateProducto);

// PATCH /api/productos/:id/stock - Actualizar el stock de un producto
router.patch('/:id/stock', updateStock);

// DELETE /api/productos/:id - Eliminar un producto específico
router.delete('/:id', deleteProducto);

export default router;

