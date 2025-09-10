import { Op } from 'sequelize';
import { Pedido } from '../models/Pedido.model.js';
import { Client } from '../models/Client.model.js';

export const createPedido = async (pedidoData) => {
  return Pedido.create(pedidoData);
};

export const findPedidoById = async (id) => {
  return Pedido.findByPk(id, {
    include: [{
      association: 'cliente',
      attributes: ['id', 'nombre', 'apellido', 'correo_electronico', 'numero_telefono']
    }]
  });
};

export const findPedidosByUserId = async (userId, options = {}) => {
  const { page = 1, limit = 10, search = '', estado = '', cliente_id = '' } = options;
  const offset = (page - 1) * limit;

  const whereClause = {};

  // Filtro por estado
  if (estado) {
    whereClause.estado = estado;
  }

  // Filtro por cliente específico
  if (cliente_id) {
    whereClause.cliente_id = cliente_id;
  }

  // Búsqueda por título o descripción
  if (search) {
    whereClause[Op.or] = [
      { titulo: { [Op.iLike]: `%${search}%` } },
      { descripcion: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Pedido.findAndCountAll({
    where: whereClause,
    include: [{
      association: 'cliente',
      where: { user_id: userId }, // Solo pedidos de clientes del usuario
      attributes: ['id', 'nombre', 'apellido', 'correo_electronico', 'numero_telefono'],
      required: true
    }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    pedidos: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit)
  };
};

export const findPedidosByClienteId = async (clienteId, userId, options = {}) => {
  const { page = 1, limit = 10, estado = '' } = options;
  const offset = (page - 1) * limit;

  const whereClause = {
    cliente_id: clienteId
  };

  // Filtro por estado
  if (estado) {
    whereClause.estado = estado;
  }

  const { count, rows } = await Pedido.findAndCountAll({
    where: whereClause,
    include: [{
      association: 'cliente',
      where: { user_id: userId }, // Verificar que el cliente pertenece al usuario
      attributes: ['id', 'nombre', 'apellido', 'correo_electronico', 'numero_telefono'],
      required: true
    }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    pedidos: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit)
  };
};

export const updatePedido = async (id, pedidoData) => {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) return null;
  
  await pedido.update(pedidoData);
  return pedido;
};

export const deletePedido = async (id) => {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) return null;
  
  await pedido.destroy();
  return pedido;
};

export const findPedidoByIdAndUserId = async (id, userId) => {
  return Pedido.findOne({
    where: { id },
    include: [{
      association: 'cliente',
      where: { user_id: userId },
      attributes: ['id', 'nombre', 'apellido', 'correo_electronico', 'numero_telefono'],
      required: true
    }]
  });
};

export const getPedidoStatsByUserId = async (userId) => {
  const totalPedidos = await Pedido.count({
    include: [{
      association: 'cliente',
      where: { user_id: userId },
      required: true
    }]
  });

  const pedidosPorEstado = await Pedido.findAll({
    attributes: [
      'estado',
      [Pedido.sequelize.fn('COUNT', Pedido.sequelize.col('id')), 'count']
    ],
    include: [{
      association: 'cliente',
      where: { user_id: userId },
      attributes: [],
      required: true
    }],
    group: ['estado']
  });

  const montoTotal = await Pedido.sum('monto_total_pagado', {
    include: [{
      association: 'cliente',
      where: { user_id: userId },
      required: true
    }]
  });

  const montoRecibido = await Pedido.sum('monto_recibido_sin_iva', {
    include: [{
      association: 'cliente',
      where: { user_id: userId },
      required: true
    }]
  });

  return {
    totalPedidos,
    pedidosPorEstado: pedidosPorEstado.reduce((acc, item) => {
      acc[item.estado] = parseInt(item.dataValues.count);
      return acc;
    }, {}),
    montoTotal: parseFloat(montoTotal) || 0,
    montoRecibido: parseFloat(montoRecibido) || 0
  };
};
