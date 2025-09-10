const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class BlacklistedToken extends Model {}

BlacklistedToken.init(
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'BlacklistedToken',
    tableName: 'blacklisted_tokens',
    timestamps: false,
    indexes: [
      {
        fields: ['token'],
        unique: true
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['expires_at']
      }
    ]
  }
);

// Definir las asociaciones después de importar todos los modelos
BlacklistedToken.associate = (models) => {
  // Un token blacklisted pertenece a un usuario
  BlacklistedToken.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = { BlacklistedToken };
