import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../config/database.js';
 
class Audit extends Model {}
 
Audit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    entity_type: {
      type: DataTypes.ENUM('client', 'pedido', 'producto', 'cupon', 'promocion', 'proveedor'),
      allowNull: false
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('create', 'update', 'delete', 'update_stock', 'toggle_estado'),
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'Audit',
    tableName: 'audits',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['entity_type', 'entity_id'] },
      { fields: ['action'] },
      { fields: ['created_at'] }
    ]
  }
);
 
Audit.associate = (models) => {
  Audit.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};
 
export { Audit };

