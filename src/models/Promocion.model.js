import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../config/database.js';
 
class Promocion extends Model {}
 
Promocion.init(
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
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tipo_descuento: {
      type: DataTypes.ENUM('porcentaje', 'fijo'),
      allowNull: false
    },
    valor_descuento: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    activa: {
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
    modelName: 'Promocion',
    tableName: 'promociones',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['activa'] }
    ]
  }
);
 
Promocion.associate = (models) => {
  Promocion.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Promocion.belongsToMany(models.Producto, {
    through: 'promocion_productos',
    foreignKey: 'promocion_id',
    otherKey: 'producto_id',
    as: 'productos'
  });
};
 
export { Promocion };