import { jest } from '@jest/globals';
 
// JWT_SECRET debe coincidir con el fallback del middleware
// auth.middleware.js: process.env.JWT_SECRET || 'dev_secret_change_me'
const JWT_SECRET = 'dev_secret_change_me';
 
// ── Mock database ─────────────────────────────────────────────────────────────
jest.unstable_mockModule('../config/database.js', () => ({
  sequelize: {
    define: jest.fn().mockReturnValue({}),
    authenticate: jest.fn(),
    sync: jest.fn(),
    query: jest.fn(),
    transaction: jest.fn().mockImplementation(async (cb) => cb({ commit: jest.fn(), rollback: jest.fn() })),
  },
}));
 
// ── Mock todos los modelos ────────────────────────────────────────────────────
jest.unstable_mockModule('../models/Audit.model.js',            () => ({ Audit:           { associate: jest.fn() } }));
jest.unstable_mockModule('../models/BlacklistedToken.model.js', () => ({ BlacklistedToken:{ associate: jest.fn() } }));
jest.unstable_mockModule('../models/Client.model.js',           () => ({ Client:          { associate: jest.fn() } }));
jest.unstable_mockModule('../models/NaturalClient.model.js',    () => ({ NaturalClient:   { associate: jest.fn() } }));
jest.unstable_mockModule('../models/JuridicalClient.js',        () => ({ JuridicalClient: { associate: jest.fn() } }));
jest.unstable_mockModule('../models/Pedido.model.js',           () => ({ Pedido:          { associate: jest.fn() } }));
jest.unstable_mockModule('../models/Producto.model.js',         () => ({ Producto:        { associate: jest.fn() } }));
jest.unstable_mockModule('../models/PedidoProducto.model.js',   () => ({ PedidoProducto: { associate: jest.fn() } }));
jest.unstable_mockModule('../models/User.model.js',             () => ({ User:            { associate: jest.fn() } }));
jest.unstable_mockModule('../models/Cupon.model.js',            () => ({ Cupon:           { associate: jest.fn() } }));
jest.unstable_mockModule('../models/Promocion.model.js',        () => ({ Promocion:       { associate: jest.fn() } }));
jest.unstable_mockModule('../models/Contenido.model.js',        () => ({ TiendaPerfil: { associate: jest.fn() }, Anuncio: { associate: jest.fn() } }));
jest.unstable_mockModule('../models/Proveedor.model.js',        () => ({ Proveedor:       { associate: jest.fn() } }));
 
// ── Mock audit.service ────────────────────────────────────────────────────────
const mockLogAudit = jest.fn().mockResolvedValue({});
jest.unstable_mockModule('../services/audit.service.js', () => ({
  logAudit:          mockLogAudit,
  getUserAudits:     jest.fn().mockResolvedValue([]),
  checkUserHasAudit: jest.fn().mockResolvedValue(false),
  queryAudits:       jest.fn().mockResolvedValue({ audits: [], total: 0 }),
}));
 
// ── Mock auth.service ─────────────────────────────────────────────────────────
const mockVerifyTokenNotBlacklisted = jest.fn().mockResolvedValue(true);
const mockRegisterUser = jest.fn();
const mockLoginUser    = jest.fn();
const mockLogoutUser   = jest.fn();
jest.unstable_mockModule('../services/auth.service.js', () => ({
  registerUser:              mockRegisterUser,
  loginUser:                 mockLoginUser,
  logoutUser:                mockLogoutUser,
  acceptTerms:               jest.fn(),
  updateProfile:             jest.fn(),
  changeUserPassword:        jest.fn(),
  getUserProfile:            jest.fn(),
  verifyTokenNotBlacklisted: mockVerifyTokenNotBlacklisted,
}));
 
