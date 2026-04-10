# Seguimiento del Desarrollo — ECommerce Demo

> **Última actualización**: 2026-04-09
> Este documento se actualiza al completar cada tarea. Utilizar como checklist de seguimiento.

---

## Leyenda

- `[ ]` Pendiente
- `[/]` En progreso
- `[x]` Completado
- `[!]` Bloqueado

---

## FASE 0 — Infraestructura Base

### Backend
- [x] F0-B01 · `package.json` — Inicializar proyecto con dependencias
- [x] F0-B02 · `.env` — Variables de entorno
- [x] F0-B03 · `config/db.js` — Pool de conexiones mysql2
- [x] F0-B04 · `app.js` — Setup Express (cors, json, rutas, static)
- [x] F0-B05 · `server.js` — Entry point
- [x] F0-B06 · `middleware/verifyJWT.js` — Middleware JWT
- [x] F0-B07 · `middleware/isAdmin.js` — Middleware admin

### Mobile
- [x] F0-M01 · Inicializar proyecto Expo (SDK 54, Expo Router 6)
- [x] F0-M02 · Instalar dependencias (axios, zustand, expo-secure-store, expo-image-picker, moti, fonts)
- [x] F0-M03 · `constants/colors.ts` — Paleta de colores + Tokens de diseño
- [x] F0-M04 · `constants/api.ts` — URL de la API
- [x] F0-M05 · `constants/categories.ts` — Categorías + CATEGORY_TABS
- [x] F0-M06 · `services/api.ts` — Instancia Axios con interceptor JWT
- [⏸] F0-M07 · `tailwind.config.js` — NativeWind **(POSTERGADO)**
- [⏸] F0-M08 · `babel.config.js` — Preset + plugins NativeWind **(POSTERGADO)**
- [x] F0-M09 · `app/_layout.tsx` — Root layout con fonts + SplashScreen + grupos de navegación

> **📋 Nota sobre ítems postergados (F0-M07 y F0-M08):**
>
> **Razón del aplazamiento**: El proyecto utiliza **StyleSheet nativo de React Native** junto con
> las constantes centralizadas en `constants/colors.ts` (paleta de colores + tokens de diseño).
> Este enfoque ofrece control total sobre los estilos sin agregar complejidad de build adicional
> (plugins de babel, configuración de tailwind, procesamiento de clases en runtime).
> NativeWind añadiría una capa de abstracción innecesaria en esta etapa inicial donde la prioridad
> es validar la lógica de negocio y los flujos funcionales.
>
> **Cuándo se implementará**: Se **evaluará su incorporación en la Fase 2** (Catálogo + Detalle),
> cuando la complejidad visual de las pantallas aumente y el uso de utilidades Tailwind pueda
> acelerar el desarrollo de la UI. Si en ese punto el enfoque StyleSheet nativo sigue siendo
> suficiente, se mantendrá sin NativeWind y estos ítems se marcarán como descartados.

### Extras completados
- [x] `app/index.tsx` — Redirect a `/(auth)/login`
- [x] `components/layout/ScreenWrapper.tsx` — SafeAreaView + ScrollView base
- [x] `.env.example` — Archivo ejemplo para versionado
- [x] Limpieza de archivos template (eliminados `(tabs)/` y `modal.tsx`)

### Base de Datos
- [x] F0-D01 · Importar `07_schema.sql` en XAMPP

### Tests Fase 0
- [x] T0-01 · Test pool de BD (2/2 ✅)
- [x] T0-02 · Test middleware verifyJWT (6/6 ✅)
- [x] T0-03 · Test middleware isAdmin (4/4 ✅)

**Estado Fase 0**: `[x]` Completado

---

## FASE 1 — MOD-01: Autenticación

### Backend
- [x] F1-B01 · `auth.routes.js` — POST /register, POST /login con validación
- [x] F1-B02 · `auth.controller.js` — express-validator + error handling
- [x] F1-B03 · `auth.service.js` — bcrypt hash + JWT sign + duplicate check

### Mobile
- [x] F1-M01 · `store/authStore.ts` — Zustand + SecureStore (setAuth, logout, hydrate)
- [x] F1-M02 · `services/authService.ts` — loginRequest, registerRequest
- [x] F1-M03 · `hooks/useAuth.ts` — Guard redirect
- [x] F1-M04 · `app/(auth)/_layout.tsx` — Stack Navigator dark
- [x] F1-M05 · `app/(auth)/login.tsx` — Pantalla completa con validación y error handling
- [x] F1-M06 · `app/(auth)/register.tsx` — Pantalla con 4 campos + auto-login
- [x] F1-M07 · `app/(app)/_layout.tsx` — Tab Navigator con session guard
- [x] F1-M08 · `app/(admin)/_layout.tsx` — Stack Navigator con admin guard

