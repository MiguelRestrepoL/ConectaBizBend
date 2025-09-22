import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Client extends Model {}

Client.init(
  {
    // Tipo de cliente
    tipo_cliente: {
      type: DataTypes.ENUM('persona_natural', 'persona_juridica'),
      allowNull: false,
      defaultValue: 'persona_natural',
      validate: {
        isIn: [['persona_natural', 'persona_juridica']]
      }
    },
    
    // Información personal (para persona natural)
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100] // Permitir string vacío pero con longitud máxima
      }
    },
    apellido: {
      type: DataTypes.STRING(100),  
      allowNull: true,
      validate: {
        len: [0, 100] // Permitir string vacío pero con longitud máxima
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
    
    // Información para persona jurídica
    razon_social: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [0, 255] // Permitir string vacío pero con longitud máxima
      }
    },
    nit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      validate: {
        len: [0, 20] // Permitir string vacío pero con longitud máxima
      }
    },
    digito_verificacion: {
      type: DataTypes.STRING(1),
      allowNull: true,
      validate: {
        len: [0, 1]
      }
    },
    representante_legal: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [0, 255] // Permitir string vacío pero con longitud máxima
      }
    },
    cedula_representante: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20] // Permitir string vacío pero con longitud máxima
      }
    },
    tipo_empresa: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: {
          args: [['SAS', 'LTDA', 'SA', 'SRL', 'EIRL', 'SOCIEDAD_COLECTIVA', 'SOCIEDAD_EN_COMANDITA', 'OTRO', '']],
          msg: 'Tipo de empresa no válido'
        }
      }
    },
    actividad_economica: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500] // Permitir string vacío pero con longitud máxima
      }
    },
    codigo_ciiu: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: [0, 10] // Permitir string vacío pero con longitud máxima
      }
    },
    fecha_constitucion: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: [0, 10], // Permitir string vacío pero con longitud máxima
        isValidDate(value) {
          if (value && value !== '' && isNaN(new Date(value).getTime())) {
            throw new Error('La fecha de constitución debe ser una fecha válida (formato: YYYY-MM-DD)');
          }
        }
      }
    },
    capital_social: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20], // Permitir string vacío pero con longitud máxima
        isValidNumber(value) {
          if (value && value !== '' && isNaN(parseFloat(value))) {
            throw new Error('El capital social debe ser un número válido');
          }
          if (value && value !== '' && parseFloat(value) < 0) {
            throw new Error('El capital social no puede ser negativo');
          }
        }
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
      },
      {
        fields: ['nit'],
        unique: true
      },
      {
        fields: ['tipo_cliente']
      }
    ]
  }
);

// Validaciones personalizadas
Client.addHook('beforeValidate', (client) => {
  if (client.tipo_cliente === 'persona_natural') {
    // Para persona natural, nombre y apellido son requeridos
    if (!client.nombre || client.nombre.trim() === '') {
      throw new Error('El nombre es requerido para persona natural');
    }
    if (!client.apellido || client.apellido.trim() === '') {
      throw new Error('El apellido es requerido para persona natural');
    }
  } else if (client.tipo_cliente === 'persona_juridica') {
    // Para persona jurídica, razón social, NIT y representante legal son requeridos
    if (!client.razon_social || client.razon_social.trim() === '') {
      throw new Error('La razón social es requerida para persona jurídica');
    }
    if (!client.nit || client.nit.trim() === '') {
      throw new Error('El NIT es requerido para persona jurídica');
    }
    if (!client.representante_legal || client.representante_legal.trim() === '') {
      throw new Error('El representante legal es requerido para persona jurídica');
    }
  }
});

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
