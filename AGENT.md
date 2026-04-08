# AGENT.md — Guía de Desarrollo para Agente IA
## ECommerce Demo · App Móvil Expo + React Native + Express + MySQL XAMPP

---

## ¿Qué es este proyecto?

Una aplicación móvil de ecommerce de demostración desarrollada con **Expo (React Native)**
para el frontend móvil y **Express + MySQL (XAMPP)** para el backend API REST local.
El objetivo es implementar el flujo principal de compra de productos físicos de forma
simple y funcional, sin dependencias de servicios en la nube.

---

## Documentos del Proyecto

Lee los siguientes documentos ubicados en la carpeta `/docs` en este orden antes de comenzar cualquier tarea de desarrollo.
Cada uno provee contexto esencial para tomar decisiones correctas de implementación.

| # | Archivo                              | Cuándo consultarlo                                        |
|---|--------------------------------------|-----------------------------------------------------------|
| 1 | `01_diagrama_entidad_relacion.md`    | Al trabajar con la base de datos o la API                 |
| 2 | `02_stack_tecnologico.md`            | Al instalar dependencias o configurar el entorno          |
| 3 | `03_estructura_infraestructura.md`   | Al crear archivos, carpetas o configurar conexiones       |
| 4 | `04_modulos_planificados.md`         | Al implementar cualquier módulo o endpoint                |
| 5 | `05_diseno_estructura_paginas.md`    | Al crear o modificar pantallas de la app móvil            |
| 6 | `06_prompt_stitch_ai.md`             | Solo para generación de mockups visuales en Stitch AI     |
| 7 | `07_schema.sql`                      | Al necesitar referencia de tablas, columnas o tipos       |

---

## Estructura del Repositorio

```
ecommerce-demo/
├── docs/             ← Documentación del proyecto
│   ├── 01_diagrama_entidad_relacion.md
│   ├── 02_stack_tecnologico.md
│   ├── 03_estructura_infraestructura.md
│   ├── 04_modulos_planificados.md
│   ├── 05_diseno_estructura_paginas.md
│   ├── 06_prompt_stitch_ai.md
│   └── 07_schema.sql
├── backend/          ← API REST Node.js + Express + mysql2
├── mobile/           ← App Expo React Native (Expo Router)
├── database/
│   └── schema.sql    ← DDL MySQL + seed de datos
└── AGENT.md          ← Este archivo
```

---

## Reglas de Desarrollo — Cumplimiento Obligatorio

### General
- Nunca mezclar código del `backend/` con código del `mobile/`; son proyectos Node.js independientes.
- Toda comunicación entre la app y el backend es por HTTP REST; no hay acceso directo a la BD desde la app.
- Usar `async/await` + `try/catch` en todos los llamados a la API y operaciones de BD.
- Nunca hardcodear credenciales; usar variables de entorno (`backend/.env`) o constantes (`mobile/constants/`).
- Implementar buenas prácticas de programación y un desarrollo con modelo atómico, para que los componentes sean reutilizables y mantenibles.

### Backend (Express + mysql2)
- Usar el pool de conexiones definido en `src/config/db.js`; no crear conexiones individuales.
- Toda operación de creación de pedidos debe ejecutarse dentro de una **transacción MySQL** (`BEGIN / COMMIT / ROLLBACK`).
- Las contraseñas siempre se hashean con **bcryptjs** (no bcrypt nativo) antes de guardar en BD.
- Los tokens JWT se generan con `jsonwebtoken` y se verifican en el middleware `verifyJWT.js`.
- Endpoints que modifican productos o gestionan el sistema requieren el middleware `isAdmin.js`.
- El middleware `cors({ origin: '*' })` debe estar activo durante desarrollo local.
- Las imágenes se sirven como archivos estáticos desde `backend/uploads/`.

### App Móvil (Expo Router + React Native)
- Toda la navegación usa **Expo Router** con el sistema de grupos de archivos:
  - `(auth)/` → pantallas públicas (login, registro)
  - `(app)/` → pantallas protegidas con Tab Bar
  - `(admin)/` → pantallas de administrador sin Tab Bar de cliente
