import {
  createCupon, findCuponesByUserId, findCuponById, findCuponByCodigo,
  updateCupon, deleteCupon,
  createPromocion, findPromocionesByUserId, findPromocionById,
  updatePromocion, deletePromocion
} from '../repository/marketing.repository.js';
import { logAudit } from './audit.service.js';
 
/* ============================================================
   CUPONES
   ============================================================ */
 
export const createCuponService = async (data, userId) => {
  const existing = await findCuponByCodigo(data.codigo, userId);
  if (existing) {
    const error = new Error('Ya existe un cupón con ese código');
    error.status = 409;
    throw error;
  }
 
  const cupon = await createCupon({ ...data, user_id: userId });
 
  try {
    await logAudit({ userId, entityType: 'cupon', entityId: cupon.id, action: 'create', metadata: { codigo: cupon.codigo, tipo: cupon.tipo, valor: cupon.valor } });
  } catch (_e) {}
 
  return cupon;
};
 
export const getCuponesByUserIdService = async (userId, options) => {
  return await findCuponesByUserId(userId, options);
};
 
export const getCuponByIdService = async (id, userId) => {
  const cupon = await findCuponById(id);
  if (!cupon) { const e = new Error('Cupón no encontrado'); e.status = 404; throw e; }
  if (cupon.user_id !== userId) { const e = new Error('No tienes permisos'); e.status = 403; throw e; }
  return cupon;
};
 
export const updateCuponService = async (id, data, userId) => {
  const cupon = await findCuponById(id);
  if (!cupon) { const e = new Error('Cupón no encontrado'); e.status = 404; throw e; }
  if (cupon.user_id !== userId) { const e = new Error('No tienes permisos'); e.status = 403; throw e; }
 
  if (data.codigo && data.codigo !== cupon.codigo) {
    const existing = await findCuponByCodigo(data.codigo, userId);
    if (existing && existing.id !== id) {
      const e = new Error('Ya existe un cupón con ese código'); e.status = 409; throw e;
    }
  }
 
  return await updateCupon(id, data);
};
 
export const deleteCuponService = async (id, userId) => {
  const cupon = await findCuponById(id);
  if (!cupon) { const e = new Error('Cupón no encontrado'); e.status = 404; throw e; }
  if (cupon.user_id !== userId) { const e = new Error('No tienes permisos'); e.status = 403; throw e; }
  return await deleteCupon(id);
};
 
/* ============================================================
   PROMOCIONES
   ============================================================ */
 
export const createPromocionService = async (data, productoIds = [], userId) => {
  const promocion = await createPromocion({ ...data, user_id: userId }, productoIds);
 
  try {
    await logAudit({ userId, entityType: 'promocion', entityId: promocion.id, action: 'create', metadata: { nombre: promocion.nombre } });
  } catch (_e) {}
 
  return promocion;
};
 
export const getPromocionesByUserIdService = async (userId, options) => {
  return await findPromocionesByUserId(userId, options);
};
 
export const getPromocionByIdService = async (id, userId) => {
  const promocion = await findPromocionById(id);
  if (!promocion) { const e = new Error('Promoción no encontrada'); e.status = 404; throw e; }
  if (promocion.user_id !== userId) { const e = new Error('No tienes permisos'); e.status = 403; throw e; }
  return promocion;
};
 
export const updatePromocionService = async (id, data, productoIds, userId) => {
  const promocion = await findPromocionById(id);
  if (!promocion) { const e = new Error('Promoción no encontrada'); e.status = 404; throw e; }
  if (promocion.user_id !== userId) { const e = new Error('No tienes permisos'); e.status = 403; throw e; }
  return await updatePromocion(id, data, productoIds);
};
 
export const deletePromocionService = async (id, userId) => {
  const promocion = await findPromocionById(id);
  if (!promocion) { const e = new Error('Promoción no encontrada'); e.status = 404; throw e; }
  if (promocion.user_id !== userId) { const e = new Error('No tienes permisos'); e.status = 403; throw e; }
  return await deletePromocion(id);
};
 
export const validateCuponData = (data) => {
  const errors = [];
  if (!data.codigo?.trim()) errors.push('El código es obligatorio');
  if (!data.tipo) errors.push('El tipo es obligatorio (porcentaje o fijo)');
  if (data.valor === undefined || data.valor === null) errors.push('El valor es obligatorio');
  else if (isNaN(data.valor) || data.valor < 0) errors.push('El valor debe ser un número positivo');
  if (data.tipo === 'porcentaje' && data.valor > 100) errors.push('El porcentaje no puede superar 100');
  return errors;
};
 
export const validatePromocionData = (data) => {
  const errors = [];
  if (!data.nombre?.trim()) errors.push('El nombre es obligatorio');
  if (!data.tipo_descuento) errors.push('El tipo de descuento es obligatorio');
  if (data.valor_descuento === undefined || data.valor_descuento === null) errors.push('El valor del descuento es obligatorio');
  else if (isNaN(data.valor_descuento) || data.valor_descuento < 0) errors.push('El valor debe ser un número positivo');
  return errors;
};