import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
 
class Proveedor extends Model {}
 
Proveedor.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    contacto: {
      type: DataTypes.STRING(150),
      allowNull: true, // nombre de la persona de contacto
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: { isEmail: true },
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Proveedor',
    tableName: 'proveedores',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['activo'] },
    ],
  }
);
 
Proveedor.associate = (models) => {
  Proveedor.belongsTo(models.User, { foreignKey: 'user_id', as: 'usuario' });
  Proveedor.hasMany(models.Producto, { foreignKey: 'proveedor_id', as: 'productos' });
};
 
export { Proveedor };