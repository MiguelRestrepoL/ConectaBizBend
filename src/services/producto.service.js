import {
  createProducto,
  findProductoById,
  findProductosByUserId,
  updateProducto,
  deleteProducto,
  updateProductoStock,
  findProductoByCodigo,
  findProductosStockBajo
} from '../repository/producto.repository.js';
import { findClientById } from '../repository/client.repository.js';
import { logAudit } from './audit.service.js';

export const createProductoService = async (productoData, userId) => {
  // Validar que el código no esté duplicado para este usuario (si se proporciona)
  if (productoData.codigo) {
    const existingProducto = await findProductoByCodigo(productoData.codigo, userId);
    if (existingProducto) {
      const error = new Error('Ya existe un producto con este código');
      error.status = 409;
      throw error;
    }
  }

  // Si se proporciona un proveedor, verificar que pertenece al usuario
  if (productoData.proveedor_id) {
    const proveedor = await findClientById(productoData.proveedor_id);
    if (!proveedor) {
      const error = new Error('Proveedor no encontrado');
      error.status = 404;
      throw error;
    }

    if (proveedor.user_id !== userId) {
      const error = new Error('No tienes permisos para asignar este proveedor');
      error.status = 403;
      throw error;
    }
  }

  // Agregar el user_id a los datos del producto
  const productoWithUserId = {
    ...productoData,
    user_id: userId
  };

  const producto = await createProducto(productoWithUserId);

  // Auditoría: creación de producto
  try {
    await logAudit({
      userId,
      entityType: 'producto',
      entityId: producto.id,
      action: 'create',
      metadata: {
        nombre: producto.nombre,
        codigo: producto.codigo,
        precio: producto.precio,
        stock: producto.stock
      }
    });
  } catch (_e) {
    // Evitar que falle la creación por error de auditoría
  }

  return producto;
};

export const getProductoByIdService = async (id, userId) => {
  const producto = await findProductoById(id);

  if (!producto) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  // Verificar que el producto pertenece al usuario
  if (producto.user_id !== userId) {
    const error = new Error('No tienes permisos para acceder a este producto');
    error.status = 403;
    throw error;
  }

  return producto;
};

export const getProductosByUserIdService = async (userId, options = {}) => {
  const result = await findProductosByUserId(userId, options);
  return result;
};

export const updateProductoService = async (id, productoData, userId) => {
  const producto = await findProductoById(id);

  if (!producto) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  // Verificar que el producto pertenece al usuario
  if (producto.user_id !== userId) {
    const error = new Error('No tienes permisos para modificar este producto');
    error.status = 403;
    throw error;
  }

  // Si se está actualizando el código, verificar que no esté duplicado
  if (productoData.codigo && productoData.codigo !== producto.codigo) {
    const existingProducto = await findProductoByCodigo(productoData.codigo, userId);
    if (existingProducto && existingProducto.id !== id) {
      const error = new Error('Ya existe un producto con este código');
      error.status = 409;
      throw error;
    }
  }

  // Si se está actualizando el proveedor, verificar que pertenece al usuario
  if (productoData.proveedor_id && productoData.proveedor_id !== producto.proveedor_id) {
    const proveedor = await findClientById(productoData.proveedor_id);
    if (!proveedor) {
      const error = new Error('Proveedor no encontrado');
      error.status = 404;
      throw error;
    }

    if (proveedor.user_id !== userId) {
      const error = new Error('No tienes permisos para asignar este proveedor');
      error.status = 403;
      throw error;
    }
  }

  const updatedProducto = await updateProducto(id, productoData);
  return updatedProducto;
};

export const deleteProductoService = async (id, userId) => {
  const producto = await findProductoById(id);

  if (!producto) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  // Verificar que el producto pertenece al usuario
  if (producto.user_id !== userId) {
    const error = new Error('No tienes permisos para eliminar este producto');
    error.status = 403;
    throw error;
  }

  const deletedProducto = await deleteProducto(id);
  return deletedProducto;
};

export const updateProductoStockService = async (id, cantidad, operation, userId) => {
  const producto = await findProductoById(id);

  if (!producto) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  // Verificar que el producto pertenece al usuario
  if (producto.user_id !== userId) {
    const error = new Error('No tienes permisos para modificar este producto');
    error.status = 403;
    throw error;
  }

  const updatedProducto = await updateProductoStock(id, cantidad, operation);
  return updatedProducto;
};

export const getProductosStockBajoService = async (userId) => {
  const productos = await findProductosStockBajo(userId);
  return productos;
};

export const validateProductoData = (productoData) => {
  const errors = [];

  // Validaciones obligatorias
  if (!productoData.nombre || productoData.nombre.trim() === '') {
    errors.push('El nombre es obligatorio');
  }

  if (productoData.precio === undefined || productoData.precio === null) {
    errors.push('El precio es obligatorio');
  } else if (isNaN(productoData.precio) || productoData.precio < 0) {
    errors.push('El precio debe ser un número positivo o cero');
  }

  if (productoData.stock !== undefined && productoData.stock !== null) {
    if (!Number.isInteger(Number(productoData.stock)) || Number(productoData.stock) < 0) {
      errors.push('El stock debe ser un número entero positivo o cero');
    }
  }

  if (productoData.stock_minimo !== undefined && productoData.stock_minimo !== null) {
    if (!Number.isInteger(Number(productoData.stock_minimo)) || Number(productoData.stock_minimo) < 0) {
      errors.push('El stock mínimo debe ser un número entero positivo o cero');
    }
  }

  // Validar proveedor_id si se proporciona
  if (productoData.proveedor_id !== undefined && productoData.proveedor_id !== null) {
    if (!Number.isInteger(Number(productoData.proveedor_id)) || Number(productoData.proveedor_id) <= 0) {
      errors.push('El ID del proveedor debe ser un número entero positivo');
    }
  }

  return errors;
};

