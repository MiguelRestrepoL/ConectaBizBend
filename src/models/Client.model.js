import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { NaturalClient } from './NaturalClient.model.js';
import { JuridicalClient } from './JuridicalClient.js';

class Client extends Model {}

Client.init(
  {
    tipo_cliente: {
      type: DataTypes.ENUM('persona_natural', 'persona_juridica'),
      allowNull: false
    },
    correo_electronico: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue('correo_electronico', value ? value.toLowerCase().trim() : value);
      }
    },
    numero_telefono: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    codigo_pais_telefono: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '+57'
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    direccion: DataTypes.STRING(255),
    ciudad: DataTypes.STRING(100),
    pais_residencia: DataTypes.STRING(100),
    departamento_estado: DataTypes.STRING(100),
    codigo_postal: DataTypes.STRING(20),
    recaudar_impuestos: {
      type: DataTypes.ENUM('recaudar', 'recaudar_con_excepcion', 'no_recaudar'),
      allowNull: false,
      defaultValue: 'recaudar'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

// 👉 Asociación
Client.associate = (models) => {
  Client.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

export { Client };

