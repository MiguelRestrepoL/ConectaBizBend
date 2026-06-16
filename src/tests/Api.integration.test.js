import request from 'supertest';
import app from '../app.js';
 
// ── Test de seguridad: endpoints protegidos sin token ─────────────────────────
// Estos tests no necesitan BD — solo verifican que el middleware de auth
// rechace requests sin token antes de llegar a la BD
 
const PROTECTED_ROUTES = [
  { method: 'get',  path: '/api/clients' },
  { method: 'get',  path: '/api/productos' },
  { method: 'get',  path: '/api/pedidos' },
  { method: 'get',  path: '/api/estadisticas' },
  { method: 'get',  path: '/api/audits/search' },
];
 
describe('Seguridad — endpoints protegidos sin token', () => {
  test.each(PROTECTED_ROUTES)(
    '$method $path retorna 401 sin token',
    async ({ method, path }) => {
      const res = await request(app)[method](path);
      expect(res.status).toBe(401);
    }
  );
});
 