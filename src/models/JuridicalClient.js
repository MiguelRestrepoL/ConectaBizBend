import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class JuridicalClient extends Model {}

JuridicalClient.init(
  {
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'clients', key: 'id' },
      onDelete: 'CASCADE'
    },
    razon_social: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    digito_verificacion: DataTypes.STRING(1),
    representante_legal: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cedula_representante: DataTypes.STRING(20),
    tipo_empresa: DataTypes.STRING(50),
    actividad_economica: DataTypes.STRING(500),
    codigo_ciiu: DataTypes.STRING(10),
    fecha_constitucion: DataTypes.DATEONLY,
    capital_social: DataTypes.DECIMAL(15, 2)
  },
  {
    sequelize,
    modelName: 'JuridicalClient',
    tableName: 'juridical_clients',
    timestamps: false
  }
);

export { JuridicalClient };
