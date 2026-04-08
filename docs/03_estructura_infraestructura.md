# Estructura de Infraestructura del Proyecto

## Árbol de Directorios

```
ecommerce-demo/
│
├── backend/                              # API REST Express + MySQL
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # Pool mysql2 → XAMPP :3306
│   │   ├── middleware/
│   │   │   ├── verifyJWT.js              # Verifica Bearer token
│   │   │   └── isAdmin.js                # Guard role = 'admin'
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.controller.js
│   │   │   │   └── auth.service.js       # bcryptjs + jwt.sign
│   │   │   ├── products/
│   │   │   │   ├── products.routes.js
│   │   │   │   ├── products.controller.js
│   │   │   │   └── products.service.js   # CRUD + validación stock
│   │   │   ├── categories/
│   │   │   │   ├── categories.routes.js
│   │   │   │   └── categories.controller.js
│   │   │   ├── cart/
│   │   │   │   ├── cart.routes.js
│   │   │   │   ├── cart.controller.js
│   │   │   │   └── cart.service.js       # Validar stock al agregar/editar
│   │   │   └── orders/
│   │   │       ├── orders.routes.js
│   │   │       ├── orders.controller.js
│   │   │       └── orders.service.js     # Transacción: validar+descontar stock
│   │   └── app.js                        # Express setup, CORS abierto, rutas
│   ├── uploads/                          # Imágenes estáticas servidas por Express
│   ├── .env
│   ├── server.js                         # Entry point → app.listen(:3001)
│   └── package.json
│
└── mobile/                               # App Móvil — Expo SDK 51 + React Native
    ├── app/                              # Expo Router: cada archivo = una pantalla
    │   ├── _layout.tsx                   # Root layout: SafeAreaProvider + Zustand
    │   ├── index.tsx                     # Redirect → /(auth)/login
    │   ├── (auth)/                       # Grupo: pantallas públicas (sin tab bar)
    │   │   ├── _layout.tsx               # Stack Navigator para auth
    │   │   ├── login.tsx                 # Pantalla: Inicio de sesión
    │   │   └── register.tsx              # Pantalla: Registro
    │   ├── (app)/                        # Grupo: pantallas protegidas (con tab bar)
    │   │   ├── _layout.tsx               # Tab Navigator + guard de sesión
    │   │   ├── catalog/
    │   │   │   ├── index.tsx             # Pantalla: Catálogo con tabs de categoría
    │   │   │   └── [id].tsx              # Pantalla: Detalle de producto
    │   │   ├── cart.tsx                  # Pantalla: Carrito de compras
    │   │   ├── checkout.tsx              # Pantalla: Resumen y finalización
    │   │   └── orders/
    │   │       ├── index.tsx             # Pantalla: Historial de pedidos
    │   │       └── [id].tsx              # Pantalla: Detalle de pedido
    │   └── (admin)/                      # Grupo: pantallas solo admin
    │       ├── _layout.tsx               # Stack Navigator + guard isAdmin
    │       ├── products/
    │       │   ├── index.tsx             # Pantalla: Lista de productos admin
    │       │   ├── new.tsx               # Pantalla: Crear producto
    │       │   └── [id].tsx              # Pantalla: Editar producto
    │       └── index.tsx                 # Redirect → /admin/products
    │
    ├── components/                       # Componentes reutilizables
    │   ├── layout/
    │   │   └── ScreenWrapper.tsx         # SafeAreaView + ScrollView base
    │   ├── ui/
    │   │   ├── Button.tsx                # Botón primario / outline / ghost
    │   │   ├── Input.tsx                 # TextInput con ícono y error
    │   │   ├── Badge.tsx                 # Badges de categoría y estado
    │   │   ├── Spinner.tsx               # ActivityIndicator themed
    │   │   └── StockAlert.tsx            # Alerta inline roja de stock
    │   ├── ProductCard.tsx               # Tarjeta de producto para catálogo
    │   ├── CartItem.tsx                  # Ítem en la pantalla de carrito
    │   ├── OrderCard.tsx                 # Tarjeta de pedido en historial
    │   └── OrderSuccessOverlay.tsx       # Animación Moti de pedido confirmado
    │
    ├── store/
    │   ├── authStore.ts                  # Zustand: user, token, login, logout
    │   └── cartStore.ts                  # Zustand: items, agregar, quitar, limpiar
    │
    ├── services/
    │   ├── api.ts                        # Instancia Axios + interceptor Bearer JWT
    │   ├── authService.ts
    │   ├── productService.ts
    │   ├── cartService.ts
    │   └── orderService.ts
    │
    ├── hooks/
    │   ├── useAuth.ts                    # Lee authStore, redirige si no hay sesión
    │   └── useCart.ts                    # Helpers del cartStore
    │
    ├── constants/
    │   ├── api.ts                        # API_BASE_URL según entorno
    │   ├── colors.ts                     # Paleta #071327 / #74b8d3 como constantes
    │   └── categories.ts                 # Array de categorías para los tabs
    │
    ├── assets/
    │   ├── fonts/                        # Syne + DM Sans (via expo-font)
    │   └── images/
    │
    ├── tailwind.config.js                # NativeWind: paleta de colores custom
    ├── app.json                          # Config Expo (nombre, iconos, splash)
    ├── babel.config.js                   # Preset Expo + NativeWind plugin
    ├── tsconfig.json
    └── package.json
```

