import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
 
// ── Perfil de tienda (1 por usuario) ─────────────────────────────────────────
class TiendaPerfil extends Model {}
 
TiendaPerfil.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    nombre_tienda: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    slogan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'TiendaPerfil',
    tableName: 'tienda_perfiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
 
TiendaPerfil.associate = (models) => {
  TiendaPerfil.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};
 
export { TiendaPerfil };
 
// ── Anuncios internos (N por usuario) ─────────────────────────────────────────
class Anuncio extends Model {}
 
Anuncio.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // tipo: info, advertencia, promocion
    tipo: {
      type: DataTypes.ENUM('info', 'advertencia', 'promocion'),
      allowNull: false,
      defaultValue: 'info',
    },
  },
  {
    sequelize,
    modelName: 'Anuncio',
    tableName: 'anuncios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ fields: ['user_id'] }, { fields: ['activo'] }],
  }
);
 
Anuncio.associate = (models) => {
  Anuncio.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};
 
export { Anuncio };