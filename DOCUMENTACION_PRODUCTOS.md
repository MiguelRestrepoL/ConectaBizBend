# 📦 Documentación API de Productos

Esta documentación describe cómo usar la API de productos del sistema ConectaBizBend.

## 📋 Tabla de Contenidos

- [Autenticación](#autenticación)
- [Endpoints de Productos](#endpoints-de-productos)
- [Estructura de Datos](#estructura-de-datos)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Integración con Pedidos](#integración-con-pedidos)

---

## 🔐 Autenticación

Todas las rutas de productos requieren autenticación mediante token JWT. El token debe enviarse en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

---

## 📍 Endpoints de Productos

### Base URL
```
/api/productos
```

### 1. Crear Producto
**POST** `/api/productos`

Crea un nuevo producto asociado al usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Laptop Dell XPS 15",
  "descripcion": "Laptop de alta gama con procesador Intel i7",
  "precio": 1299.99,
  "stock": 50,
  "stock_minimo": 10,
  "codigo": "LAP-DELL-XPS15",
  "proveedor_id": 1,
  "estado": true
}
```

**Campos:**
- `nombre` (string, requerido): Nombre del producto
- `descripcion` (string, opcional): Descripción del producto
- `precio` (decimal, requerido): Precio del producto (≥ 0)
- `stock` (integer, opcional): Cantidad en stock (default: 0, ≥ 0)
- `stock_minimo` (integer, opcional): Stock mínimo de alerta (default: 0, ≥ 0)
- `codigo` (string, opcional): Código único del producto (único por usuario)
- `proveedor_id` (integer, opcional): ID del cliente que es proveedor del producto
- `estado` (boolean, opcional): Estado activo/inactivo (default: true)

**Response 201:**
```json
{
  "message": "Producto creado exitosamente",
  "producto": {
    "id": 1,
    "nombre": "Laptop Dell XPS 15",
    "descripcion": "Laptop de alta gama con procesador Intel i7",
    "precio": "1299.99",
    "stock": 50,
    "stock_minimo": 10,
    "codigo": "LAP-DELL-XPS15",
    "estado": true,
    "user_id": 1,
    "proveedor_id": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "usuario": {
      "id": 1,
      "username": "usuario1",
      "email": "usuario@example.com"
    },
    "proveedor": {
      "id": 1,
      "correo_electronico": "proveedor@example.com",
      "persona_natural": {
        "nombre": "Juan",
        "apellido": "Pérez"
      }
    }
  }
}
```

**Errores:**
- `400`: Datos inválidos
- `409`: Ya existe un producto con ese código
- `403`: No tienes permisos para asignar ese proveedor
- `404`: Proveedor no encontrado

---

### 2. Listar Productos
**GET** `/api/productos`

Obtiene todos los productos del usuario autenticado con paginación y búsqueda.

**Query Parameters:**
- `page` (integer, opcional): Número de página (default: 1)
- `limit` (integer, opcional): Cantidad de resultados por página (default: 10)
- `search` (string, opcional): Búsqueda por nombre, descripción o código
- `includeInactive` (boolean, opcional): Incluir productos inactivos (default: false)
- `proveedorId` (integer, opcional): Filtrar por proveedor específico

**Ejemplo:**
```
GET /api/productos?page=1&limit=10&search=laptop&includeInactive=false&proveedorId=1
```

**Response 200:**
```json
{
  "productos": [
    {
      "id": 1,
      "nombre": "Laptop Dell XPS 15",
      "precio": "1299.99",
      "stock": 50,
      "codigo": "LAP-DELL-XPS15",
      "estado": true,
      "proveedor": {
        "id": 1,
        "correo_electronico": "proveedor@example.com"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

---

### 3. Obtener Producto por ID
**GET** `/api/productos/:id`

Obtiene un producto específico por su ID.

**Ejemplo:**
```
GET /api/productos/1
```

**Response 200:**
```json
{
  "id": 1,
  "nombre": "Laptop Dell XPS 15",
  "descripcion": "Laptop de alta gama con procesador Intel i7",
  "precio": "1299.99",
  "stock": 50,
  "stock_minimo": 10,
  "codigo": "LAP-DELL-XPS15",
  "estado": true,
  "user_id": 1,
  "proveedor_id": 1,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z",
  "usuario": {
    "id": 1,
    "username": "usuario1",
    "email": "usuario@example.com"
  },
  "proveedor": {
    "id": 1,
    "correo_electronico": "proveedor@example.com",
    "persona_natural": {
      "nombre": "Juan",
      "apellido": "Pérez"
    }
  }
}
```

**Errores:**
- `404`: Producto no encontrado
- `403`: No tienes permisos para acceder a este producto

---

### 4. Actualizar Producto
**PUT** `/api/productos/:id`

Actualiza un producto existente.

**Body:**
```json
{
  "nombre": "Laptop Dell XPS 15 - Actualizado",
  "precio": 1199.99,
  "stock": 45,
  "stock_minimo": 15
}
```

**Response 200:**
```json
{
  "message": "Producto actualizado exitosamente",
  "producto": {
    "id": 1,
    "nombre": "Laptop Dell XPS 15 - Actualizado",
    "precio": "1199.99",
    "stock": 45,
    "stock_minimo": 15,
    ...
  }
}
```

**Errores:**
- `400`: Datos inválidos
- `404`: Producto no encontrado
- `403`: No tienes permisos para modificar este producto
- `409`: Ya existe un producto con ese código

---

### 5. Actualizar Stock
**PATCH** `/api/productos/:id/stock`

Actualiza el stock de un producto. Útil para ajustes de inventario.

**Body:**
```json
{
  "cantidad": 10,
  "operation": "subtract"
}
```

**Campos:**
- `cantidad` (integer, requerido): Cantidad a operar (debe ser > 0)
- `operation` (string, opcional): Tipo de operación
  - `"subtract"`: Restar del stock (default)
  - `"add"`: Sumar al stock
  - `"set"`: Establecer el stock al valor especificado

**Ejemplos:**

Restar stock:
```json
{
  "cantidad": 5,
  "operation": "subtract"
}
```

Sumar stock:
```json
{
  "cantidad": 20,
  "operation": "add"
}
```

Establecer stock:
```json
{
  "cantidad": 100,
  "operation": "set"
}
```

**Response 200:**
```json
{
  "message": "Stock actualizado exitosamente",
  "producto": {
    "id": 1,
    "nombre": "Laptop Dell XPS 15",
    "stock": 45,
    ...
  }
}
```

**Errores:**
- `400`: Cantidad inválida o operación no válida
- `404`: Producto no encontrado
- `403`: No tienes permisos para modificar este producto
- `500`: Stock insuficiente (cuando se intenta restar más de lo disponible)

---

### 6. Productos con Stock Bajo
**GET** `/api/productos/stock-bajo`

Obtiene todos los productos que tienen stock igual o menor al stock mínimo.

**Ejemplo:**
```
GET /api/productos/stock-bajo
```

**Response 200:**
```json
{
  "productos": [
    {
      "id": 2,
      "nombre": "Mouse Logitech",
      "stock": 5,
      "stock_minimo": 10,
      "codigo": "MOU-LOG-001",
      "proveedor": {
        "id": 1,
        "correo_electronico": "proveedor@example.com"
      }
    }
  ],
  "total": 1
}
```

---

### 7. Eliminar Producto
**DELETE** `/api/productos/:id`

Elimina un producto (eliminación lógica - cambia el estado a inactivo).

**Ejemplo:**
```
DELETE /api/productos/1
```

**Response 200:**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

**Errores:**
- `404`: Producto no encontrado
- `403`: No tienes permisos para eliminar este producto

---

## 📊 Estructura de Datos

### Producto
```typescript
interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  codigo?: string;
  estado: boolean;
  user_id: number;
  proveedor_id?: number;
  created_at: Date;
  updated_at: Date;
  usuario?: User;
  proveedor?: Client;
}
```

### Relación con Cliente (Proveedor)
Un cliente puede ser proveedor de uno o más productos. La relación es opcional:
- Si `proveedor_id` es `null`, el producto no tiene proveedor asignado
- Si `proveedor_id` tiene un valor, debe ser un cliente que pertenezca al mismo usuario

---

## 🔄 Integración con Pedidos

### Crear Pedido con Productos

Al crear un pedido, puedes incluir productos que automáticamente actualizarán el stock.

**POST** `/api/pedidos`

**Body:**
```json
{
  "titulo": "Pedido de Laptops",
  "descripcion": "Pedido urgente de laptops para cliente corporativo",
  "cliente_id": 2,
  "fecha_entrega": "2024-02-01T00:00:00.000Z",
  "estado": "preparando",
  "monto_total_pagado": 2599.98,
  "monto_recibido_sin_iva": 2200.00,
  "productos": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "precio_unitario": 1299.99
    },
    {
      "producto_id": 3,
      "cantidad": 5,
      "precio_unitario": 29.99
    }
  ]
}
```

**Campos de productos:**
- `producto_id` (integer, requerido): ID del producto
- `cantidad` (integer, requerido): Cantidad a pedir (debe ser > 0)
- `precio_unitario` (decimal, requerido): Precio unitario al momento del pedido (≥ 0)

**Comportamiento:**
1. Se valida que todos los productos existan y pertenezcan al usuario
2. Se verifica que haya stock suficiente para cada producto
3. Se crea el pedido y los registros en `pedido_productos`
4. Se actualiza automáticamente el stock de cada producto (se resta la cantidad)
5. Todo se ejecuta en una transacción (si algo falla, se revierte todo)

**Response 201:**
```json
{
  "message": "Pedido creado exitosamente",
  "pedido": {
    "id": 1,
    "titulo": "Pedido de Laptops",
    "cliente_id": 2,
    "estado": "preparando",
    "productos": [
      {
        "id": 1,
        "nombre": "Laptop Dell XPS 15",
        "PedidoProducto": {
          "cantidad": 2,
          "precio_unitario": "1299.99",
          "subtotal": "2599.98"
        }
      },
      {
        "id": 3,
        "nombre": "Mouse Logitech",
        "PedidoProducto": {
          "cantidad": 5,
          "precio_unitario": "29.99",
          "subtotal": "149.95"
        }
      }
    ],
    "cliente": {
      "id": 2,
      "correo_electronico": "cliente@example.com"
    }
  }
}
```

**Errores al crear pedido con productos:**
- `400`: Stock insuficiente para algún producto
- `404`: Producto no encontrado
- `403`: No tienes permisos para usar ese producto

---

## 💡 Ejemplos de Uso Completos

### Ejemplo 1: Flujo completo de gestión de productos

```javascript
// 1. Crear un producto
const crearProducto = async () => {
  const response = await fetch('/api/productos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: 'Teclado Mecánico',
      descripcion: 'Teclado mecánico RGB',
      precio: 89.99,
      stock: 30,
      stock_minimo: 5,
      codigo: 'TEC-MEC-001',
      proveedor_id: 1
    })
  });
  return await response.json();
};

// 2. Listar productos
const listarProductos = async () => {
  const response = await fetch('/api/productos?page=1&limit=10', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// 3. Actualizar stock después de una venta
const actualizarStock = async (productoId, cantidadVendida) => {
  const response = await fetch(`/api/productos/${productoId}/stock`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cantidad: cantidadVendida,
      operation: 'subtract'
    })
  });
  return await response.json();
};

// 4. Verificar productos con stock bajo
const productosStockBajo = async () => {
  const response = await fetch('/api/productos/stock-bajo', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

### Ejemplo 2: Crear pedido que actualiza stock automáticamente

```javascript
const crearPedidoConProductos = async () => {
  const response = await fetch('/api/pedidos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      titulo: 'Pedido de Inventario',
      descripcion: 'Reposición de productos',
      cliente_id: 2,
      fecha_entrega: '2024-02-15T00:00:00.000Z',
      estado: 'preparando',
      monto_total_pagado: 389.97,
      monto_recibido_sin_iva: 330.00,
      productos: [
        {
          producto_id: 1,
          cantidad: 2,
          precio_unitario: 1299.99
        },
        {
          producto_id: 3,
          cantidad: 3,
          precio_unitario: 29.99
        }
      ]
    })
  });
  
  const resultado = await response.json();
  
  // El stock de los productos ya fue actualizado automáticamente
  console.log('Pedido creado:', resultado);
  console.log('Stock actualizado automáticamente');
  
  return resultado;
};
```

### Ejemplo 3: Gestión de inventario

```javascript
// Recibir mercancía (sumar stock)
const recibirMercancia = async (productoId, cantidad) => {
  const response = await fetch(`/api/productos/${productoId}/stock`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cantidad: cantidad,
      operation: 'add'
    })
  });
  return await response.json();
};

