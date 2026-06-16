import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
 
class Producto extends Model {}
 
Producto.init(
  {
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: true },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { isDecimal: true, min: 0 },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isInt: true, min: 0 },
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: { isInt: true, min: 0 },
    },
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    // ✅ Ahora apunta a la tabla proveedores, no a clients
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'proveedores', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['proveedor_id'] },
      { fields: ['codigo'] },
      { fields: ['estado'] },
    ],
  }
);
 
Producto.associate = (models) => {
  Producto.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'usuario',
  });
 
  // ✅ Ahora apunta a Proveedor, no a Client
  Producto.belongsTo(models.Proveedor, {
    foreignKey: 'proveedor_id',
    as: 'proveedor',
  });
 
  Producto.belongsToMany(models.Pedido, {
    through: models.PedidoProducto,
    foreignKey: 'producto_id',
    otherKey: 'pedido_id',
    as: 'pedidos',
  });
};
 
export { Producto };