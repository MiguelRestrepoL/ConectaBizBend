import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class PedidoProducto extends Model {}

PedidoProducto.init(
  {
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'pedidos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'productos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1
      }
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    }
  },
  {
    sequelize,
    modelName: 'PedidoProducto',
    tableName: 'pedido_productos',
    timestamps: false
  }
);

// Definir las asociaciones
PedidoProducto.associate = (models) => {
  PedidoProducto.belongsTo(models.Pedido, {
    foreignKey: 'pedido_id',
    as: 'pedido'
  });

  PedidoProducto.belongsTo(models.Producto, {
    foreignKey: 'producto_id',
    as: 'producto'
  });
};

export { PedidoProducto };

