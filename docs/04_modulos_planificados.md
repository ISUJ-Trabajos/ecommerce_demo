# Módulos Planificados — ECommerce Demo (Móvil Expo)

## Mapa de Módulos

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ MOD-01   │ MOD-02   │ MOD-03   │ MOD-04   │ MOD-05   │ MOD-06   │ MOD-07   │
│  Auth    │ Catálogo │ Detalle  │  Carrito │ Checkout │ Pedidos  │  Admin   │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

---

## MOD-01 · Autenticación

**Pantallas Expo Router**: `(auth)/login` · `(auth)/register`

| Funcionalidad        | Descripción                                                      |
|----------------------|------------------------------------------------------------------|
| Registro de cliente  | Nombre, email, contraseña → rol `client` asignado automáticamente |
| Inicio de sesión     | Email + password → JWT almacenado en **Expo SecureStore** + Zustand |
| Cierre de sesión     | Borra token de SecureStore y limpia authStore; navega a login   |
| Guard de sesión      | Layout `(app)/_layout.tsx` redirige a `/login` sin token        |
| Guard de admin       | Layout `(admin)/_layout.tsx` redirige a `/catalog` si no es admin |
| Persistencia de sesión | Al iniciar la app, lee el JWT de SecureStore y rehidrata Zustand |

**Endpoints API**
```
POST  /api/auth/register   { name, email, password }
POST  /api/auth/login      { email, password } → { token, user }
```

---

## MOD-02 · Catálogo de Productos

**Pantalla Expo Router**: `(app)/catalog/index`

| Funcionalidad        | Descripción                                                         |
|----------------------|---------------------------------------------------------------------|
| Listado de productos | FlatList con ProductCards; carga desde la API al montar             |
| Tabs de categoría    | ScrollView horizontal con tabs: Todos · Moda · Cosméticos/Salud · Hogar/Decoración · Accesorios |
| Tab activa           | Borde inferior `#74b8d3` + texto blanco; inactiva en `#8ba3b8`    |
| Sin stock            | Overlay en ProductCard + badge rojo "Sin stock"; botón deshabilitado |
| Navegar a detalle    | `onPress` en la card → `router.push('/catalog/' + id)`            |
| Pull to refresh      | `refreshControl` en FlatList para recargar productos               |

**Endpoints API**
```
GET  /api/products                  → productos activos
GET  /api/products?category=:slug   → filtro por categoría
GET  /api/categories                → 4 categorías
```

---

## MOD-03 · Detalle de Producto

**Pantalla Expo Router**: `(app)/catalog/[id]`

| Funcionalidad         | Descripción                                                        |
|-----------------------|--------------------------------------------------------------------|
| Imagen ampliada       | Image con resizeMode cover, altura fija (e.g. 280px)              |
| Información completa  | Nombre (Syne bold), categoría badge, descripción, precio          |
| Indicador de stock    | `stock > 10` → verde ✅ · `1–5` → naranja ⚠ · `0` → rojo ⛔     |
| Selector de cantidad  | Row con botones `−` / `+`; no supera el stock disponible          |
| Alerta inline roja    | Aparece debajo del selector si `qty > stock` (componente StockAlert) |
| Agregar al carrito    | Llama a `POST /api/cart`; backend valida stock; error muestra alerta |
| Botón deshabilitado   | Si `stock = 0`, muestra "Sin Stock" en gris, sin acción           |

**Endpoints API**
```
GET   /api/products/:id    → detalle con stock actual
POST  /api/cart            { product_id, quantity }
```

**Respuestas de error de stock**
```json
HTTP 409 → { "error": "OUT_OF_STOCK",    "message": "Producto sin stock disponible" }
HTTP 409 → { "error": "STOCK_EXCEEDED",  "available": 3, "message": "Solo 3 unidades disponibles" }
```

---

## MOD-04 · Carrito de Compras

**Pantalla Expo Router**: `(app)/cart`

| Funcionalidad         | Descripción                                                        |
|-----------------------|--------------------------------------------------------------------|
| Listado de ítems      | FlatList con CartItem components                                   |
| Modificar cantidad    | Botones `−` / `+`; PATCH al backend; responde con error de stock  |
| Alerta inline         | Mensaje rojo bajo cada ítem si `qty > stock disponible`           |
| Eliminar ítem         | Botón 🗑 → DELETE al backend → actualiza Zustand                  |
| Total dinámico        | Calculado desde el estado Zustand en tiempo real                  |
| Ir a Checkout         | Botón fijo en parte inferior → `router.push('/checkout')`         |
| Estado vacío          | Ícono + texto + botón "Explorar catálogo"                         |

**Endpoints API**
```
GET     /api/cart         → ítems del usuario autenticado
POST    /api/cart         { product_id, quantity }
PATCH   /api/cart/:id     { quantity }  — valida stock
DELETE  /api/cart/:id
```

---

## MOD-05 · Checkout y Confirmación

