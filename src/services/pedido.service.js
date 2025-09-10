import {
  createPedido,
  findPedidoById,
  findPedidosByUserId,
  findPedidosByClienteId,
  updatePedido,
  deletePedido,
  findPedidoByIdAndUserId,
  getPedidoStatsByUserId
} from '../repository/pedido.repository.js';
import { findClientById } from '../repository/client.repository.js';

export const createPedidoService = async (pedidoData, userId) => {
  // Verificar que el cliente pertenece al usuario
  const cliente = await findClientById(pedidoData.cliente_id);
  if (!cliente) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }

  if (cliente.user_id !== userId) {
    const error = new Error('No tienes permisos para crear pedidos para este cliente');
    error.status = 403;
    throw error;
  }

  // Validar que la fecha de entrega no sea en el pasado
  const fechaEntrega = new Date(pedidoData.fecha_entrega);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  if (fechaEntrega < hoy) {
    const error = new Error('La fecha de entrega no puede ser en el pasado');
    error.status = 400;
    throw error;
  }

  // Validar que los montos sean positivos
  if (pedidoData.monto_total_pagado < 0) {
    const error = new Error('El monto total pagado no puede ser negativo');
    error.status = 400;
    throw error;
  }

  if (pedidoData.monto_recibido_sin_iva < 0) {
    const error = new Error('El monto recibido sin IVA no puede ser negativo');
    error.status = 400;
    throw error;
  }

  const pedido = await createPedido(pedidoData);
  return pedido;
};

export const getPedidoByIdService = async (id, userId) => {
  const pedido = await findPedidoByIdAndUserId(id, userId);
  
  if (!pedido) {
    const error = new Error('Pedido no encontrado');
    error.status = 404;
    throw error;
  }

  return pedido;
};

export const getPedidosByUserIdService = async (userId, options = {}) => {
  const result = await findPedidosByUserId(userId, options);
  return result;
};

export const getPedidosByClienteIdService = async (clienteId, userId, options = {}) => {
  // Verificar que el cliente pertenece al usuario
  const cliente = await findClientById(clienteId);
  if (!cliente) {
    const error = new Error('Cliente no encontrado');
    error.status = 404;
    throw error;
  }

  if (cliente.user_id !== userId) {
    const error = new Error('No tienes permisos para ver los pedidos de este cliente');
    error.status = 403;
    throw error;
  }

  const result = await findPedidosByClienteId(clienteId, userId, options);
  return result;
};

export const updatePedidoService = async (id, pedidoData, userId) => {
  const pedido = await findPedidoByIdAndUserId(id, userId);
  
  if (!pedido) {
    const error = new Error('Pedido no encontrado');
    error.status = 404;
    throw error;
  }

  // Si se está cambiando el cliente, verificar que pertenece al usuario
  if (pedidoData.cliente_id && pedidoData.cliente_id !== pedido.cliente_id) {
    const cliente = await findClientById(pedidoData.cliente_id);
    if (!cliente) {
      const error = new Error('Cliente no encontrado');
      error.status = 404;
      throw error;
    }

    if (cliente.user_id !== userId) {
      const error = new Error('No tienes permisos para asignar pedidos a este cliente');
      error.status = 403;
      throw error;
    }
  }

  // Validar fecha de entrega si se está actualizando
  if (pedidoData.fecha_entrega) {
    const fechaEntrega = new Date(pedidoData.fecha_entrega);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaEntrega < hoy) {
      const error = new Error('La fecha de entrega no puede ser en el pasado');
      error.status = 400;
      throw error;
    }
  }

  // Validar montos si se están actualizando
  if (pedidoData.monto_total_pagado !== undefined && pedidoData.monto_total_pagado < 0) {
    const error = new Error('El monto total pagado no puede ser negativo');
    error.status = 400;
    throw error;
  }

  if (pedidoData.monto_recibido_sin_iva !== undefined && pedidoData.monto_recibido_sin_iva < 0) {
    const error = new Error('El monto recibido sin IVA no puede ser negativo');
    error.status = 400;
    throw error;
  }

  const updatedPedido = await updatePedido(id, pedidoData);
  return updatedPedido;
};

export const deletePedidoService = async (id, userId) => {
  const pedido = await findPedidoByIdAndUserId(id, userId);
  
  if (!pedido) {
    const error = new Error('Pedido no encontrado');
    error.status = 404;
    throw error;
  }

  const deletedPedido = await deletePedido(id);
  return deletedPedido;
};

export const getPedidoStatsService = async (userId) => {
  const stats = await getPedidoStatsByUserId(userId);
  return stats;
};

export const validatePedidoData = (pedidoData) => {
  const errors = [];

  // Validaciones obligatorias
  if (!pedidoData.titulo || pedidoData.titulo.trim() === '') {
    errors.push('El título es obligatorio');
  }

  if (!pedidoData.cliente_id) {
    errors.push('El cliente es obligatorio');
  } else if (!Number.isInteger(Number(pedidoData.cliente_id)) || Number(pedidoData.cliente_id) <= 0) {
    errors.push('El ID del cliente debe ser un número entero positivo');
  }

  if (!pedidoData.fecha_entrega) {
    errors.push('La fecha de entrega es obligatoria');
  } else {
    const fechaEntrega = new Date(pedidoData.fecha_entrega);
    if (isNaN(fechaEntrega.getTime())) {
      errors.push('La fecha de entrega debe ser una fecha válida');
    }
  }

  // Validar estado si se proporciona
  if (pedidoData.estado && !['preparando', 'enviado', 'entregado'].includes(pedidoData.estado)) {
    errors.push('El estado debe ser: preparando, enviado o entregado');
  }

  // Validar montos si se proporcionan
  if (pedidoData.monto_total_pagado !== undefined) {
    if (isNaN(pedidoData.monto_total_pagado) || pedidoData.monto_total_pagado < 0) {
      errors.push('El monto total pagado debe ser un número positivo o cero');
    }
  }

  if (pedidoData.monto_recibido_sin_iva !== undefined) {
    if (isNaN(pedidoData.monto_recibido_sin_iva) || pedidoData.monto_recibido_sin_iva < 0) {
      errors.push('El monto recibido sin IVA debe ser un número positivo o cero');
    }
  }

  return errors;
};
