import './User.model.js'
import './item.model.js'
import './Client.model.js'
import './Pedido.model.js'
import './Producto.model.js'
import './PedidoProducto.model.js'
import './BlacklistedToken.model.js'
import './Audit.model.js'
import './Cupon.model.js'
import './Promocion.model.js'
import './Contenido.model.js'
 
// Importar los modelos
import { User } from './User.model.js';
import { Client } from './Client.model.js';
import { Pedido } from './Pedido.model.js';
import { Producto } from './Producto.model.js';
import { PedidoProducto } from './PedidoProducto.model.js';
import { BlacklistedToken } from './BlacklistedToken.model.js';
import { JuridicalClient } from './JuridicalClient.js';
import { NaturalClient } from './NaturalClient.model.js';
import { Audit } from './Audit.model.js';
import { Cupon } from './Cupon.model.js';
import { Promocion } from './Promocion.model.js';
import { TiendaPerfil, Anuncio } from './Contenido.model.js';
 
// Crear objeto con todos los modelos
const models = {
  User,
  Client,
  Pedido,
  Producto,
  PedidoProducto,
  BlacklistedToken,
  JuridicalClient,
  NaturalClient,
  Audit,
  Cupon,
  Promocion,
  TiendaPerfil,
  Anuncio
};
 
// 🔹 Relación 1:1 con NaturalClient
Client.hasOne(NaturalClient, {
  foreignKey: 'client_id',
  as: 'persona_natural',
});
NaturalClient.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'cliente',
});
 
// 🔹 Relación 1:1 con JuridicalClient
Client.hasOne(JuridicalClient, {
  foreignKey: 'client_id',
  as: 'persona_juridica',
});
JuridicalClient.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'cliente',
});
 
// Establecer las asociaciones (incluye Promocion <-> Producto definidas en Promocion.model.js)
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});
 
export { User, Client, Pedido, Producto, PedidoProducto, BlacklistedToken, JuridicalClient, NaturalClient, Audit, Cupon, Promocion, TiendaPerfil, Anuncio };