**Pantalla Expo Router**: `(app)/checkout`

| Funcionalidad         | Descripción                                                        |
|-----------------------|--------------------------------------------------------------------|
| Resumen del pedido    | ScrollView con lista de ítems, cantidades y precios               |
| Total final           | Calculado y mostrado prominentemente                              |
| Botón único           | "FINALIZAR PEDIDO" — sin formularios adicionales                  |
| Estado loading        | ActivityIndicator en el botón mientras espera la API             |
| Transacción backend   | Valida stock + descuenta + crea orden en una sola transacción     |
| Overlay de éxito      | `OrderSuccessOverlay` con animación Moti sobre la pantalla        |
| Error de stock        | Alerta roja con el producto problemático; pedido no se crea       |

**Endpoint API**
```
POST  /api/orders   → crea orden desde el carrito activo
                      Respuesta: { order_id, total, created_at }
```

**Animación de éxito (`OrderSuccessOverlay` con Moti)**
```
1. Fade-in del overlay (0.3s)
2. Círculo ✓: scale 0→1.2→1 con spring (Moti MotiView)
3. "¡Pedido Realizado!": translateY + opacity
4. Subtexto con delay
5. Botones: "Ver mis pedidos" + "Volver al catálogo"
```

---

## MOD-06 · Historial de Pedidos

**Pantallas Expo Router**: `(app)/orders/index` · `(app)/orders/[id]`

| Funcionalidad      | Descripción                                                         |
|--------------------|---------------------------------------------------------------------|
| Lista de pedidos   | FlatList con OrderCards: fecha, total, badge "Completado"          |
| Detalle expandible | `onPress` en la card expande la tabla de ítems (animación height)  |
| Detalle individual | Opcionalmente navega a `/orders/[id]` para ver el pedido completo  |
| Estado vacío       | Ícono 📦 + texto + botón al catálogo                               |

**Endpoints API**
```
GET  /api/orders        → pedidos del usuario autenticado
GET  /api/orders/:id    → detalle de un pedido
```

---

## MOD-07 · Panel de Administración

**Pantallas Expo Router**: `(admin)/products/index` · `(admin)/products/new` · `(admin)/products/[id]`

| Funcionalidad       | Descripción                                                         |
|---------------------|---------------------------------------------------------------------|
| Lista de productos  | FlatList con todos los productos (activos e inactivos)             |
| Stock visual        | Celda roja si `stock = 0`, naranja si `1–5`                        |
| Crear producto      | Formulario con TextInputs + Picker de categoría + Image Picker     |
| Editar producto     | Misma pantalla pre-poblada con datos existentes                    |
| Desactivar          | Toggle `is_active` con Switch de React Native                      |
| Upload de imagen    | `Expo Image Picker` → base64 o FormData → `POST /api/products/:id/image` |

**Endpoints API** *(requieren `role = 'admin'`)*
```
POST   /api/products
PATCH  /api/products/:id
PATCH  /api/products/:id/toggle
POST   /api/products/:id/image
```

---

## Matriz de Acceso por Rol

| Módulo                    | `client` | `admin` |
|---------------------------|----------|---------|
| Login / Registro          | ✅       | ✅      |
| Catálogo                  | ✅       | ✅      |
| Detalle de producto       | ✅       | ✅      |
| Carrito                   | ✅       | —       |
| Checkout                  | ✅       | —       |
| Historial de pedidos      | ✅ (propios) | —  |
| Panel Admin               | —        | ✅      |

---

## Flujo Principal de Compra (Happy Path Móvil)

```
Splash / index.tsx
      │
      ▼  (sin sesión)
/(auth)/login ──────────────── /(auth)/register
      │  (con sesión)
      ▼
/(app)/catalog  (Tab Bar inferior: Catálogo · Carrito · Pedidos)
      │
      │  onPress en ProductCard
      ▼
/(app)/catalog/[id]   Detalle + selector cantidad + agregar al carrito
      │
      │  badge carrito actualizado en Tab Bar
      ▼
/(app)/cart   Revisar ítems + alertas de stock inline
      │
      │  botón "Ir al Checkout"
      ▼
/(app)/checkout   Resumen + "FINALIZAR PEDIDO"
      │
      │  éxito
      ▼
OrderSuccessOverlay (Moti animación)
      │
      │  botón "Ver mis pedidos"
      ▼
/(app)/orders   Historial de pedidos del usuario
```

---

## Navegación por Tab Bar

La Tab Bar inferior (`(app)/_layout.tsx`) tiene 3 tabs visibles para el cliente:

| Tab        | Ícono       | Ruta                   |
|------------|-------------|------------------------|
| Catálogo   | 🏬 grid     | `/(app)/catalog`       |
| Carrito    | 🛒 (badge)  | `/(app)/cart`          |
| Pedidos    | 📦 clock    | `/(app)/orders`        |

> El acceso a `/(admin)` no aparece en la tab bar; el admin ve un botón en su perfil o navega directamente.