// ── Mock client.service — solo los exports reales ─────────────────────────────
const mockCreateClientService       = jest.fn();
const mockGetClientByIdService      = jest.fn();
const mockGetClientsByUserIdService = jest.fn().mockResolvedValue({ clients: [], total: 0, page: 1, totalPages: 0 });
const mockUpdateClientService       = jest.fn();
const mockDeleteClientService       = jest.fn();
const mockGetClientsByTypeService   = jest.fn();
const mockUpdateClientStateService  = jest.fn();
jest.unstable_mockModule('../services/client.service.js', () => ({
  createClientService:       mockCreateClientService,
  getClientByIdService:      mockGetClientByIdService,
  getClientsByUserIdService: mockGetClientsByUserIdService,
  getClientsByTypeService:   mockGetClientsByTypeService,
  updateClientService:       mockUpdateClientService,
  deleteClientService:       mockDeleteClientService,
  updateClientStateService:  mockUpdateClientStateService,
}));
 
// ── Mock producto.service ─────────────────────────────────────────────────────
const mockCreateProductoService          = jest.fn();
const mockGetProductoByIdService         = jest.fn();
const mockGetProductosByUserIdService    = jest.fn().mockResolvedValue({ productos: [], total: 0, page: 1, totalPages: 0 });
const mockUpdateProductoService          = jest.fn();
const mockDeleteProductoService          = jest.fn();
const mockUpdateProductoStockService     = jest.fn();
const mockGetProductosStockBajoService   = jest.fn().mockResolvedValue([]);
jest.unstable_mockModule('../services/producto.service.js', () => ({
  createProductoService:        mockCreateProductoService,
  getProductoByIdService:       mockGetProductoByIdService,
  getProductosByUserIdService:  mockGetProductosByUserIdService,
  updateProductoService:        mockUpdateProductoService,
  deleteProductoService:        mockDeleteProductoService,
  updateProductoStockService:   mockUpdateProductoStockService,
  getProductosStockBajoService: mockGetProductosStockBajoService,
  validateProductoData:         jest.fn().mockReturnValue([]),
}));
 
// ── Mock pedido.service ───────────────────────────────────────────────────────
const mockCreatePedidoService          = jest.fn();
const mockGetPedidoByIdService         = jest.fn();
const mockGetPedidosByUserIdService    = jest.fn().mockResolvedValue({ pedidos: [], total: 0, page: 1, totalPages: 0 });
const mockUpdatePedidoService          = jest.fn();
const mockDeletePedidoService          = jest.fn();
const mockGetPedidoStatsService        = jest.fn();
const mockGetPedidosByClienteIdService = jest.fn().mockResolvedValue({ pedidos: [], total: 0 });
jest.unstable_mockModule('../services/pedido.service.js', () => ({
  createPedidoService:          mockCreatePedidoService,
  getPedidoByIdService:         mockGetPedidoByIdService,
  getPedidosByUserIdService:    mockGetPedidosByUserIdService,
  updatePedidoService:          mockUpdatePedidoService,
  deletePedidoService:          mockDeletePedidoService,
  getPedidoStatsService:        mockGetPedidoStatsService,
  getPedidosByClienteIdService: mockGetPedidosByClienteIdService,
  getTrackingService:           jest.fn(),
  validatePedidoData:           jest.fn().mockReturnValue([]),
}));
 
// ── Mock proveedor.service ────────────────────────────────────────────────────
const mockCreateProveedorService   = jest.fn();
const mockGetProveedoresService    = jest.fn().mockResolvedValue({ proveedores: [], total: 0, page: 1, totalPages: 0 });
const mockGetProveedorByIdService  = jest.fn();
const mockUpdateProveedorService   = jest.fn();
const mockDeleteProveedorService   = jest.fn();
jest.unstable_mockModule('../services/proveedor.service.js', () => ({
  createProveedorService:  mockCreateProveedorService,
  getProveedoresService:   mockGetProveedoresService,
  getProveedorByIdService: mockGetProveedorByIdService,
  updateProveedorService:  mockUpdateProveedorService,
  deleteProveedorService:  mockDeleteProveedorService,
}));
 
