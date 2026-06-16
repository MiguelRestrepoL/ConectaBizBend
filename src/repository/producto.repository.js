import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Producto } from '../models/Producto.model.js';
import { User } from '../models/User.model.js';
import { Proveedor } from '../models/Proveedor.model.js';
 
// Include reutilizable para proveedor
const includeProveedor = {
  model: Proveedor,
  as: 'proveedor',
  attributes: ['id', 'nombre', 'contacto', 'correo', 'telefono', 'ciudad', 'pais'],
  required: false,
};
 
/* ============================================================
   🟢 CREAR PRODUCTO
   ============================================================ */
export const createProducto = async (productoData) => {
  return Producto.create(productoData);
};
 
/* ============================================================
   🔵 OBTENER PRODUCTO POR ID
   ============================================================ */
export const findProductoById = async (id) => {
  return Producto.findByPk(id, {
    include: [
      { model: User, as: 'usuario', attributes: ['id', 'username', 'email'] },
      includeProveedor,
    ],
  });
};
 
/* ============================================================
   🟣 LISTAR PRODUCTOS DE UN USUARIO (con paginación y búsqueda)
   ============================================================ */
export const findProductosByUserId = async (userId, options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    includeInactive = false,
    proveedorId = null,
  } = options;
 
  const offset = (page - 1) * limit;
  const where = { user_id: userId };
 
  if (!includeInactive) where.estado = true;
  if (proveedorId) where.proveedor_id = proveedorId;
  if (search) {
    where[Op.or] = [
      { nombre:      { [Op.iLike]: `%${search}%` } },
      { descripcion: { [Op.iLike]: `%${search}%` } },
      { codigo:      { [Op.iLike]: `%${search}%` } },
    ];
  }
 
  const { count, rows } = await Producto.findAndCountAll({
    where,
    include: [
      { model: User, as: 'usuario', attributes: ['id', 'username', 'email'] },
      includeProveedor,
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']],
  });
 
  return {
    productos: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
  };
};
 
/* ============================================================
   🟡 ACTUALIZAR PRODUCTO
   ============================================================ */
export const updateProducto = async (id, productoData) => {
  const [updated] = await Producto.update(productoData, { where: { id } });
  if (updated === 0) return null;
  return findProductoById(id);
};
 
/* ============================================================
   🔴 ELIMINAR PRODUCTO (Soft Delete)
   ============================================================ */
export const deleteProducto = async (id) => {
  const [updated] = await Producto.update({ estado: false }, { where: { id } });
  return updated > 0;
};
 
/* ============================================================
   🟠 ACTUALIZAR STOCK DEL PRODUCTO
   ============================================================ */
export const updateProductoStock = async (id, cantidad, operation = 'subtract') => {
  const producto = await Producto.findByPk(id);
  if (!producto) return null;
 
  let nuevoStock;
  if (operation === 'subtract') {
    nuevoStock = producto.stock - cantidad;
    if (nuevoStock < 0) throw new Error('Stock insuficiente');
  } else if (operation === 'add') {
    nuevoStock = producto.stock + cantidad;
  } else {
    nuevoStock = cantidad; // 'set'
  }
 
  const [updated] = await Producto.update({ stock: nuevoStock }, { where: { id } });
  if (updated === 0) return null;
  return findProductoById(id);
};
 
/* ============================================================
   🔵 OBTENER PRODUCTO POR CÓDIGO Y USUARIO
   ============================================================ */
export const findProductoByCodigo = async (codigo, userId) => {
  return Producto.findOne({
    where: { codigo, user_id: userId },
    include: [includeProveedor],
  });
};
 
/* ============================================================
   🟢 OBTENER PRODUCTOS CON STOCK BAJO
   ============================================================ */
export const findProductosStockBajo = async (userId) => {
  return Producto.findAll({
    where: {
      user_id: userId,
      estado: true,
      [Op.and]: [sequelize.literal('stock <= stock_minimo')],
    },
    include: [includeProveedor],
    order: [['stock', 'ASC']],
  });
};