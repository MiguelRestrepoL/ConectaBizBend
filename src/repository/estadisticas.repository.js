import { Op, fn, col, literal } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Pedido } from '../models/Pedido.model.js';
import { Client } from '../models/Client.model.js';
import { Producto } from '../models/Producto.model.js';
import { PedidoProducto } from '../models/PedidoProducto.model.js';

const buildDateWhere = (fechaInicio, fechaFin) => {
  const where = {};
  if (fechaInicio || fechaFin) {
    where.created_at = {};
    if (fechaInicio) where.created_at[Op.gte] = new Date(fechaInicio);
    if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      where.created_at[Op.lte] = fin;
    }
  }
  return where;
};

// ── KPIs DE PEDIDOS ───────────────────────────────────────────────────────────

export const getKPIsPedidos = async (userId, fechaInicio, fechaFin) => {
  const dateWhere = buildDateWhere(fechaInicio, fechaFin);

  const result = await Pedido.findAll({
    attributes: [
      [fn('COUNT', col('Pedido.id')), 'total_pedidos'],
      [fn('SUM', col('monto_total_pagado')), 'ingresos_totales'],
      [fn('AVG', col('monto_total_pagado')), 'ticket_promedio'],
      [
        fn('SUM', literal(`CASE WHEN estado = 'entregado' THEN monto_total_pagado ELSE 0 END`)),
        'ingresos_entregados'
      ],
      [
        fn('COUNT', literal(`CASE WHEN estado = 'preparando' THEN 1 END`)),
        'pedidos_preparando'
      ],
      [
        fn('COUNT', literal(`CASE WHEN estado = 'enviado' THEN 1 END`)),
        'pedidos_enviados'
      ],
      [
        fn('COUNT', literal(`CASE WHEN estado = 'entregado' THEN 1 END`)),
        'pedidos_entregados'
      ],
    ],
    include: [{
      model: Client,
      as: 'cliente',
      attributes: [],
      where: { user_id: userId },
      required: true
    }],
    where: dateWhere,
    raw: true
  });

  return result[0];
};

// ── KPIs DE CLIENTES ──────────────────────────────────────────────────────────

export const getKPIsClientes = async (userId, fechaInicio, fechaFin) => {
  const dateWhere = buildDateWhere(fechaInicio, fechaFin);

  const totalClientes = await Client.count({ where: { user_id: userId } });

  const clientesNuevos = await Client.count({
    where: { user_id: userId, ...dateWhere }
  });

  return { total_clientes: totalClientes, clientes_nuevos: clientesNuevos };
};

// ── VENTAS POR DÍA (para gráfica de línea) ───────────────────────────────────

export const getVentasPorDia = async (userId, fechaInicio, fechaFin) => {
  const dateWhere = buildDateWhere(fechaInicio, fechaFin);

  const rows = await Pedido.findAll({
    attributes: [
      [fn('DATE', col('Pedido.created_at')), 'fecha'],
      [fn('COUNT', col('Pedido.id')), 'total_pedidos'],
      [fn('SUM', col('monto_total_pagado')), 'ingresos'],
    ],
    include: [{
      model: Client,
      as: 'cliente',
      attributes: [],
      where: { user_id: userId },
      required: true
    }],
    where: dateWhere,
    group: [fn('DATE', col('Pedido.created_at'))],
    order: [[fn('DATE', col('Pedido.created_at')), 'ASC']],
    raw: true
  });

  return rows;
};

// ── TOP PRODUCTOS MÁS VENDIDOS ────────────────────────────────────────────────

export const getTopProductos = async (userId, fechaInicio, fechaFin, limit = 5) => {
  const dateWhere = buildDateWhere(fechaInicio, fechaFin);

  const rows = await PedidoProducto.findAll({
    attributes: [
      'producto_id',
      [fn('SUM', col('PedidoProducto.cantidad')), 'total_vendido'],
      [fn('SUM', col('PedidoProducto.subtotal')), 'total_ingresos'],
    ],
    include: [
      {
        model: Pedido,
        as: 'pedido',
        attributes: [],
        where: dateWhere,
        required: true,
        include: [{
          model: Client,
          as: 'cliente',
          attributes: [],
          where: { user_id: userId },
          required: true
        }]
      },
      {
        model: Producto,
        as: 'producto',
        attributes: ['id', 'nombre', 'precio', 'stock'],
        where: { user_id: userId },
        required: true
      }
    ],
    // 🔧 FIX: agregadas producto.nombre, producto.precio y producto.stock
    // porque Postgres exige que toda columna seleccionada (no agregada)
    // esté en el GROUP BY
    group: ['producto_id', 'producto.id', 'producto.nombre', 'producto.precio', 'producto.stock'],
    order: [[fn('SUM', col('PedidoProducto.cantidad')), 'DESC']],
    limit,
    raw: false
  });

  return rows.map(r => ({
    id: r.producto_id,
    nombre: r.producto?.nombre,
    precio: r.producto?.precio,
    stock: r.producto?.stock,
    total_vendido: parseInt(r.dataValues.total_vendido || 0),
    total_ingresos: parseFloat(r.dataValues.total_ingresos || 0)
  }));
};

// ── PEDIDOS RECIENTES ─────────────────────────────────────────────────────────

export const getPedidosRecientes = async (userId, limit = 8) => {
  const rows = await Pedido.findAll({
    include: [{
      model: Client,
      as: 'cliente',
      attributes: ['id', 'correo_electronico'],
      where: { user_id: userId },
      required: true
    }],
    order: [['created_at', 'DESC']],
    limit,
  });

  return rows;
};