- El **JWT se almacena en Expo SecureStore**, nunca en memoria volátil o AsyncStorage sin cifrar.
- El estado global de sesión y carrito se maneja con **Zustand** (`authStore.ts`, `cartStore.ts`).
- Al iniciar la app, leer el JWT de SecureStore y rehidratar el `authStore`.
- Los guards de sesión y de admin se implementan en los `_layout.tsx` de cada grupo usando `<Redirect>`.
- Las animaciones de la confirmación de pedido usan **Moti** (no Framer Motion, que es solo web).
- Los estilos usan **NativeWind** (clases Tailwind) y variables del archivo `constants/colors.ts`.
- Los componentes de React Native son: `View`, `Text`, `Pressable`, `FlatList`, `TextInput`, `ScrollView`, `Image`, `Modal`. No usar elementos HTML (`div`, `button`, etc.).
- Área táctil mínima para todos los elementos interactivos: **44×44px**.

### Gestión de Stock (crítico)
- **Frontend**: Deshabilitar el botón "Agregar al carrito" si `stock = 0`. Limitar el selector de cantidad al stock disponible.
- **Backend al agregar al carrito** (`cart.service.js`): validar que la cantidad solicitada no supere el stock; retornar HTTP 409 con `{ error: 'STOCK_EXCEEDED', available: N }` si falla.
- **Backend al confirmar pedido** (`orders.service.js`): ejecutar la validación de stock + descuento + creación de orden + limpieza de carrito en una **única transacción atómica**.
- **Frontend en carrito y checkout**: mostrar el componente `StockAlert` con el mensaje de error cuando la API retorna 409.
- Nunca confiar solo en la validación del frontend; el backend es la fuente de verdad del stock.

---

## Configuración de Entorno

### Prerrequisitos
- XAMPP instalado con MySQL activo en el puerto `3306`
- Node.js 20+ LTS
- Expo CLI (`npm install -g expo-cli` o usar `npx expo`)
- Android Studio con un AVD configurado (Se tiene configurado un emulador de android para las pruebas respectivas)

### Credenciales MySQL XAMPP (por defecto)
```
Host:     localhost
Puerto:   3306
Usuario:  root
Password: (vacía — sin contraseña)
BD:       ecommerce_demo
```

### Variables de entorno del backend (`backend/.env`)
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

### URL de la API desde la app móvil (`mobile/constants/api.ts`)
```ts
// Android Emulator:
export const API_BASE_URL = 'http://10.0.2.2:3001/api';
// iOS Simulator:
// export const API_BASE_URL = 'http://localhost:3001/api';
// Dispositivo físico (reemplaza con tu IP):
// export const API_BASE_URL = 'http://192.168.1.X:3001/api';
```

---

## Comandos de Arranque

```bash
# 1. Base de datos (Ya desplegado manualmente, base de datos importada directamente según el schema '07_schema.sql')
#    Abrir XAMPP → iniciar MySQL
#    phpMyAdmin → crear BD "ecommerce_demo" → importar database/schema.sql

# 2. Backend
cd backend && npm install && npm run dev
# Servidor en http://localhost:3001

# 3. App móvil
cd mobile && npm install && npx expo start
# Presionar 'a' → Android Emulator
# Escanear QR   → Expo Go en dispositivo físico
```

---

## Datos de Prueba (incluidos en el schema.sql)

| Rol   | Email                   | Password   |
|-------|-------------------------|------------|
| Admin | admin@ecommerce.local   | Admin1234! |

**Productos de prueba**: 16 productos distribuidos en las 4 categorías.
- Genera imágenes dentro de la carpeta designada (de ser necesario conectate y genera estas imágenes mediante el servidor MCP de Stitch AI)
- 1 producto sin stock (para probar estado "Sin stock")
- 3 productos con stock bajo 1–5 (para probar alerta de stock bajo)
- El resto con stock normal

---

## Módulos y Pantallas — Referencia Rápida

### Backend: Endpoints disponibles