---

## Configuración de Conexión a la API (`mobile/constants/api.ts`)

```ts
// Ajusta la URL según el entorno de prueba:
//   Android Emulator  → http://10.0.2.2:3001/api
//   iOS Simulator     → http://localhost:3001/api
//   Dispositivo físico → http://192.168.X.X:3001/api

export const API_BASE_URL = 'http://10.0.2.2:3001/api';
```

---

## Configuración del Pool MySQL (`backend/src/config/db.js`)

```js
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',   // XAMPP: vacía
  database:           process.env.DB_NAME     || 'ecommerce_demo',
  waitForConnections: true,
  connectionLimit:    10,
});
```

---

## Archivo `backend/.env`

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_demo

JWT_SECRET=cambia_esto_en_produccion
JWT_EXPIRES_IN=7d
```

---

## Flujo Expo Router — Grupos de Navegación

```
app/
 ├── (auth)/          ← Sin tab bar, acceso público
 │    ├── login       ← Pantalla de inicio
 │    └── register
 │
 ├── (app)/           ← Con tab bar inferior, requiere JWT
 │    ├── catalog/    ← Tab "Catálogo"
 │    │    └── [id]   ← Stack sobre catálogo
 │    ├── cart        ← Tab "Carrito" (con badge)
 │    └── orders/     ← Tab "Pedidos"
 │         └── [id]   ← Stack sobre pedidos
 │
 └── (admin)/         ← Sin tab bar, requiere role='admin'
      └── products/
           ├── index
           ├── new
           └── [id]
```

### Guard de sesión en `(app)/_layout.tsx`
```ts
// Si no hay token en authStore → redirige a /(auth)/login
const { token } = useAuthStore();
if (!token) return <Redirect href="/(auth)/login" />;
```

### Guard de admin en `(admin)/_layout.tsx`
```ts
const { user } = useAuthStore();
if (!user || user.role !== 'admin') return <Redirect href="/(app)/catalog" />;
```

---

## Flujo de Gestión de Stock (Backend)

```
App solicita agregar al carrito
       │
       ▼
 cart.service.js
 SELECT stock FROM products WHERE id = ?
       ├─ stock = 0   → HTTP 409 { error: 'OUT_OF_STOCK' }
       ├─ qty > stock → HTTP 409 { error: 'STOCK_EXCEEDED', available: N }
       └─ ok          → INSERT/UPDATE cart_items ✅

App solicita finalizar pedido (POST /api/orders)
       │
       ▼
 orders.service.js — TRANSACTION MySQL
 ├─ Obtener cart_items del usuario
 ├─ SELECT stock FOR UPDATE por cada ítem
 ├─ Si falla alguno → ROLLBACK → HTTP 409 con detalle
 ├─ INSERT orders + INSERT order_items
 ├─ UPDATE products SET stock = stock - qty
 ├─ DELETE cart_items WHERE user_id = ?
 └─ COMMIT → HTTP 201 { order_id, total } ✅
```

---

## Comandos de Arranque

```bash
# Prerrequisito: XAMPP corriendo con MySQL activo en :3306

# 1. Crear base de datos
#    Opción A: phpMyAdmin → Nueva BD "ecommerce_demo" → Importar schema.sql
#    Opción B: mysql -u root ecommerce_demo < database/schema.sql

# 2. Backend (terminal 1)
cd backend
npm install
npm run dev        # nodemon → http://localhost:3001

# 3. App móvil (terminal 2)
cd mobile
npm install
npx expo start     # Abre Metro Bundler
                   # Presiona 'a' → Android Emulator
                   # Presiona 'i' → iOS Simulator
                   # Escanea QR  → Expo Go en dispositivo físico
```
