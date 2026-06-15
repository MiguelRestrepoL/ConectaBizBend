import { getTopClientesRepository } from '../repository/top-clientes.repository.js';
 
export const getTopClientesService = async (userId, { limit = 10, fechaInicio, fechaFin } = {}) => {
  const clientes = await getTopClientesRepository(userId, { limit, fechaInicio, fechaFin });
  return clientes;
};
 