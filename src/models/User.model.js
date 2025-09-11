import { Sequelize, DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';

class User extends Model {
  async validatePassword(plainPassword) {
    if (!this.password) return false;
    return bcrypt.compare(plainPassword, this.password);
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      set(value) {
        this.setDataValue('email', value ? value.toLowerCase().trim() : value);
      }
    },
    buyer_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true
      },
      set(value) {
        this.setDataValue('buyer_email', value ? value.toLowerCase().trim() : value);
      }
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString().split('T')[0] // No puede ser fecha futura
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    accepted_terms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

// Definir las asociaciones después de importar todos los modelos
User.associate = (models) => {
  // Un usuario puede tener muchos clientes
  User.hasMany(models.Client, {
    foreignKey: 'user_id',
    as: 'clients'
  });
};

export { User };
