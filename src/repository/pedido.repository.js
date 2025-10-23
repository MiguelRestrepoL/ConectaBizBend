import { Op } from 'sequelize';
import { Pedido } from '../models/Pedido.model.js';
import { Client } from '../models/Client.model.js';
import { NaturalClient } from '../models/NaturalClient.model.js';
import { JuridicalClient } from '../models/JuridicalClient.js';
import { sequelize } from '../config/database.js';

/**
 * ============================================================
 * 🟣 CREAR PEDIDO
 * ============================================================
 */
export const createPedido = async (orderData, userId) => {
  try {
    const newOrder = await Pedido.create({
      ...orderData,
      user_id: userId
    });

    return newOrder;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 OBTENER PEDIDO POR ID
 * ============================================================
 */
export const findPedidoById = async (orderId, userId) => {
  try {
    const order = await Pedido.findOne({
      where: {
        id: orderId
      },
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: NaturalClient,
              as: 'persona_natural',
              attributes: ['nombre', 'segundo_nombre', 'apellido', 'segundo_apellido']
            },
            {
              model: JuridicalClient,
              as: 'persona_juridica',
              attributes: ['razon_social', 'nit', 'representante_legal']
            }
          ]
        }
      ]
    });

    return order;
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 OBTENER PEDIDO POR ID Y USER ID
 * ============================================================
 */
