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
 
// ── Mock auth.service (verifyTokenNotBlacklisted lo usa el middleware) ────────
const mockVerifyTokenNotBlacklisted = jest.fn().mockResolvedValue(true);
jest.unstable_mockModule('../services/auth.service.js', () => ({
  registerUser:              jest.fn(),
  loginUser:                 jest.fn(),
  logoutUser:                jest.fn(),
  acceptTerms:               jest.fn(),
  updateProfile:             jest.fn(),
  changeUserPassword:        jest.fn(),
  getUserProfile:            jest.fn(),
  verifyTokenNotBlacklisted: mockVerifyTokenNotBlacklisted,
}));
 
// ── Mock audit.service ────────────────────────────────────────────────────────
jest.unstable_mockModule('../services/audit.service.js', () => ({
  logAudit:          jest.fn().mockResolvedValue({}),
  getUserAudits:     jest.fn().mockResolvedValue([]),
  checkUserHasAudit: jest.fn().mockResolvedValue(false),
  queryAudits:       jest.fn().mockResolvedValue({ audits: [], total: 0 }),
}));
 
// ── Mock client.service ───────────────────────────────────────────────────────
const mockGetClientByIdService = jest.fn();
jest.unstable_mockModule('../services/client.service.js', () => ({
  createClientService:       jest.fn(),
  getClientByIdService:      mockGetClientByIdService,
  getClientsByUserIdService: jest.fn().mockResolvedValue({ clients: [], total: 0, page: 1, totalPages: 0 }),
  getClientsByTypeService:   jest.fn(),
  updateClientService:       jest.fn(),
  deleteClientService:       jest.fn(),
  updateClientStateService:  jest.fn(),
}));
 
// ── Mock resto de services ────────────────────────────────────────────────────
jest.unstable_mockModule('../services/producto.service.js', () => ({
  createProductoService:        jest.fn(),
  getProductoByIdService:       jest.fn(),
  getProductosByUserIdService:  jest.fn().mockResolvedValue({ productos: [], total: 0, page: 1, totalPages: 0 }),
  updateProductoService:        jest.fn(),
  deleteProductoService:        jest.fn(),
  updateProductoStockService:   jest.fn(),
  getProductosStockBajoService: jest.fn().mockResolvedValue([]),
  validateProductoData:         jest.fn().mockReturnValue([]),
}));
jest.unstable_mockModule('../services/pedido.service.js', () => ({
  createPedidoService:          jest.fn(),
  getPedidoByIdService:         jest.fn(),
  getPedidosByUserIdService:    jest.fn().mockResolvedValue({ pedidos: [], total: 0, page: 1, totalPages: 0 }),
  updatePedidoService:          jest.fn(),
  deletePedidoService:          jest.fn(),
  getPedidoStatsService:        jest.fn(),
  getPedidosByClienteIdService: jest.fn().mockResolvedValue({ pedidos: [], total: 0 }),
  getTrackingService:           jest.fn(),
  validatePedidoData:           jest.fn().mockReturnValue([]),
}));
jest.unstable_mockModule('../services/proveedor.service.js', () => ({
  createProveedorService:  jest.fn(),
  getProveedoresService:   jest.fn().mockResolvedValue({ proveedores: [], total: 0, page: 1, totalPages: 0 }),
  getProveedorByIdService: jest.fn(),
  updateProveedorService:  jest.fn(),
  deleteProveedorService:  jest.fn(),
}));
jest.unstable_mockModule('../services/estadisticas.service.js', () => ({
  getEstadisticasService: jest.fn().mockResolvedValue({}),
}));
jest.unstable_mockModule('../services/top-clientes.service.js', () => ({
  getTopClientesService: jest.fn().mockResolvedValue([]),
}));
jest.unstable_mockModule('../services/contenido.service.js', () => ({
  getTiendaPerfilService:  jest.fn().mockResolvedValue({}),
  saveTiendaPerfilService: jest.fn().mockResolvedValue({}),
  getAnunciosService:      jest.fn().mockResolvedValue([]),
  createAnuncioService:    jest.fn().mockResolvedValue({}),
  updateAnuncioService:    jest.fn().mockResolvedValue({}),
  deleteAnuncioService:    jest.fn().mockResolvedValue({}),
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
  logAudit:          jest.fn().mockResolvedValue({}),
  getUserAudits:     jest.fn().mockResolvedValue([]),
  checkUserHasAudit: jest.fn().mockResolvedValue(false),
  queryAudits:       jest.fn().mockResolvedValue({ audits: [], total: 0 }),
}));
jest.unstable_mockModule('../repository/client.repository.js', () => ({
  createClient:       jest.fn(), findClientById:      jest.fn(),
  findClientsByUserId:jest.fn(), updateClient:        jest.fn(),
  deleteClient:       jest.fn(), findClientsByType:   jest.fn(),
  findClientByEmail:  jest.fn(), findClientByPhone:   jest.fn(),
  findClientByNit:    jest.fn(), updateClientState:   jest.fn(),
}));
 
