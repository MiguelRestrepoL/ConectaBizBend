import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  getTiendaPerfil,
  saveTiendaPerfil,
  getAnuncios,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio,
} from '../controllers/contenido.controller.js';
 
const router = Router();
router.use(authenticateToken);
 
// Tienda
router.get('/tienda', getTiendaPerfil);
router.put('/tienda', saveTiendaPerfil);
 
// Anuncios
router.get('/anuncios', getAnuncios);           // ?activos=true para filtrar
router.post('/anuncios', createAnuncio);
router.put('/anuncios/:id', updateAnuncio);
router.delete('/anuncios/:id', deleteAnuncio);
 
export default router;
 