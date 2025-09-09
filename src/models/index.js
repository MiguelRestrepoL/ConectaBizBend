import './User.model.js'
import './item.model.js'
import './Client.model.js'

// Importar los modelos
import { User } from './User.model.js';
import { Client } from './Client.model.js';

// Crear objeto con todos los modelos
const models = {
  User,
  Client
};

// Establecer las asociaciones
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { User, Client };