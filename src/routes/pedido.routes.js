import { Router } from 'express';
import {
  createPedido,
  getPedidoById,
  getPedidos,
  getPedidosByCliente,
  updatePedido,
  deletePedido,
  getPedidoStats,
  updatePedidoEstado
} from '../controllers/pedido.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Rutas de pedidos
// POST /api/pedidos - Crear un nuevo pedido
router.post('/', createPedido);

// GET /api/pedidos - Obtener todos los pedidos del usuario autenticado
router.get('/', getPedidos);

// GET /api/pedidos/stats - Obtener estadísticas de pedidos
router.get('/stats', getPedidoStats);

// GET /api/pedidos/cliente/:clienteId - Obtener pedidos de un cliente específico
router.get('/cliente/:clienteId', getPedidosByCliente);

// GET /api/pedidos/:id - Obtener un pedido específico por ID
router.get('/:id', getPedidoById);

// PUT /api/pedidos/:id - Actualizar un pedido específico
router.put('/:id', updatePedido);

// PATCH /api/pedidos/:id/estado - Actualizar solo el estado de un pedido
router.patch('/:id/estado', updatePedidoEstado);

// DELETE /api/pedidos/:id - Eliminar un pedido específico
router.delete('/:id', deletePedido);

export default router;
