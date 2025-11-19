import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Producto } from '../models/Producto.model.js';
import { Client } from '../models/Client.model.js';
import { User } from '../models/User.model.js';
import { NaturalClient } from '../models/NaturalClient.model.js';
import { JuridicalClient } from '../models/JuridicalClient.js';

/* ============================================================
   🟢 CREAR PRODUCTO
   ============================================================ */
export const createProducto = async (productoData) => {
  const producto = await Producto.create(productoData);
  return findProductoById(producto.id);
};

/* ============================================================
   🔵 OBTENER PRODUCTO POR ID
   ============================================================ */
export const findProductoById = async (id) => {
  return Producto.findByPk(id, {
    include: [
      { model: User, as: 'usuario', attributes: ['id', 'username', 'email'] },
      {
        model: Client,
        as: 'proveedor',
        include: [
          { model: NaturalClient, as: 'persona_natural' },
          { model: JuridicalClient, as: 'persona_juridica' }
        ]
      }
    ]
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
    proveedorId = null
  } = options;

  const offset = (page - 1) * limit;

  // Base: siempre filtra por usuario
  const whereClause = { user_id: userId };

  // Si no se quieren incluir los inactivos, filtramos por estado: true
  if (!includeInactive) {
    whereClause.estado = true;
  }

  // Filtro por proveedor si se especifica
  if (proveedorId) {
    whereClause.proveedor_id = proveedorId;
  }

  // Búsqueda textual opcional
  if (search) {
    whereClause[Op.or] = [
      { nombre: { [Op.iLike]: `%${search}%` } },
      { descripcion: { [Op.iLike]: `%${search}%` } },
      { codigo: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Producto.findAndCountAll({
    where: whereClause,
    include: [
      { model: User, as: 'usuario', attributes: ['id', 'username', 'email'] },
      {
        model: Client,
        as: 'proveedor',
        include: [
          { model: NaturalClient, as: 'persona_natural' },
          { model: JuridicalClient, as: 'persona_juridica' }
        ],
        required: false
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    productos: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit)
  };
};

/* ============================================================
   🟡 ACTUALIZAR PRODUCTO
   ============================================================ */
export const updateProducto = async (id, productoData) => {
  const [updated] = await Producto.update(productoData, {
    where: { id }
  });

  if (updated === 0) {
    return null;
  }

  return findProductoById(id);
};

/* ============================================================
   🔴 ELIMINAR PRODUCTO (Soft Delete - cambiar estado)
   ============================================================ */
export const deleteProducto = async (id) => {
  const [updated] = await Producto.update(
    { estado: false },
    { where: { id } }
  );

  return updated > 0;
};

/* ============================================================
   🟠 ACTUALIZAR STOCK DEL PRODUCTO
   ============================================================ */
export const updateProductoStock = async (id, cantidad, operation = 'subtract') => {
  const producto = await Producto.findByPk(id);
  
  if (!producto) {
    return null;
  }

  let nuevoStock;
  if (operation === 'subtract') {
    nuevoStock = producto.stock - cantidad;
    if (nuevoStock < 0) {
      throw new Error('Stock insuficiente');
    }
  } else if (operation === 'add') {
    nuevoStock = producto.stock + cantidad;
  } else {
    nuevoStock = cantidad;
  }

  const [updated] = await Producto.update(
    { stock: nuevoStock },
    { where: { id } }
  );

  if (updated === 0) {
    return null;
  }

  return findProductoById(id);
};

/* ============================================================
   🔵 OBTENER PRODUCTO POR CÓDIGO Y USUARIO
   ============================================================ */
export const findProductoByCodigo = async (codigo, userId) => {
  return Producto.findOne({
    where: {
      codigo: codigo,
      user_id: userId
    },
    include: [
      {
        model: Client,
        as: 'proveedor',
        include: [
          { model: NaturalClient, as: 'persona_natural' },
          { model: JuridicalClient, as: 'persona_juridica' }
        ]
      }
    ]
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
      [Op.and]: [
        sequelize.literal('stock <= stock_minimo')
      ]
    },
    include: [
      {
        model: Client,
        as: 'proveedor',
        include: [
          { model: NaturalClient, as: 'persona_natural' },
          { model: JuridicalClient, as: 'persona_juridica' }
        ]
      }
    ],
    order: [['stock', 'ASC']]
  });
};

