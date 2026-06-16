import { jest } from '@jest/globals';
 
// ── Mocks ANTES del import dinámico ───────────────────────────────────────────
const mockCreateProducto = jest.fn();
const mockFindProductoById = jest.fn();
const mockFindProductoByCodigo = jest.fn();
const mockUpdateProductoStock = jest.fn();
const mockFindProveedorById = jest.fn();
 
jest.unstable_mockModule('../repository/producto.repository.js', () => ({
  createProducto: mockCreateProducto,
  findProductoById: mockFindProductoById,
  findProductosByUserId: jest.fn(),
  updateProducto: jest.fn(),
  deleteProducto: jest.fn(),
  updateProductoStock: mockUpdateProductoStock,
  findProductoByCodigo: mockFindProductoByCodigo,
  findProductosStockBajo: jest.fn(),
}));
 
jest.unstable_mockModule('../repository/proveedor.repository.js', () => ({
  findProveedorById: mockFindProveedorById,
}));
 
// Mock con ruta absoluta desde la raíz del proyecto
jest.unstable_mockModule('../services/audit.service.js', () => ({
  logAudit: jest.fn().mockResolvedValue(undefined),
}));
 
// Mock de config/database para evitar conexión real
jest.unstable_mockModule('../config/database.js', () => ({
  sequelize: {
    define: jest.fn(),
    authenticate: jest.fn(),
    sync: jest.fn(),
    query: jest.fn(),
  }
}));
 
const { createProductoService, getProductoByIdService, updateProductoStockService } =
  await import('../services/producto.service.js');
 
// ── Tests ──────────────────────────────────────────────────────────────────────
 
describe('createProductoService', () => {
  afterEach(() => jest.clearAllMocks());
 
  test('crea producto correctamente', async () => {
    mockFindProductoByCodigo.mockResolvedValue(null);
    mockCreateProducto.mockResolvedValue({ id: 1, nombre: 'Camiseta', precio: 50000, stock: 10 });
 
    const result = await createProductoService({ nombre: 'Camiseta', precio: 50000, stock: 10 }, 1);
 
    expect(result).toHaveProperty('id');
    expect(mockCreateProducto).toHaveBeenCalledTimes(1);
  });
 
  test('lanza 400 si falta el nombre', async () => {
    await expect(createProductoService({ precio: 50000 }, 1))
      .rejects.toMatchObject({ status: 400 });
  });
 
  test('lanza 409 si el código ya existe', async () => {
    mockFindProductoByCodigo.mockResolvedValue({ id: 99, codigo: 'CAM-01' });
 
    await expect(createProductoService({ nombre: 'Camiseta', precio: 50000, codigo: 'CAM-01' }, 1))
      .rejects.toMatchObject({ status: 409 });
  });
});
 
describe('getProductoByIdService', () => {
  afterEach(() => jest.clearAllMocks());
 
  test('retorna producto si pertenece al usuario', async () => {
    mockFindProductoById.mockResolvedValue({ id: 1, user_id: 1, nombre: 'Camiseta' });
 
    const result = await getProductoByIdService(1, 1);
    expect(result).toHaveProperty('id', 1);
  });
 
  test('lanza 404 si el producto no existe', async () => {
    mockFindProductoById.mockResolvedValue(null);
 
    await expect(getProductoByIdService(999, 1))
      .rejects.toMatchObject({ status: 404 });
  });
 
  test('lanza 403 si el producto no pertenece al usuario', async () => {
    mockFindProductoById.mockResolvedValue({ id: 1, user_id: 2 });
 
    await expect(getProductoByIdService(1, 1))
      .rejects.toMatchObject({ status: 403 });
  });
});
 
describe('updateProductoStockService', () => {
  afterEach(() => jest.clearAllMocks());
 
  test('actualiza el stock correctamente', async () => {
    mockFindProductoById.mockResolvedValue({ id: 1, user_id: 1, nombre: 'Camiseta', stock: 10 });
    mockUpdateProductoStock.mockResolvedValue({ id: 1, stock: 15 });
 
    const result = await updateProductoStockService(1, 5, 'sumar', 1);
    expect(result).toHaveProperty('stock', 15);
  });
 
  test('lanza 403 si el producto no pertenece al usuario', async () => {
    mockFindProductoById.mockResolvedValue({ id: 1, user_id: 2, stock: 10 });
 
    await expect(updateProductoStockService(1, 5, 'sumar', 1))
      .rejects.toMatchObject({ status: 403 });
  });
});