// ── Importar app DESPUÉS de todos los mocks ───────────────────────────────────
const { default: app } = await import('../app.js');
 
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
 
const request   = supertest(app);
const makeToken = (userId = 1) => jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1h' });
const USER      = { id: 1, username: 'testuser', email: 'test@test.com' };
 
// ══════════════════════════════════════════════════════════════════════════════
describe('5.2 Security Check', () => {
 
  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyTokenNotBlacklisted.mockResolvedValue(true);
    mockFindById.mockResolvedValue(USER);
  });
 
  // SC-01: Sin token → 401
  test('SC-01: GET /api/clients sin token retorna 401', async () => {
    const res = await request.get('/api/clients');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
 
  // SC-01 (extra): Otras rutas protegidas también requieren token
  test('SC-01b: GET /api/productos sin token retorna 401', async () => {
    const res = await request.get('/api/productos');
    expect(res.status).toBe(401);
  });
 
  test('SC-01c: GET /api/pedidos sin token retorna 401', async () => {
    const res = await request.get('/api/pedidos');
    expect(res.status).toBe(401);
  });
 
  test('SC-01d: GET /api/estadisticas sin token retorna 401', async () => {
    const res = await request.get('/api/estadisticas');
    expect(res.status).toBe(401);
  });
 
  test('SC-01e: GET /api/audits/search sin token retorna 401', async () => {
    const res = await request.get('/api/audits/search');
    expect(res.status).toBe(401);
  });
 
  // SC-02: Token manipulado → 401
  test('SC-02: Token manipulado retorna 401', async () => {
    const res = await request
      .get('/api/clients')
      .set('Authorization', 'Bearer token_falso_xd');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
 
  // SC-03: Token en blacklist → 401
  test('SC-03: Token en blacklist retorna 401', async () => {
    const blacklistError = new Error('Token inválido');
    blacklistError.status = 401;
    mockVerifyTokenNotBlacklisted.mockRejectedValue(blacklistError);
 
    const res = await request
      .get('/api/clients')
      .set('Authorization', `Bearer ${makeToken()}`);
 
    expect(res.status).toBe(401);
  });
 
  // SC-04: Recurso de otro usuario → 403
  test('SC-04: GET /api/clients/:id de otro usuario retorna 403', async () => {
    const forbiddenError = new Error('No tienes permisos para acceder a este cliente');
    forbiddenError.status = 403;
    mockGetClientByIdService.mockRejectedValue(forbiddenError);
 
    const res = await request
      .get('/api/clients/99')
      .set('Authorization', `Bearer ${makeToken(1)}`);
 
    expect(res.status).toBe(403);
  });
 
  // SC-05: Modificar recurso de otro usuario → 403
  test('SC-05: PUT /api/clients/:id de otro usuario retorna 403', async () => {
    const forbiddenError = new Error('No tienes permisos para modificar este cliente');
    forbiddenError.status = 403;
 
    // updateClientService es el que lanza el 403
    const { updateClientService } = await import('../services/client.service.js');
    updateClientService.mockRejectedValue(forbiddenError);
 
    const res = await request
      .put('/api/clients/99')
      .set('Authorization', `Bearer ${makeToken(1)}`)
      .send({ nombre: 'Intento de modificar' });
 
    expect(res.status).toBe(403);
  });
 
  // SC-06: CORS — MANUAL
  test.skip('SC-06: CORS desde origen no permitido — verificar manualmente en Edge', () => {
    // En Edge DevTools: Network → abrir la app desde origen no autorizado
    // Confirmar que el browser bloquea el request con error de CORS
  });
 
  // SC-07: Contraseñas hasheadas — MANUAL
  test.skip('SC-07: Contraseñas hasheadas con bcrypt — verificar manualmente en Railway BD', () => {
    // En Railway query runner ejecutar:
    //   SELECT id, email, password FROM users LIMIT 3;
    // El campo password debe comenzar con "$2b$" (hash bcrypt)
  });
});
 