export const findPedidoByIdAndUserId = async (orderId) => {
  try {
    return await Pedido.findOne({
      where: { id: orderId },
      include: [
        {
          model: Client,
          as: 'cliente',
          include: [
            {
              model: NaturalClient,
              as: 'persona_natural'
            },
            {
              model: JuridicalClient,
              as: 'persona_juridica'
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error al obtener pedido por ID y usuario:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 LISTAR PEDIDOS DE UN USUARIO (con paginación y búsqueda)
 * ============================================================
 */
export const findPedidosByUserId = async (userId, options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    estado = null, // 'preparando', 'enviado', 'entregado'
    clientId = null,
    includeInactive = false
  } = options;

  const offset = (page - 1) * limit;

  // Si no se quieren incluir pedidos de clientes inactivos
  const clientWhere = { user_id: userId };
  if (!includeInactive) {
    clientWhere.state = true;
  }

  // Filtro por cliente específico
  if (clientId) {
    clientWhere.id = clientId;
  }

  // Condiciones de búsqueda textual
  let whereClause = {};
  
  if (estado) {
    whereClause.estado = estado;
  }

  if (search) {
    whereClause[Op.or] = [
      { titulo: { [Op.iLike]: `%${search}%` } },
      { descripcion: { [Op.iLike]: `%${search}%` } },
      { '$cliente.persona_natural.nombre$': { [Op.iLike]: `%${search}%` } },
      { '$cliente.persona_natural.apellido$': { [Op.iLike]: `%${search}%` } },
      { '$cliente.persona_juridica.razon_social$': { [Op.iLike]: `%${search}%` } },
      { '$cliente.persona_juridica.nit$': { [Op.iLike]: `%${search}%` } },
      { '$cliente.correo_electronico$': { [Op.iLike]: `%${search}%` } }
    ];
  }

  try {
    const { count, rows } = await Pedido.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Client,
          as: 'cliente',
          where: clientWhere,
          required: true, // INNER JOIN para asegurar que el cliente exista
          include: [
            {
              model: NaturalClient,
              as: 'persona_natural',
              attributes: ['nombre', 'segundo_nombre', 'apellido', 'segundo_apellido'],
              required: false
            },
            {
              model: JuridicalClient,
              as: 'persona_juridica',
              attributes: ['razon_social', 'nit', 'representante_legal'],
              required: false
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      distinct: true, // Importante para el count correcto con includes
      subQuery: false
    });

    return {
      pedidos: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    };
  } catch (error) {
    console.error('Error al listar pedidos:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 LISTAR PEDIDOS DE UN CLIENTE ESPECÍFICO
 * ============================================================
 */
export const findPedidosByClienteId = async (clientId, userId, options = {}) => {
  const {
    page = 1,
    limit = 10,
    estado = null
  } = options;

  const offset = (page - 1) * limit;

  const whereClause = {
    cliente_id: clientId
  };

  if (estado) {
    whereClause.estado = estado;
  }

  try {
    const { count, rows } = await Pedido.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Client,
          as: 'cliente',
          where: { user_id: userId }, // Validar que el cliente pertenece al usuario
          include: [
            {
              model: NaturalClient,
              as: 'persona_natural',
              required: false
            },
            {
              model: JuridicalClient,
              as: 'persona_juridica',
              required: false
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      distinct: true
    });

    return {
      pedidos: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    };
  } catch (error) {
    console.error('Error al listar pedidos del cliente:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 ACTUALIZAR PEDIDO
 * ============================================================
 */
export const updatePedido = async (orderId, orderData, userId) => {
  try {
    // Primero verificar que el pedido pertenece a un cliente del usuario
    const pedido = await findPedidoByIdAndUserId(orderId, userId);
    
    if (!pedido) {
      return null;
    }

    const [updated] = await Pedido.update(orderData, {
      where: { id: orderId }
    });

    if (updated === 0) {
      return null;
    }

    const updatedOrder = await findPedidoById(orderId, userId);
    return updatedOrder;
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 CAMBIAR ESTADO DEL PEDIDO
 * ============================================================
 */
export const updatePedidoStatus = async (orderId, estado, userId) => {
  try {
    // Validar que el estado sea válido
    const estadosValidos = ['preparando', 'enviado', 'entregado'];
    if (!estadosValidos.includes(estado)) {
      throw new Error('Estado inválido');
    }

    // Verificar que el pedido pertenece a un cliente del usuario
    const pedido = await findPedidoByIdAndUserId(orderId, userId);
    
    if (!pedido) {
      return null;
    }

    const [updated] = await Pedido.update(
      { estado },
      { where: { id: orderId } }
    );

    if (updated === 0) {
      return null;
    }

    const updatedOrder = await findPedidoById(orderId, userId);
    return updatedOrder;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 ELIMINAR PEDIDO (Hard Delete)
 * ============================================================
 */
export const deletePedido = async (orderId, userId) => {
  try {
    // Verificar que el pedido pertenece a un cliente del usuario
    const pedido = await findPedidoByIdAndUserId(orderId, userId);
    
    if (!pedido) {
      return false;
    }

    const deleted = await Pedido.destroy({
      where: { id: orderId }
    });

    return deleted > 0;
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 OBTENER ESTADÍSTICAS DE PEDIDOS
 * ============================================================
 */
export const getPedidoStatsByUserId = async (userId, options = {}) => {
  const { startDate, endDate } = options;

  const whereClause = {};

  if (startDate && endDate) {
    whereClause.created_at = {
      [Op.between]: [startDate, endDate]
    };
  }

  try {
    const stats = await Pedido.findAll({
      where: whereClause,
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('Pedido.id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('monto_total_pagado')), 'total_amount']
      ],
      include: [
        {
          model: Client,
          as: 'cliente',
          where: { user_id: userId },
          attributes: [],
          required: true
        }
      ],
      group: ['estado'],
      raw: true
    });

    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 VERIFICAR SI EL CLIENTE TIENE PEDIDOS
 * ============================================================
 */
export const hasOrdersByClientId = async (clientId) => {
  try {
    const count = await Pedido.count({
      where: {
        cliente_id: clientId
      }
    });

    return count > 0;
  } catch (error) {
    console.error('Error al verificar pedidos del cliente:', error);
    throw error;
  }
};

/**
 * ============================================================
 * 🟣 OBTENER RESUMEN DE PEDIDOS POR ESTADO
 * ============================================================
 */
export const getPedidosSummaryByUserId = async (userId) => {
  try {
    const summary = await Pedido.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('Pedido.id')), 'cantidad'],
        [sequelize.fn('SUM', sequelize.col('monto_total_pagado')), 'monto_total'],
        [sequelize.fn('SUM', sequelize.col('monto_recibido_sin_iva')), 'monto_sin_iva']
      ],
      include: [
        {
          model: Client,
          as: 'cliente',
          where: { 
            user_id: userId,
            state: true // Solo clientes activos
          },
          attributes: [],
          required: true
        }
      ],
      group: ['estado'],
      raw: true
    });

    return summary;
  } catch (error) {
    console.error('Error al obtener resumen de pedidos:', error);
    throw error;
  }
};

export default {
  createPedido,
  findPedidoById,
  findPedidosByUserId,
  findPedidosByClienteId,
  updatePedido,
  updatePedidoStatus,
  deletePedido,
  hasOrdersByClientId,
  getPedidoStatsByUserId,
  findPedidoByIdAndUserId,
  getPedidosSummaryByUserId
};