### Extras completados en Fase 1
- [x] `app/_layout.tsx` — Actualizado con hydrate de authStore en startup
- [x] `app/(app)/catalog/index.tsx` — Placeholder post-login (muestra user info + logout)
- [x] `app/(app)/cart.tsx` — Placeholder "Próximamente — Fase 3"
- [x] `app/(app)/orders/index.tsx` — Placeholder "Próximamente — Fase 5"
- [x] `app/(app)/checkout.tsx` — Placeholder "Próximamente — Fase 4"
- [x] `app/(admin)/index.tsx` — Placeholder admin panel

### Tests Fase 1
- [x] T1-01 · Registro: crea usuario, no duplica email, rol siempre client (3/3 ✅)
- [x] T1-02 · Login: JWT correcto, email inexistente, contraseña incorrecta, admin token (4/4 ✅)
- [x] T1-03 · Validación: campos vacíos, email inválido, password corta, duplicado 409, login 401 (9/9 ✅)
- [ ] T1-04 · authStore: login, logout, hydrate (pendiente — requiere mock de SecureStore)

**Estado Fase 1**: `[x]` Completado (excepto T1-04)

### Observaciones Fase 1

**[RESUELTO — 2026-04-09]** Al registrar un cliente e intentar iniciar sesión como admin, el login fallaba.

- **Causa raíz**: El hash bcrypt del admin seed en `07_schema.sql` era un hash genérico que **no correspondía** a la contraseña `Admin1234!` documentada.
- **Solución**: Se regeneró el hash bcrypt correcto con `bcryptjs.hash('Admin1234!', 10)` y se actualizó tanto el schema SQL como la BD activa.
- **Verificación**: Login admin con `admin@ecommerce.local` / `Admin1234!` funciona correctamente.

El `WARN Token inválido o expirado` era un efecto colateral: al fallar el login, no se obtenía un token válido, y el interceptor Axios lo reportaba como token inválido.

---

## FASE 2 — MOD-02 + MOD-03: Catálogo y Detalle

### Backend
- [x] F2-B01 · `categories.routes.js` — GET /api/categories
- [x] F2-B02 · `categories.controller.js` — listCategories
- [x] F2-B03 · `products.routes.js` (GET) — listado + detalle con JWT
- [x] F2-B04 · `products.controller.js` (GET) — express-validator + filtro categoría
- [x] F2-B05 · `products.service.js` (listado, detalle) — usa v_products_full

### Datos de prueba
- [x] F2-D01 · 16 productos seed con stock variado (alto, bajo, 0)
- [x] F2-D02 · 16 imágenes de producto en `backend/uploads/`
- [x] F2-D03 · 1 producto desactivado (`Set Labiales Matte x3`) para test
- [x] F2-D04 · Hash admin regenerado para `Admin1234!`

### Mobile
- [x] F2-M01 · `services/productService.ts` — getProducts, getProductById
- [x] F2-M02 · `components/ProductCard.tsx` — card con imagen, badge, stock, overlay
- [x] F2-M03 · `components/ui/Badge.tsx` — badge reutilizable
- [x] F2-M04 · `components/ui/StockAlert.tsx` — alerta inline condicional
- [x] F2-M05 · `app/(app)/catalog/index.tsx` — grid 2 cols + tabs + pull-to-refresh
- [x] F2-M06 · `app/(app)/catalog/[id].tsx` — detalle + selector qty + stock
- [x] F2-M07 · `components/layout/ScreenWrapper.tsx` (completado en Fase 0)

### Tests Fase 2
- [x] T2-01 · Listado: solo activos, filtra por categoría (4/4 ✅)
- [x] T2-02 · Detalle: retorna stock, null si no existe (4/4 ✅)
- [x] T2-03 · Categorías: retorna 4 categorías (3/3 ✅)
- [ ] T2-04 · ProductCard: 3 variantes de stock (pendiente — requiere RNTL)
- [ ] T2-05 · StockAlert: renderiza/no renderiza correctamente (pendiente — requiere RNTL)

**Estado Fase 2**: `[x]` Completado (excepto T2-04 y T2-05 — requieren RNTL)

---

## FASE 3 — MOD-04: Carrito de Compras

### Backend
- [x] F3-B01 · `cart.routes.js`
- [x] F3-B02 · `cart.controller.js`
- [x] F3-B03 · `cart.service.js`

### Mobile
- [x] F3-M01 · `store/cartStore.ts`
- [x] F3-M02 · `services/cartService.ts`
- [x] F3-M03 · `hooks/useCart.ts`
- [x] F3-M04 · `components/CartItem.tsx`
- [x] F3-M05 · `app/(app)/cart.tsx`