| Método | Endpoint                    | Auth     | Descripción                      |
|--------|-----------------------------|----------|----------------------------------|
| POST   | `/api/auth/register`        | Público  | Registrar cliente                |
| POST   | `/api/auth/login`           | Público  | Iniciar sesión → JWT             |
| GET    | `/api/categories`           | JWT      | Listar categorías                |
| GET    | `/api/products`             | JWT      | Listar productos (filtro `?category=slug`) |
| GET    | `/api/products/:id`         | JWT      | Detalle de producto              |
| POST   | `/api/products`             | Admin    | Crear producto                   |
| PATCH  | `/api/products/:id`         | Admin    | Editar producto                  |
| PATCH  | `/api/products/:id/toggle`  | Admin    | Activar/desactivar producto      |
| POST   | `/api/products/:id/image`   | Admin    | Subir imagen (multer)            |
| GET    | `/api/cart`                 | JWT      | Ver carrito del usuario          |
| POST   | `/api/cart`                 | JWT      | Agregar ítem (valida stock)      |
| PATCH  | `/api/cart/:id`             | JWT      | Actualizar cantidad (valida stock)|
| DELETE | `/api/cart/:id`             | JWT      | Eliminar ítem del carrito        |
| GET    | `/api/orders`               | JWT      | Historial de pedidos del usuario |
| GET    | `/api/orders/:id`           | JWT      | Detalle de un pedido             |
| POST   | `/api/orders`               | JWT      | Crear pedido (transacción stock) |

### App Móvil: Pantallas (Expo Router)

| Archivo                          | Pantalla                        |
|----------------------------------|---------------------------------|
| `(auth)/login.tsx`               | Inicio de sesión                |
| `(auth)/register.tsx`            | Registro de usuario             |
| `(app)/catalog/index.tsx`        | Catálogo con tabs de categoría  |
| `(app)/catalog/[id].tsx`         | Detalle de producto + stock     |
| `(app)/cart.tsx`                 | Carrito con alertas de stock    |
| `(app)/checkout.tsx`             | Resumen + finalizar pedido      |
| `(app)/orders/index.tsx`         | Historial de pedidos            |
| `(app)/orders/[id].tsx`          | Detalle de un pedido            |
| `(admin)/products/index.tsx`     | Lista de productos (admin)      |
| `(admin)/products/new.tsx`       | Crear producto                  |
| `(admin)/products/[id].tsx`      | Editar producto                 |

---

## Flujo Principal de Compra

```
App inicia → lee JWT de SecureStore
  │
  ├─ sin JWT → (auth)/login
  │                └─ éxito → (app)/catalog
  │
  └─ con JWT → (app)/catalog
                    │ tap ProductCard
                    ▼
              (app)/catalog/[id]   ← stock indicator
                    │ "Agregar al carrito" → POST /api/cart
                    │ badge Tab Bar +1
                    ▼
              Tab "Carrito" → (app)/cart
                    │ "IR AL CHECKOUT"
                    ▼
              (app)/checkout       ← resumen del pedido
                    │ "FINALIZAR PEDIDO" → POST /api/orders (transacción)
                    │ éxito
                    ▼
              OrderSuccessOverlay  ← animación Moti
                    │ "Ver mis pedidos"
                    ▼
              (app)/orders         ← historial
```

---

## Errores Comunes y Soluciones

| Problema                              | Causa probable                          | Solución                                               |
|---------------------------------------|-----------------------------------------|--------------------------------------------------------|
| App no conecta al backend             | URL incorrecta para el entorno          | Cambiar `API_BASE_URL` en `constants/api.ts`; Android Emulator usa `10.0.2.2` |
| Error CORS al hacer peticiones        | CORS no configurado en Express          | Verificar `app.use(cors({ origin: '*' }))` en `backend/src/app.js` |
| JWT no persiste al cerrar la app      | Guardado en memoria, no en SecureStore  | Usar `Expo.SecureStore.setItemAsync` en el `authStore` |
| MySQL no conecta                      | XAMPP MySQL no está corriendo           | Abrir panel XAMPP y iniciar el servicio MySQL          |
| Imagen no carga en la app             | URL relativa no accesible desde el emulador | Usar URL completa: `http://10.0.2.2:3001/uploads/file.jpg` |
| Error 409 al agregar al carrito       | Stock insuficiente (comportamiento esperado) | Mostrar `StockAlert` con `available` de la respuesta |
| Módulo Reanimated no funciona         | Falta plugin en babel.config.js         | Agregar `'react-native-reanimated/plugin'` al preset Expo |
| `useFont` no carga fuentes            | Splash screen se cierra antes           | Usar `SplashScreen.preventAutoHideAsync()` en `_layout.tsx` |

---