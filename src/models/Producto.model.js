import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Producto extends Model {}

Producto.init(
  {
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0
      }
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0
      }
    },
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: false // Puede ser único por usuario
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'clients', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  },
  {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['proveedor_id']
      },
      {
        fields: ['codigo']
      },
      {
        fields: ['estado']
      }
    ]
  }
);

// Definir las asociaciones después de importar todos los modelos
Producto.associate = (models) => {
  // Un producto pertenece a un usuario
  Producto.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'usuario'
  });

  // Un producto puede tener un proveedor (cliente)
  Producto.belongsTo(models.Client, {
    foreignKey: 'proveedor_id',
    as: 'proveedor'
  });

  // Un producto puede estar en muchos pedidos (relación muchos a muchos)
  Producto.belongsToMany(models.Pedido, {
    through: models.PedidoProducto,
    foreignKey: 'producto_id',
    otherKey: 'pedido_id',
    as: 'pedidos'
  });
};

export { Producto };

