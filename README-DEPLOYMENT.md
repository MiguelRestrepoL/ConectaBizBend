# 🚀 Guía de Deployment - ConectaBizBend

## 📋 Configuraciones para Hosting

### 1. Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de Base de Datos
DATABASE_URL=postgresql://username:password@host:port/database_name

# Configuración del Servidor
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_aqui
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=https://tu-dominio-frontend.com
```

### 2. Plataformas de Hosting Recomendadas

#### 🌟 Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear app
heroku create tu-app-name

# Configurar variables de entorno
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=tu_secret_seguro
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://tu-frontend.com

# Deploy
git push heroku main
```

#### 🐳 Docker
```bash
# Construir imagen
docker build -t conectabizbend .

# Ejecutar con docker-compose
docker-compose up -d
```

#### ☁️ Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

#### 🚀 Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. Base de Datos

#### PostgreSQL en la Nube:
- **Heroku Postgres**: `heroku addons:create heroku-postgresql:hobby-dev`
- **Railway PostgreSQL**: Incluido automáticamente
- **Supabase**: Base de datos PostgreSQL gratuita
- **Neon**: PostgreSQL serverless

### 4. Configuraciones de Seguridad

#### Variables de Entorno Críticas:
- `JWT_SECRET`: Debe ser una cadena larga y aleatoria
- `DATABASE_URL`: URL completa de conexión a la base de datos
- `NODE_ENV`: Debe ser `production` en producción

#### CORS:
- Actualiza `FRONTEND_URL` con tu dominio real
- En producción, el CORS permite múltiples orígenes

### 5. Scripts de Package.json

```json
{
  "scripts": {
    "start": "node src/index.js",
    "start:prod": "NODE_ENV=production node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

### 6. Archivos de Configuración

- `Procfile`: Para Heroku
- `Dockerfile`: Para Docker
- `docker-compose.yml`: Para desarrollo local con Docker
- `.dockerignore`: Archivos a ignorar en Docker

### 7. Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL disponible
- [ ] JWT_SECRET seguro configurado
- [ ] CORS configurado para tu dominio
- [ ] NODE_ENV=production
- [ ] Base de datos sincronizada (force: false)

### 8. Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Producción local
npm run start:prod

# Docker
docker-compose up -d

# Ver logs
heroku logs --tail
railway logs
```

### 9. Monitoreo

- Configura logs en tu plataforma de hosting
- Monitorea el uso de la base de datos
- Configura alertas para errores

### 10. Dominio Personalizado

Si usas un dominio personalizado:
1. Configura DNS para apuntar a tu hosting
2. Actualiza `FRONTEND_URL` en las variables de entorno
3. Configura SSL/HTTPS (generalmente automático en las plataformas modernas)
