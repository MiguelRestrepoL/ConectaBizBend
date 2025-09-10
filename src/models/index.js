import './User.model.js'
import './item.model.js'
import './Client.model.js'
import './Pedido.model.js'
import './BlacklistedToken.model.js'

// Importar los modelos
import { User } from './User.model.js';
import { Client } from './Client.model.js';
import { Pedido } from './Pedido.model.js';
import { BlacklistedToken } from './BlacklistedToken.model.js';


// Crear objeto con todos los modelos
const models = {
  User,
  Client,
  Pedido,
  BlacklistedToken
};


// Establecer las asociaciones
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});


export { User, Client, Pedido, BlacklistedToken };