// Ajuste de inventario (establecer stock)
const ajusteInventario = async (productoId, nuevoStock) => {
  const response = await fetch(`/api/productos/${productoId}/stock`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cantidad: nuevoStock,
      operation: 'set'
    })
  });
  return await response.json();
};
```

---

## ⚠️ Notas Importantes

1. **Stock Automático**: Cuando creas un pedido con productos, el stock se actualiza automáticamente. No necesitas actualizar el stock manualmente después de crear un pedido.

2. **Transacciones**: Las operaciones de creación de pedidos con productos se ejecutan en transacciones. Si algo falla, todo se revierte.

3. **Validación de Stock**: El sistema valida que haya stock suficiente antes de crear el pedido. Si no hay suficiente stock, el pedido no se crea.

4. **Proveedores**: Los proveedores deben ser clientes que pertenezcan al mismo usuario. No puedes asignar un cliente de otro usuario como proveedor.

5. **Códigos Únicos**: Los códigos de productos son únicos por usuario, no globalmente. Dos usuarios diferentes pueden tener productos con el mismo código.

6. **Eliminación Lógica**: Al eliminar un producto, solo se cambia su estado a inactivo. El producto sigue existiendo en la base de datos pero no aparece en las búsquedas normales (a menos que uses `includeInactive=true`).

---

## 🔍 Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos inválidos o faltantes
- `401 Unauthorized`: Token no válido o faltante
- `403 Forbidden`: No tienes permisos para esta operación
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (ej: código duplicado)
- `500 Internal Server Error`: Error del servidor

---

## 📝 Changelog

- **v1.0.0** (2024-01-15): Implementación inicial de la API de productos
  - CRUD completo de productos
  - Relación con clientes (proveedores)
  - Actualización automática de stock en pedidos
  - Gestión de stock con operaciones (sumar, restar, establecer)
  - Alertas de stock bajo

