import {
  createProductoService,
  getProductoByIdService,
  getProductosByUserIdService,
  updateProductoService,
  deleteProductoService,
  updateProductoStockService,
  getProductosStockBajoService,
  validateProductoData
} from '../services/producto.service.js';

export const createProducto = async (req, res) => {
  try {
    const productoData = req.body;
    const userId = req.user.id;

    // Validar datos del producto
    const validationErrors = validateProductoData(productoData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Datos de producto inválidos',
        details: validationErrors
      });
    }

    const producto = await createProductoService(productoData, userId);
    return res.status(201).json({
      message: 'Producto creado exitosamente',
      producto
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const producto = await getProductoByIdService(id, userId);
    return res.json(producto);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

export const getProductos = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      search = '',
      includeInactive,
      proveedorId
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.trim(),
      includeInactive: includeInactive === 'true',
      proveedorId: proveedorId ? parseInt(proveedorId) : null
    };

    const result = await getProductosByUserIdService(userId, options);
    return res.json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoData = req.body;
    const userId = req.user.id;

    // Validar datos del producto
    const validationErrors = validateProductoData(productoData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Datos de producto inválidos',
        details: validationErrors
      });
    }

    const producto = await updateProductoService(id, productoData, userId);
    return res.json({
      message: 'Producto actualizado exitosamente',
      producto
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await deleteProductoService(id, userId);
    return res.json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, operation = 'subtract' } = req.body;
    const userId = req.user.id;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({
        error: 'La cantidad debe ser un número positivo'
      });
    }

    if (!['subtract', 'add', 'set'].includes(operation)) {
      return res.status(400).json({
        error: 'La operación debe ser: subtract, add o set'
      });
    }

    const producto = await updateProductoStockService(id, cantidad, operation, userId);
    return res.json({
      message: 'Stock actualizado exitosamente',
      producto
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

export const getProductosStockBajo = async (req, res) => {
  try {
    const userId = req.user.id;

    const productos = await getProductosStockBajoService(userId);
    return res.json({
      productos,
      total: productos.length
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      error: error.message || 'Error interno del servidor'
    });
  }
};

