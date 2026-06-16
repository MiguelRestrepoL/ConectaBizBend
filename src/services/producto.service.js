import {
  createProducto,
  findProductoById,
  findProductosByUserId,
  updateProducto,
  deleteProducto,
  updateProductoStock,
  findProductoByCodigo,
  findProductosStockBajo,
} from '../repository/producto.repository.js';
import { findProveedorById } from '../repository/proveedor.repository.js';
import { logAudit } from './audit.service.js';
 
/* ── Helper: valida que el proveedor exista y pertenezca al usuario ── */
const validarProveedor = async (proveedorId, userId) => {
  const proveedor = await findProveedorById(proveedorId);
  if (!proveedor) {
    const e = new Error('Proveedor no encontrado'); e.status = 404; throw e;
  }
  if (proveedor.user_id !== userId) {
    const e = new Error('No tienes permisos para asignar este proveedor'); e.status = 403; throw e;
  }
  return proveedor;
};
 
export const createProductoService = async (productoData, userId) => {
  const errors = validateProductoData(productoData);
  if (errors.length > 0) {
    const e = new Error(errors.join(', ')); e.status = 400; throw e;
  }
 
  if (productoData.codigo) {
    const existing = await findProductoByCodigo(productoData.codigo, userId);
    if (existing) {
      const e = new Error('Ya existe un producto con este código'); e.status = 409; throw e;
    }
  }
 
  if (productoData.proveedor_id) {
    await validarProveedor(productoData.proveedor_id, userId);
  }
 
  const producto = await createProducto({ ...productoData, user_id: userId });
 
  try {
    await logAudit({
      userId,
      entityType: 'producto',
      entityId: producto.id,
      action: 'create',
      metadata: { nombre: producto.nombre, codigo: producto.codigo, precio: producto.precio, stock: producto.stock },
    });
  } catch (_e) {}
 
  return producto;
};
 
export const getProductoByIdService = async (id, userId) => {
  const producto = await findProductoById(id);
  if (!producto) { const e = new Error('Producto no encontrado'); e.status = 404; throw e; }
  if (producto.user_id !== userId) { const e = new Error('No tienes permisos para acceder a este producto'); e.status = 403; throw e; }
  return producto;
};
 
export const getProductosByUserIdService = async (userId, options = {}) => {
  return findProductosByUserId(userId, options);
};
 
export const updateProductoService = async (id, productoData, userId) => {
  const producto = await findProductoById(id);
  if (!producto) { const e = new Error('Producto no encontrado'); e.status = 404; throw e; }
  if (producto.user_id !== userId) { const e = new Error('No tienes permisos para modificar este producto'); e.status = 403; throw e; }
 
  if (productoData.codigo && productoData.codigo !== producto.codigo) {
    const existing = await findProductoByCodigo(productoData.codigo, userId);
    if (existing && existing.id !== id) {
      const e = new Error('Ya existe un producto con este código'); e.status = 409; throw e;
    }
  }
 
  if (productoData.proveedor_id && productoData.proveedor_id !== producto.proveedor_id) {
    await validarProveedor(productoData.proveedor_id, userId);
  }
 
  const updated = await updateProducto(id, productoData);
 
  try {
    await logAudit({
      userId,
      entityType: 'producto',
      entityId: id,
      action: 'update',
      metadata: { nombre: productoData.nombre || producto.nombre, cambios: Object.keys(productoData) },
    });
  } catch (_e) {}
 
  return updated;
};
 
export const deleteProductoService = async (id, userId) => {
  const producto = await findProductoById(id);
  if (!producto) { const e = new Error('Producto no encontrado'); e.status = 404; throw e; }
  if (producto.user_id !== userId) { const e = new Error('No tienes permisos para eliminar este producto'); e.status = 403; throw e; }
 
  const result = await deleteProducto(id);
 
  try {
    await logAudit({
      userId,
      entityType: 'producto',
      entityId: id,
      action: 'delete',
      metadata: { nombre: producto.nombre, codigo: producto.codigo },
    });
  } catch (_e) {}
 
  return result;
};
 
export const updateProductoStockService = async (id, cantidad, operation, userId) => {
  const producto = await findProductoById(id);
  if (!producto) { const e = new Error('Producto no encontrado'); e.status = 404; throw e; }
  if (producto.user_id !== userId) { const e = new Error('No tienes permisos para modificar este producto'); e.status = 403; throw e; }
 
  const updated = await updateProductoStock(id, cantidad, operation);
 
  try {
    await logAudit({
      userId,
      entityType: 'producto',
      entityId: id,
      action: 'update_stock',
      metadata: { nombre: producto.nombre, operacion: operation, cantidad, stock_anterior: producto.stock },
    });
  } catch (_e) {}
 
  return updated;
};
 
export const getProductosStockBajoService = async (userId) => {
  return findProductosStockBajo(userId);
};
 
export const validateProductoData = (productoData) => {
  const errors = [];
  if (!productoData.nombre || productoData.nombre.trim() === '') errors.push('El nombre es obligatorio');
  if (productoData.precio === undefined || productoData.precio === null) {
    errors.push('El precio es obligatorio');
  } else if (isNaN(productoData.precio) || productoData.precio < 0) {
    errors.push('El precio debe ser un número positivo o cero');
  }
  if (productoData.stock !== undefined && productoData.stock !== null) {
    if (!Number.isInteger(Number(productoData.stock)) || Number(productoData.stock) < 0)
      errors.push('El stock debe ser un número entero positivo o cero');
  }
  if (productoData.stock_minimo !== undefined && productoData.stock_minimo !== null) {
    if (!Number.isInteger(Number(productoData.stock_minimo)) || Number(productoData.stock_minimo) < 0)
      errors.push('El stock mínimo debe ser un número entero positivo o cero');
  }
  if (productoData.proveedor_id !== undefined && productoData.proveedor_id !== null) {
    if (!Number.isInteger(Number(productoData.proveedor_id)) || Number(productoData.proveedor_id) <= 0)
      errors.push('El ID del proveedor debe ser un número entero positivo');
  }
  return errors;
};
 