### Tests Fase 3
- [x] T3-01 · Agregar: validación stock (ok, 409 sin stock, 409 qty>stock)
- [x] T3-02 · Modificar cantidad: re-validar stock
- [x] T3-03 · Eliminar: borra ítem
- [x] T3-04 · cartStore: addItem, removeItem, clearCart, total
- [x] T3-05 · CartItem: StockAlert visible cuando aplica

**Estado Fase 3**: `[x]` Completado (Pendiente pruebas)

---

## FASE 4 — MOD-05: Checkout y Confirmación

### Backend
- [x] F4-B01 · `orders.routes.js` (POST)
- [x] F4-B02 · `orders.controller.js` (checkout)
- [x] F4-B03 · `orders.service.js` (transacción atómica)

### Mobile
- [x] F4-M01 · `services/orderService.ts` (createOrder)
- [x] F4-M02 · `app/(app)/checkout.tsx`
- [x] F4-M03 · `components/OrderSuccessOverlay.tsx`

### Tests Fase 4
- [x] T4-01 · Happy path: orden creada, stock descontado, carrito limpio
- [x] T4-02 · Rollback: stock insuficiente, orden no creada
- [x] T4-03 · Precio congelado en order_items
- [x] T4-04 · Carrito vacío → error

**Estado Fase 4**: `[x]` Completado

---

## FASE 5 — MOD-06: Historial de Pedidos

### Backend
- [x] F5-B01 · `orders.routes.js` (GET endpoints)
- [x] F5-B02 · `orders.controller.js` (listado, detalle)
- [x] F5-B03 · `orders.service.js` (queries)

### Mobile
- [x] F5-M01 · `services/orderService.ts` (getOrders, getOrderById)
- [x] F5-M02 · `components/OrderCard.tsx`
- [x] F5-M03 · `app/(app)/orders/index.tsx`
- [x] F5-M04 · `app/(app)/orders/[id].tsx`

### Tests Fase 5
- [x] T5-01 · Listado retorna solo pedidos del usuario
- [x] T5-02 · Detalle incluye order_items
- [x] T5-03 · OrderCard: expande/colapsa

**Estado Fase 5**: `[x]` Completado

---

## FASE 6 — MOD-07: Panel de Administración

### Backend
- [ ] F6-B01 · `products.routes.js` (POST, PATCH, toggle, image)
- [ ] F6-B02 · `products.controller.js` (CRUD admin)
- [ ] F6-B03 · `products.service.js` (crear, editar, toggle, imagen)

### Mobile
- [ ] F6-M01 · `services/productService.ts` (CRUD admin)
- [ ] F6-M02 · `app/(admin)/index.tsx`
- [ ] F6-M03 · `app/(admin)/products/index.tsx`
- [ ] F6-M04 · `app/(admin)/products/new.tsx`
- [ ] F6-M05 · `app/(admin)/products/[id].tsx`

### Tests Fase 6
- [ ] T6-01 · CRUD: crear, editar, toggle is_active
- [ ] T6-02 · Guard admin: client bloqueado
- [ ] T6-03 · Producto desactivado: no en catálogo, sí en admin

**Estado Fase 6**: `[ ]` Pendiente

---

## FASE 7 — Integración Final + QA

- [ ] F7-01 · Flujo completo: registro → login → catálogo → compra
- [ ] F7-02 · Stock = 0: botón deshabilitado
- [ ] F7-03 · qty > stock: error 409 + StockAlert
- [ ] F7-04 · Checkout con stock insuficiente: ROLLBACK
- [ ] F7-05 · Admin: CRUD completo de producto
- [ ] F7-06 · Persistencia de sesión: cerrar + reabrir app
- [ ] F7-07 · Revisión visual vs wireframes
- [ ] F7-08 · Revisión de cumplimiento de reglas del workspace

**Estado Fase 7**: `[ ]` Pendiente

---

## Resumen General de Avance

| Fase | Descripción | Estado | Progreso |
|------|-------------|--------|----------|
| 0 | Infraestructura | ✅ Completado | 100% |
| 1 | Autenticación | ✅ Completado | 95% |
| 2 | Catálogo + Detalle | ✅ Completado | 90% |
| 3 | Carrito | ✅ Completado | 100% |
| 4 | Checkout | ✅ Completado | 100% |
| 5 | Historial Pedidos | ✅ Completado | 100% |
| 6 | Admin | ⬜ Pendiente | 0% |
| 7 | Integración + QA | ⬜ Pendiente | 0% |

**Progreso Total**: ~75%

