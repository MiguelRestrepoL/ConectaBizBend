import { jest } from '@jest/globals';
 
// ── Mocks ──────────────────────────────────────────────────────────────────────
const mockCreatePedido = jest.fn();
const mockFindPedidoByIdAndUserId = jest.fn();
const mockFindClientById = jest.fn();
 
jest.unstable_mockModule('../repository/pedido.repository.js', () => ({
  createPedido: mockCreatePedido,
  findPedidoById: jest.fn(),
  findPedidosByUserId: jest.fn(),
  findPedidosByClienteId: jest.fn(),
  updatePedido: jest.fn(),
  deletePedido: jest.fn(),
  findPedidoByIdAndUserId: mockFindPedidoByIdAndUserId,
  getPedidoStatsByUserId: jest.fn(),
}));
 
jest.unstable_mockModule('../repository/client.repository.js', () => ({
  findClientById: mockFindClientById,
  createClient: jest.fn(),
  findClientsByUserId: jest.fn(),
  updateClient: jest.fn(),
  deleteClient: jest.fn(),
  findClientsByType: jest.fn(),
  findClientByEmail: jest.fn(),
  findClientByPhone: jest.fn(),
  findClientByNit: jest.fn(),
  updateClientState: jest.fn(),
}));
 
jest.unstable_mockModule('../services/audit.service.js', () => ({
  logAudit: jest.fn(),
}));
 
const { createPedidoService, getPedidoByIdService } = await import('../services/pedido.service.js');
 
// ── Fecha futura helper ───────────────────────────────────────────────────────
const fechaFutura = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
};
 
// ── Tests ──────────────────────────────────────────────────────────────────────
 
describe('createPedidoService', () => {
  afterEach(() => jest.clearAllMocks());
 
  test('crea pedido correctamente si el cliente pertenece al usuario', async () => {
    mockFindClientById.mockResolvedValue({ id: 1, user_id: 1 });
    mockCreatePedido.mockResolvedValue({
      id: 1, titulo: 'Pedido test', cliente_id: 1, estado: 'preparando', fecha_entrega: fechaFutura()
    });
 
    const result = await createPedidoService({
      titulo: 'Pedido test',
      cliente_id: 1,
      fecha_entrega: fechaFutura(),
      monto_total_pagado: 100000,
      monto_recibido_sin_iva: 90000,
    }, 1);
 
    expect(result).toHaveProperty('id');
    expect(mockCreatePedido).toHaveBeenCalledTimes(1);
  });
 
  test('lanza 404 si el cliente no existe', async () => {
    mockFindClientById.mockResolvedValue(null);
 
    await expect(createPedidoService({
      titulo: 'Pedido test', cliente_id: 999, fecha_entrega: fechaFutura(),
      monto_total_pagado: 0, monto_recibido_sin_iva: 0,
    }, 1)).rejects.toMatchObject({ status: 404 });
  });
 
  test('lanza 403 si el cliente pertenece a otro usuario', async () => {
    mockFindClientById.mockResolvedValue({ id: 1, user_id: 2 });
 
    await expect(createPedidoService({
      titulo: 'Pedido test', cliente_id: 1, fecha_entrega: fechaFutura(),
      monto_total_pagado: 0, monto_recibido_sin_iva: 0,
    }, 1)).rejects.toMatchObject({ status: 403 });
  });
 
  test('lanza 400 si la fecha de entrega es en el pasado', async () => {
    mockFindClientById.mockResolvedValue({ id: 1, user_id: 1 });
 
    await expect(createPedidoService({
      titulo: 'Pedido test', cliente_id: 1, fecha_entrega: '2020-01-01',
      monto_total_pagado: 0, monto_recibido_sin_iva: 0,
    }, 1)).rejects.toMatchObject({ status: 400 });
  });
 
  test('lanza 400 si el monto es negativo', async () => {
    mockFindClientById.mockResolvedValue({ id: 1, user_id: 1 });
 
    await expect(createPedidoService({
      titulo: 'Pedido test', cliente_id: 1, fecha_entrega: fechaFutura(),
      monto_total_pagado: -100, monto_recibido_sin_iva: 0,
    }, 1)).rejects.toMatchObject({ status: 400 });
  });
});
 
describe('getPedidoByIdService', () => {
  afterEach(() => jest.clearAllMocks());
 
  test('retorna pedido si existe y pertenece al usuario', async () => {
    mockFindPedidoByIdAndUserId.mockResolvedValue({ id: 1, titulo: 'Pedido test' });
 
    const result = await getPedidoByIdService(1, 1);
    expect(result).toHaveProperty('id', 1);
  });
 
  test('lanza 404 si el pedido no existe o no pertenece al usuario', async () => {
    mockFindPedidoByIdAndUserId.mockResolvedValue(null);
 
    await expect(getPedidoByIdService(999, 1))
      .rejects.toMatchObject({ status: 404 });
  });
});