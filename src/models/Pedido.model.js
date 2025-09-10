const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Pedido extends Model {}

Pedido.init(
  {
    titulo: {
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
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    estado: {
      type: DataTypes.ENUM('preparando', 'enviado', 'entregado'),
      allowNull: false,
      defaultValue: 'preparando',
      validate: {
        isIn: [['preparando', 'enviado', 'entregado']]
      }
    },
    monto_total_pagado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    monto_recibido_sin_iva: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedidos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['cliente_id']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['fecha_entrega']
      }
    ]
  }
);

// Definir las asociaciones después de importar todos los modelos
Pedido.associate = (models) => {
  // Un pedido pertenece a un cliente
  Pedido.belongsTo(models.Client, {
    foreignKey: 'cliente_id',
    as: 'cliente'
  });
};

module.exports = { Pedido };