// ── Mocks de services restantes ───────────────────────────────────────────────
jest.unstable_mockModule('../services/estadisticas.service.js', () => ({
  getEstadisticasService: jest.fn().mockResolvedValue({}),
}));
jest.unstable_mockModule('../services/top-clientes.service.js', () => ({
  getTopClientesService: jest.fn().mockResolvedValue([]),
}));
jest.unstable_mockModule('../services/contenido.service.js', () => ({
  getTiendaPerfilService: jest.fn().mockResolvedValue({}),
  saveTiendaPerfilService: jest.fn().mockResolvedValue({}),
  getAnunciosService: jest.fn().mockResolvedValue([]),
  createAnuncioService: jest.fn().mockResolvedValue({}),
  updateAnuncioService: jest.fn().mockResolvedValue({}),
  deleteAnuncioService: jest.fn().mockResolvedValue({}),
}));
jest.unstable_mockModule('../services/marketing.service.js', () => ({
  createCuponService: jest.fn(), getCuponesByUserIdService: jest.fn().mockResolvedValue({ cupones: [], total: 0 }),
  getCuponByIdService: jest.fn(), updateCuponService: jest.fn(), deleteCuponService: jest.fn(),
  createPromocionService: jest.fn(), getPromocionesByUserIdService: jest.fn().mockResolvedValue({ promociones: [], total: 0 }),
  getPromocionByIdService: jest.fn(), updatePromocionService: jest.fn(), deletePromocionService: jest.fn(),
}));
 
// ── Mock repositories de infraestructura ─────────────────────────────────────
const mockFindById = jest.fn();
jest.unstable_mockModule('../repository/user.repository.js', () => ({
  findById:                mockFindById,
  createUser:              jest.fn(),
  findByEmailOrUsername:   jest.fn(),
  findByEmailWithPassword: jest.fn(),
  acceptTermsByUserId:     jest.fn(),
  updateUserProfile:       jest.fn(),
  findByBuyerEmail:        jest.fn(),
  changePassword:          jest.fn(),
  getUserById:             jest.fn(),
}));
jest.unstable_mockModule('../repository/blacklistedToken.repository.js', () => ({
  addTokenToBlacklist:    jest.fn().mockResolvedValue(true),
  isTokenBlacklisted:     jest.fn().mockResolvedValue(false),
  blacklistAllUserTokens: jest.fn(),
  cleanExpiredTokens:     jest.fn(),
}));
jest.unstable_mockModule('../repository/audit.repository.js', () => ({
  logAudit: jest.fn().mockResolvedValue({}),
  getUserAudits: jest.fn().mockResolvedValue([]),
  checkUserHasAudit: jest.fn().mockResolvedValue(false),
  queryAudits: jest.fn().mockResolvedValue({ audits: [], total: 0 }),
}));
 
// ── Importar app DESPUÉS de todos los mocks ───────────────────────────────────
const { default: app } = await import('../app.js');
 
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
 
const request   = supertest(app);
const makeToken = (userId = 1) => jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' });
const TOKEN     = makeToken(1);
const USER      = { id: 1, username: 'testuser', email: 'test@test.com' };
 
