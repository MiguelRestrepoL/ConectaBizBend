import { Op } from 'sequelize';
import { Cupon } from '../models/Cupon.model.js';
import { Promocion } from '../models/Promocion.model.js';
import { Producto } from '../models/Producto.model.js';
 
/* ============================================================
   CUPONES
   ============================================================ */
 
export const createCupon = async (data) => {
  return await Cupon.create(data);
};
 
export const findCuponesByUserId = async (userId, { page = 1, limit = 10, search = '', activo } = {}) => {
  const offset = (page - 1) * limit;
  const where = { user_id: userId };
 
  if (search) {
    where.codigo = { [Op.iLike]: `%${search}%` };
  }
  if (activo !== undefined) {
    where.activo = activo;
  }
 
  const { count, rows } = await Cupon.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });
 
  return { total: count, cupones: rows, page, limit };
};
 
export const findCuponById = async (id) => {
  return await Cupon.findByPk(id);
};
 
export const findCuponByCodigo = async (codigo, userId) => {
  return await Cupon.findOne({ where: { codigo, user_id: userId } });
};
 
export const updateCupon = async (id, data) => {
  await Cupon.update(data, { where: { id } });
  return await Cupon.findByPk(id);
};
 
export const deleteCupon = async (id) => {
  const cupon = await Cupon.findByPk(id);
  await cupon.destroy();
  return cupon;
};
 
/* ============================================================
   PROMOCIONES
   ============================================================ */
 
export const createPromocion = async (data, productoIds = []) => {
  const promocion = await Promocion.create(data);
  if (productoIds.length > 0) {
    await promocion.setProductos(productoIds);
  }
  return await Promocion.findByPk(promocion.id, {
    include: [{ model: Producto, as: 'productos', attributes: ['id', 'nombre'] }]
  });
};
 
export const findPromocionesByUserId = async (userId, { page = 1, limit = 10, search = '', activa } = {}) => {
  const offset = (page - 1) * limit;
  const where = { user_id: userId };
 
  if (search) {
    where.nombre = { [Op.iLike]: `%${search}%` };
  }
  if (activa !== undefined) {
    where.activa = activa;
  }
 
  const { count, rows } = await Promocion.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    include: [{ model: Producto, as: 'productos', attributes: ['id', 'nombre'] }]
  });
 
  return { total: count, promociones: rows, page, limit };
};
 
export const findPromocionById = async (id) => {
  return await Promocion.findByPk(id, {
    include: [{ model: Producto, as: 'productos', attributes: ['id', 'nombre'] }]
  });
};
 
export const updatePromocion = async (id, data, productoIds) => {
  await Promocion.update(data, { where: { id } });
  const promocion = await Promocion.findByPk(id, {
    include: [{ model: Producto, as: 'productos', attributes: ['id', 'nombre'] }]
  });
  if (productoIds !== undefined) {
    await promocion.setProductos(productoIds);
  }
  return await Promocion.findByPk(id, {
    include: [{ model: Producto, as: 'productos', attributes: ['id', 'nombre'] }]
  });
};
 
export const deletePromocion = async (id) => {
  const promocion = await Promocion.findByPk(id);
  await promocion.destroy();
  return promocion;
};