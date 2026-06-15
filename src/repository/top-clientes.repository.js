import { fn, col, literal, Op } from 'sequelize';
import { Pedido } from '../models/Pedido.model.js';
import { Client } from '../models/Client.model.js';
import { NaturalClient } from '../models/NaturalClient.model.js';
import { JuridicalClient } from '../models/JuridicalClient.js';
 
export const getTopClientesRepository = async (userId, { limit = 10, fechaInicio, fechaFin } = {}) => {
 
  // ── 1. Construir filtro de fechas sobre pedidos ───────────────────────────
  const pedidoWhere = {};
  if (fechaInicio || fechaFin) {
    pedidoWhere.created_at = {};
    if (fechaInicio) pedidoWhere.created_at[Op.gte] = new Date(fechaInicio);
    if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      pedidoWhere.created_at[Op.lte] = fin;
    }
  }
 
  // ── 2. Query principal: solo columnas propias de Client + agregaciones ────
  //    NO incluimos NaturalClient/JuridicalClient aquí para que el GROUP BY
  //    de Postgres no se queje de columnas no agregadas.
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
    ],
    // Solo las columnas propias de Client van en el GROUP BY → sin conflictos
    group: ['Client.id'],
    order: [[literal('"monto_total"'), 'DESC NULLS LAST']],
    limit,
    subQuery: false,
    raw: true,
  });
 
  if (rows.length === 0) return [];
 
  // ── 3. Buscar nombres en un segundo query (sin GROUP BY, sin problema) ────
  const ids = rows.map((r) => r.id);
 
  const naturales = await NaturalClient.findAll({
    where: { client_id: ids },
    attributes: ['client_id', 'nombre', 'apellido'],
    raw: true,
  });
 
  const juridicas = await JuridicalClient.findAll({
    where: { client_id: ids },
    attributes: ['client_id', 'razon_social'],
    raw: true,
  });
 
  const mapNatural = Object.fromEntries(naturales.map((n) => [n.client_id, n]));
  const mapJuridica = Object.fromEntries(juridicas.map((j) => [j.client_id, j]));
 
  // ── 4. Combinar y devolver ─────────────────────────────────────────────────
  return rows.map((r, index) => {
    const esNatural = r.tipo_cliente === 'persona_natural';
    let nombre;
    if (esNatural) {
      const n = mapNatural[r.id];
      nombre = n ? `${n.nombre} ${n.apellido}`.trim() : 'Sin nombre';
    } else {
      const j = mapJuridica[r.id];
      nombre = j?.razon_social || 'Sin nombre';
    }
 
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
      total_pedidos: parseInt(r.total_pedidos || 0),
      monto_total: parseFloat(r.monto_total || 0),
      ultimo_pedido: r.ultimo_pedido,
      badge,
    };
  });
};