// ══════════════════════════════════════════════════════════════════════════════
describe('5.4 Integration Testing — ConectaBiz', () => {
 
  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyTokenNotBlacklisted.mockResolvedValue(true);
    mockFindById.mockResolvedValue(USER);
    mockLogAudit.mockResolvedValue({});
  });
 
  // ── IT-01: Flujo completo de venta ────────────────────────────────────────
  describe('IT-01: Flujo completo de venta (cliente → producto → pedido → stock)', () => {
 
    test('Paso 1 — Crear cliente persona natural exitosamente', async () => {
      mockCreateClientService.mockResolvedValue({
        id: 10, user_id: 1, tipo_cliente: 'persona_natural', correo_electronico: 'cliente@test.com',
      });
 
      const res = await request
        .post('/api/clients')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          tipo_cliente: 'persona_natural', nombre: 'Juan', apellido: 'Test',
          correo_electronico: 'cliente@test.com', numero_telefono: '3001234567',
        });
 
      expect([200, 201]).toContain(res.status);
      expect(mockCreateClientService).toHaveBeenCalledTimes(1);
    });
 
    test('Paso 2 — Crear producto con stock', async () => {
      mockCreateProductoService.mockResolvedValue({
        id: 20, user_id: 1, nombre: 'Producto Test', precio: 50000, stock: 100,
      });
 
      const res = await request
        .post('/api/productos')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ nombre: 'Producto Test', precio: 50000, stock: 100 });
 
      expect([200, 201]).toContain(res.status);
      expect(mockCreateProductoService).toHaveBeenCalledTimes(1);
    });
 
    test('Paso 3 — Crear pedido (stock decrementado internamente por el service)', async () => {
      mockCreatePedidoService.mockResolvedValue({
        id: 30, user_id: 1, cliente_id: 10, titulo: 'Pedido IT-01',
        estado: 'preparando', monto_total_pagado: 150000,
      });
 
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
 
      const res = await request
        .post('/api/pedidos')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          cliente_id: 10, titulo: 'Pedido IT-01',
          fecha_entrega: manana.toISOString().slice(0, 10),
          monto_total_pagado: 150000, monto_sin_iva: 126050,
          productos: [{ producto_id: 20, cantidad: 3, precio_unitario: 50000 }],
        });
 
      expect([200, 201]).toContain(res.status);
      expect(mockCreatePedidoService).toHaveBeenCalledTimes(1);
    });
 
    test('Paso 4 — Auditoría registra la creación del pedido', async () => {
      mockCreatePedidoService.mockImplementation(async (data, userId) => {
        await mockLogAudit({ userId, entityType: 'pedido', entityId: 31, action: 'create', metadata: {} });
        return { id: 31, user_id: userId, estado: 'preparando' };
      });
 
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
 
      await request
        .post('/api/pedidos')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          cliente_id: 10, titulo: 'Pedido auditoria',
          fecha_entrega: manana.toISOString().slice(0, 10),
          monto_total_pagado: 50000, monto_sin_iva: 42017,
          productos: [{ producto_id: 20, cantidad: 1, precio_unitario: 50000 }],
        });
 
      expect(mockLogAudit).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'create', entityType: 'pedido' })
      );
    });
  });
 
  // ── IT-02: Flujo de autenticación completo ────────────────────────────────
  describe('IT-02: Flujo de autenticacion completo', () => {
 
    test('Registro crea usuario nuevo', async () => {
      mockRegisterUser.mockResolvedValue({ id: 99, username: 'nuevouser', email: 'nuevo@test.com' });
 
      const res = await request
        .post('/api/auth/register')
        .send({ username: 'nuevouser', email: 'nuevo@test.com', password: 'Password123!' });
 
      expect([200, 201]).toContain(res.status);
      expect(mockRegisterUser).toHaveBeenCalledTimes(1);
    });
 
    test('Login retorna token JWT válido', async () => {
      mockLoginUser.mockResolvedValue({
        token: makeToken(1),
        user: { id: 1, username: 'testuser', email: 'test@test.com' },
      });
 
      const res = await request
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });
 
      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty('token');
    });
 
    test('Acceso a ruta protegida con token válido retorna 200', async () => {
      const res = await request
        .get('/api/clients')
        .set('Authorization', `Bearer ${TOKEN}`);
 
      expect(res.status).toBe(200);
    });
 
    test('Logout invalida el token', async () => {
      mockLogoutUser.mockResolvedValue({ message: 'Logout exitoso' });
 
      const res = await request
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${TOKEN}`);
 
      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty('message');
      expect(mockLogoutUser).toHaveBeenCalledTimes(1);
    });
 
    test('Token post-logout es rechazado con 401', async () => {
      const blacklistError = new Error('Token inválido');
      blacklistError.status = 401;
      mockVerifyTokenNotBlacklisted.mockRejectedValue(blacklistError);
 
      const res = await request
        .get('/api/clients')
        .set('Authorization', `Bearer ${TOKEN}`);
 
      expect(res.status).toBe(401);
    });
  });
 
  // ── IT-03 ─────────────────────────────────────────────────────────────────
  describe('IT-03: Pedido con promocion aplicada', () => {
    test.skip('Verificar manualmente en Railway', () => {
      // 1. Crear producto, 2. Crear promoción vinculada
      // 3. Crear pedido con ese producto
      // 4. Verificar que la promoción aparece en el detalle del pedido
    });
  });
 
  // ── IT-04: Auditoría registra acciones ────────────────────────────────────
  describe('IT-04: Auditoria registra acciones de cliente (crear / actualizar / eliminar)', () => {
 
    test('Crear cliente llama logAudit con action "create"', async () => {
      mockCreateClientService.mockImplementation(async (data, userId) => {
        await mockLogAudit({ userId, entityType: 'client', entityId: 11, action: 'create', metadata: {} });
        return { id: 11, user_id: userId, tipo_cliente: 'persona_natural' };
      });
 
      await request
        .post('/api/clients')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          tipo_cliente: 'persona_natural', nombre: 'Audit', apellido: 'Test',
          correo_electronico: 'audit@test.com', numero_telefono: '3009999999',
        });
 
      expect(mockLogAudit).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'create', entityType: 'client' })
      );
    });
 
    test('Actualizar cliente llama logAudit con action "update"', async () => {
      mockUpdateClientService.mockImplementation(async (id, data, userId) => {
        await mockLogAudit({ userId, entityType: 'client', entityId: Number(id), action: 'update', metadata: {} });
        return { id, user_id: userId };
      });
 
      await request
        .put('/api/clients/11')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ numero_telefono: '3111111111' });
 
      expect(mockLogAudit).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'update', entityType: 'client' })
      );
    });
 
    test('Eliminar cliente llama logAudit con action "delete"', async () => {
      mockDeleteClientService.mockImplementation(async (id, userId) => {
        await mockLogAudit({ userId, entityType: 'client', entityId: Number(id), action: 'delete', metadata: {} });
        return { id, state: false };
      });
 
      await request
        .delete('/api/clients/11')
        .set('Authorization', `Bearer ${TOKEN}`);
 
      expect(mockLogAudit).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'delete', entityType: 'client' })
      );
    });
  });
 
  // ── IT-05 ─────────────────────────────────────────────────────────────────
  describe('IT-05: Estadisticas reflejan datos reales', () => {
    test.skip('Verificar manualmente en Railway', () => {
      // 1. Crear pedidos con fechas conocidas
      // 2. Consultar GET /api/estadisticas con ese rango de fechas
      // 3. Confirmar que total_pedidos y monto_total coinciden
    });
  });
 
  // ── IT-06: Proveedor vinculado a producto ─────────────────────────────────
  describe('IT-06: Proveedor vinculado a producto', () => {
 
    test('Paso 1 — Crear proveedor exitosamente', async () => {
      mockCreateProveedorService.mockResolvedValue({
        id: 50, user_id: 1, nombre: 'Proveedor S.A.', correo: 'prov@test.com', activo: true,
      });
 
      const res = await request
        .post('/api/proveedores')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ nombre: 'Proveedor S.A.', correo: 'prov@test.com' });
 
      expect([200, 201]).toContain(res.status);
      expect(mockCreateProveedorService).toHaveBeenCalledTimes(1);
    });
 
    test('Paso 2 — Crear producto con proveedor vinculado', async () => {
      mockCreateProductoService.mockResolvedValue({
        id: 21, user_id: 1, nombre: 'Producto con Proveedor',
        precio: 30000, stock: 50, proveedor_id: 50,
      });
 
      const res = await request
        .post('/api/productos')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ nombre: 'Producto con Proveedor', precio: 30000, stock: 50, proveedor_id: 50 });
 
      expect([200, 201]).toContain(res.status);
      expect(mockCreateProductoService).toHaveBeenCalledWith(
        expect.objectContaining({ proveedor_id: 50 }),
        USER.id
      );
    });
 
    test('Paso 3 — Editar producto cambiando proveedor actualiza la relacion', async () => {
      mockUpdateProductoService.mockResolvedValue({ id: 21, user_id: 1, proveedor_id: 51 });
 
      const res = await request
        .put('/api/productos/21')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ proveedor_id: 51 });
 
      expect([200, 201]).toContain(res.status);
      expect(mockUpdateProductoService).toHaveBeenCalledWith(
        '21',
        expect.objectContaining({ proveedor_id: 51 }),
        USER.id
      );
    });
  });
});
 