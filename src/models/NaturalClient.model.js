import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Client } from './Client.model.js';

class NaturalClient extends Model { }

NaturalClient.init(
    {
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'clients', key: 'id' },
            onDelete: 'CASCADE'
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        segundo_nombre: DataTypes.STRING(100),
        segundo_apellido: DataTypes.STRING(100),
        nacionalidad: DataTypes.STRING(100),
        idioma: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Español'
        }
    },
    {
        sequelize,
        modelName: 'NaturalClient',
        tableName: 'natural_clients',
        timestamps: false
    }
);
export { NaturalClient };
