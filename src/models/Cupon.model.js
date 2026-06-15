import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../config/database.js';
 
class Cupon extends Model {}
 
Cupon.init(
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
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: { notEmpty: true }
    },
    tipo: {
      type: DataTypes.ENUM('porcentaje', 'fijo'),
      allowNull: false
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    limite_usos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1 }
    },
    usos_actuales: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'Cupon',
    tableName: 'cupones',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['codigo', 'user_id'], unique: true },
      { fields: ['activo'] }
    ]
  }
);
 
Cupon.associate = (models) => {
  Cupon.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};
 
export { Cupon };