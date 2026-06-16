import { Op } from 'sequelize';
import { Proveedor } from '../models/Proveedor.model.js';
 
export const createProveedor = async (data) => {
  return Proveedor.create(data);
};
 
export const findProveedorById = async (id) => {
  return Proveedor.findByPk(id);
};
 
export const findProveedoresByUserId = async (userId, options = {}) => {
  const { page = 1, limit = 20, search = '', includeInactive = false } = options;
  const offset = (page - 1) * limit;
 
  const where = { user_id: userId };
  if (!includeInactive) where.activo = true;
  if (search) {
    where[Op.or] = [
      { nombre:   { [Op.iLike]: `%${search}%` } },
      { contacto: { [Op.iLike]: `%${search}%` } },
      { correo:   { [Op.iLike]: `%${search}%` } },
      { ciudad:   { [Op.iLike]: `%${search}%` } },
    ];
  }
 
  const { count, rows } = await Proveedor.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['nombre', 'ASC']],
  });
 
  return {
    proveedores: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
  };
};
 
export const updateProveedor = async (id, data) => {
  const [updated] = await Proveedor.update(data, { where: { id } });
  if (updated === 0) return null;
  return findProveedorById(id);
};
 
// Soft delete
export const deleteProveedor = async (id) => {
  const [updated] = await Proveedor.update({ activo: false }, { where: { id } });
  return updated > 0;
};