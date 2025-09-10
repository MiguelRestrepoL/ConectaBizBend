import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Client extends Model {}

Client.init(
  {
    // Información personal
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    apellido: {
      type: DataTypes.STRING(100),  
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    segundo_nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    segundo_apellido: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nacionalidad: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    idioma: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Español',
      validate: {
        notEmpty: true
      }
    },
    correo_electronico: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      set(value) {
        this.setDataValue('correo_electronico', value ? value.toLowerCase().trim() : value);
      }
    },
    numero_telefono: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    codigo_pais_telefono: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '+57',
      validate: {
        notEmpty: true
      }
    },
    
    // Preferencias de marketing
    recibe_emails_marketing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    recibe_sms_marketing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    
    // Información de dirección
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pais_residencia: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    apartamento_local: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    codigo_postal: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    departamento_estado: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono_residencia: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    codigo_pais_residencia: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: '+57'
    },
    
    // Información fiscal
    recaudar_impuestos: {
      type: DataTypes.ENUM('recaudar', 'recaudar_con_excepcion', 'no_recaudar'),
      allowNull: false,
      defaultValue: 'recaudar',
      validate: {
        isIn: [['recaudar', 'recaudar_con_excepcion', 'no_recaudar']]
      }
    },
    
    // Relación con User
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    
    // Timestamps
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
    modelName: 'Client',
    tableName: 'clients',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['correo_electronico']
      }
    ]
  }
);

// Definir las asociaciones después de importar todos los modelos
Client.associate = (models) => {
  // Un cliente pertenece a un usuario
  Client.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  
  // Un cliente puede tener muchos pedidos
  Client.hasMany(models.Pedido, {
    foreignKey: 'cliente_id',
    as: 'pedidos'
  });
};

export { Client };
