import { fn, col, literal } from 'sequelize';
import { Pedido } from '../models/Pedido.model.js';
import { Client } from '../models/Client.model.js';
import { NaturalClient } from '../models/NaturalClient.model.js';
import { JuridicalClient } from '../models/JuridicalClient.js';
 
export const getTopClientesRepository = async (userId, { limit = 10, fechaInicio, fechaFin } = {}) => {
  const pedidoWhere = {};
  if (fechaInicio || fechaFin) {
    pedidoWhere.created_at = {};
    if (fechaInicio) pedidoWhere.created_at['$gte'] = new Date(fechaInicio);
    if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      pedidoWhere.created_at['$lte'] = fin;
    }
  }
 
  const rows = await Client.findAll({
    attributes: [
      'id',
      'tipo_cliente',
      'correo_electronico',
      'numero_telefono',
      'ciudad',
      [fn('COUNT', col('pedidos.id')), 'total_pedidos'],
      [fn('SUM', col('pedidos.monto_total_pagado')), 'monto_total'],
      [fn('MAX', col('pedidos.created_at')), 'ultimo_pedido'],
    ],
    where: { user_id: userId, state: true },
    include: [
      {
        model: Pedido,
        as: 'pedidos',
        attributes: [],
        where: Object.keys(pedidoWhere).length ? pedidoWhere : undefined,
        required: true,
      },
      {
        model: NaturalClient,
        as: 'persona_natural',
        attributes: ['nombre', 'apellido'],
        required: false,
      },
      {
        model: JuridicalClient,
        as: 'persona_juridica',
        attributes: ['razon_social'],
        required: false,
      },
    ],
    group: [
      'Client.id',
      'persona_natural.client_id',
      'persona_juridica.client_id',
    ],
    order: [[literal('"monto_total"'), 'DESC NULLS LAST']],
    limit,
    subQuery: false,
  });
 
  return rows.map((r, index) => {
    const dv = r.dataValues;
    const esNatural = r.tipo_cliente === 'persona_natural';
    const nombre = esNatural
      ? `${r.persona_natural?.nombre || ''} ${r.persona_natural?.apellido || ''}`.trim()
      : r.persona_juridica?.razon_social || 'Sin nombre';
 
    const monto = parseFloat(dv.monto_total || 0);
    // Badge por posición
    let badge = null;
    if (index === 0) badge = 'oro';
    else if (index === 1) badge = 'plata';
    else if (index === 2) badge = 'bronce';
 
    return {
      id: r.id,
      nombre,
      tipo_cliente: r.tipo_cliente,
      correo_electronico: r.correo_electronico,
      numero_telefono: r.numero_telefono,
      ciudad: r.ciudad,
      total_pedidos: parseInt(dv.total_pedidos || 0),
      monto_total: monto,
      ultimo_pedido: dv.ultimo_pedido,
      badge,
    };
  });
};