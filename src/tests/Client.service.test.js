import { jest } from '@jest/globals';

// ── Mocks ──────────────────────────────────────────────────────────────────────
const mockCreateClient = jest.fn();
const mockFindClientById = jest.fn();
const mockFindClientByEmail = jest.fn();
const mockFindClientByPhone = jest.fn();
const mockFindClientByNit = jest.fn();
const mockLogAudit = jest.fn();

jest.unstable_mockModule('../repository/client.repository.js', () => ({
  createClient: mockCreateClient,
  findClientById: mockFindClientById,
  findClientsByUserId: jest.fn(),
  updateClient: jest.fn(),
  deleteClient: jest.fn(),
  findClientsByType: jest.fn(),
  findClientByEmail: mockFindClientByEmail,
  findClientByPhone: mockFindClientByPhone,
  findClientByNit: mockFindClientByNit,
  updateClientState: jest.fn(),
}));

jest.unstable_mockModule('../services/audit.service.js', () => ({
  logAudit: mockLogAudit,
}));

const { createClientService, getClientByIdService } = await import('../services/client.service.js');

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('createClientService', () => {
  afterEach(() => jest.clearAllMocks());

  test('crea cliente correctamente', async () => {
    mockFindClientByEmail.mockResolvedValue(null);
    mockFindClientByPhone.mockResolvedValue(null);
    mockCreateClient.mockResolvedValue({ id: 1, correo_electronico: 'cli@test.com', tipo_cliente: 'persona_natural' });

    const result = await createClientService({
      correo_electronico: 'cli@test.com',
      numero_telefono: '3001234567',
      tipo_cliente: 'persona_natural'
    }, 1);

    expect(result).toHaveProperty('id');
    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });

  test('lanza 409 si el email ya existe', async () => {
    mockFindClientByEmail.mockResolvedValue({ id: 99, correo_electronico: 'cli@test.com' });

    await expect(createClientService({
      correo_electronico: 'cli@test.com',
      numero_telefono: '3001234567',
      tipo_cliente: 'persona_natural'
    }, 1)).rejects.toMatchObject({ status: 409 });
  });

  test('lanza 409 si el teléfono ya existe', async () => {
    mockFindClientByEmail.mockResolvedValue(null);
    mockFindClientByPhone.mockResolvedValue({ id: 99 });

    await expect(createClientService({
      correo_electronico: 'nuevo@test.com',
      numero_telefono: '3001234567',
      tipo_cliente: 'persona_natural'
    }, 1)).rejects.toMatchObject({ status: 409 });
  });
});

describe('getClientByIdService', () => {
  afterEach(() => jest.clearAllMocks());

  test('retorna cliente si pertenece al usuario', async () => {
    mockFindClientById.mockResolvedValue({ id: 1, user_id: 1, correo_electronico: 'cli@test.com' });

    const result = await getClientByIdService(1, 1);
    expect(result).toHaveProperty('id', 1);
  });

  test('lanza 404 si el cliente no existe', async () => {
    mockFindClientById.mockResolvedValue(null);

    await expect(getClientByIdService(999, 1))
      .rejects.toMatchObject({ status: 404 });
  });

  test('lanza 403 si el cliente no pertenece al usuario', async () => {
    mockFindClientById.mockResolvedValue({ id: 1, user_id: 2 });

    await expect(getClientByIdService(1, 1))
      .rejects.toMatchObject({ status: 403 });
  });
});