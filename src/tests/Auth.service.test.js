import { jest } from '@jest/globals';
 
// ── Mocks ──────────────────────────────────────────────────────────────────────
const mockFindByEmailWithPassword = jest.fn();
const mockFindByEmailOrUsername = jest.fn();
const mockCreateUser = jest.fn();
 
jest.unstable_mockModule('../repository/user.repository.js', () => ({
  findByEmailWithPassword: mockFindByEmailWithPassword,
  findByEmailOrUsername: mockFindByEmailOrUsername,
  createUser: mockCreateUser,
  acceptTermsByUserId: jest.fn(),
  updateUserProfile: jest.fn(),
  findByBuyerEmail: jest.fn(),
  changePassword: jest.fn(),
  getUserById: jest.fn(),
}));
 
jest.unstable_mockModule('../repository/blacklistedToken.repository.js', () => ({
  addTokenToBlacklist: jest.fn(),
  isTokenBlacklisted: jest.fn().mockResolvedValue(false),
}));
 
// Mock de sequelize/database para que no intente conectar
jest.unstable_mockModule('../config/database.js', () => ({
  sequelize: {
    define: jest.fn(),
    authenticate: jest.fn(),
    sync: jest.fn(),
  }
}));
 
const { loginUser, registerUser } = await import('../services/auth.service.js');
 
// ── Tests ──────────────────────────────────────────────────────────────────────
 
describe('loginUser', () => {
  afterEach(() => jest.clearAllMocks());
 
  test('retorna token y usuario con credenciales válidas', async () => {
    mockFindByEmailWithPassword.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      validatePassword: jest.fn().mockResolvedValue(true),
      get: jest.fn().mockReturnValue({ id: 1, email: 'test@test.com', password: 'hash' }),
    });
 
    const result = await loginUser({ email: 'test@test.com', password: '123456' });
 
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user).not.toHaveProperty('password');
  });
 
  test('lanza 401 si el usuario no existe', async () => {
    mockFindByEmailWithPassword.mockResolvedValue(null);
 
    await expect(loginUser({ email: 'noexiste@test.com', password: '123456' }))
      .rejects.toMatchObject({ status: 401 });
  });
 
  test('lanza 401 si la contraseña es incorrecta', async () => {
    mockFindByEmailWithPassword.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      validatePassword: jest.fn().mockResolvedValue(false),
      get: jest.fn().mockReturnValue({ id: 1, email: 'test@test.com' }),
    });
 
    await expect(loginUser({ email: 'test@test.com', password: 'wrongpass' }))
      .rejects.toMatchObject({ status: 401 });
  });
});
 
describe('registerUser', () => {
  afterEach(() => jest.clearAllMocks());
 
  test('registra usuario correctamente', async () => {
    mockFindByEmailOrUsername.mockResolvedValue(null);
    mockCreateUser.mockResolvedValue({ id: 1, email: 'nuevo@test.com', username: 'nuevo' });
 
    const result = await registerUser({ username: 'nuevo', email: 'nuevo@test.com', password: '123456' });
 
    expect(result).toHaveProperty('id');
    expect(mockCreateUser).toHaveBeenCalledTimes(1);
  });
 
  test('lanza 409 si el email ya existe', async () => {
    mockFindByEmailOrUsername.mockResolvedValue({ email: 'existe@test.com', username: 'otro' });
 
    await expect(registerUser({ username: 'nuevo', email: 'existe@test.com', password: '123456' }))
      .rejects.toMatchObject({ status: 409 });
  });
});
 