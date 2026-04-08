---
description: Reglas del workspace para el proyecto ECommerce Demo — Expo + Express + MySQL XAMPP
---

# Reglas del Workspace — ECommerce Demo

> Estas reglas son de cumplimiento **obligatorio** para todo agente o desarrollador que trabaje en este repositorio.

---

## 1. Arquitectura del Proyecto

- El proyecto es un **monorepo** con dos aplicaciones independientes: `backend/` (API REST) y `mobile/` (app Expo/React Native).
- **Nunca mezclar** código de `backend/` con código de `mobile/`; cada uno tiene su propio `package.json` y `node_modules/`.
- La comunicación entre frontend y backend es **exclusivamente HTTP REST**; la app móvil **nunca** accede directamente a MySQL.
- La base de datos es **MySQL 8.x en XAMPP** (puerto 3306, usuario `root`, sin contraseña).

---

## 2. Documentación de Referencia Obligatoria

Antes de implementar cualquier cambio, **consultar** el documento correspondiente en `/docs`:

| Acción                                 | Documento a consultar                       |
|----------------------------------------|---------------------------------------------|
| Trabajar con BD o diseñar queries      | `01_diagrama_entidad_relacion.md`          |
| Instalar dependencias o configurar env | `02_stack_tecnologico.md`                  |
| Crear archivos/carpetas/configurar     | `03_estructura_infraestructura.md`         |
| Implementar módulo o endpoint          | `04_modulos_planificados.md`               |
| Crear o modificar pantallas UI         | `05_diseno_estructura_paginas.md`          |
| Generar mockups en Stitch AI           | `06_prompt_stitch_ai.md`                   |
| Referencia de tablas y tipos SQL       | `07_schema.sql`                            |
| Verificar estado del desarrollo        | `08_planificacion_desarrollo.md`           |
| Seguimiento de progreso por módulo     | `09_seguimiento_desarrollo.md`             |

---

## 3. Reglas del Backend (Express + mysql2)

// turbo-all

1. **Pool de conexiones**: Usar únicamente el pool definido en `backend/src/config/db.js`. No crear conexiones individuales.
2. **Estructura modular**: Cada módulo sigue el patrón `routes → controller → service`. Crear archivos en `backend/src/modules/<modulo>/`.
3. **Transacciones MySQL**: Toda creación de pedido (`orders.service.js`) y operación de stock **debe** ejecutarse dentro de una transacción (`BEGIN / COMMIT / ROLLBACK`).
4. **Autenticación**:
   - Hashear contraseñas con **bcryptjs** (puro JS, sin binarios nativos).
   - Generar tokens con **jsonwebtoken** usando las vars `JWT_SECRET` y `JWT_EXPIRES_IN` de `.env`.
   - Verificar tokens en el middleware `verifyJWT.js`.
5. **Autorización admin**: Endpoints de gestión de productos requieren el middleware `isAdmin.js` encadenado después de `verifyJWT`.
6. **CORS**: Mantener `cors({ origin: '*' })` activo durante desarrollo local.
7. **Validación de inputs**: Usar `express-validator` en todos los endpoints. No confiar en la validación del frontend.
8. **Subida de imágenes**: Usar `multer` con destino `backend/uploads/`. Servir como estáticos con `express.static`.
9. **Async/Await**: Todas las operaciones asíncronas usan `async/await` con `try/catch`. Nunca callbacks anidados.
10. **Variables de entorno**: Nunca hardcodear credenciales. Usar `dotenv` y el archivo `backend/.env`.

---

## 4. Reglas de la App Móvil (Expo Router + React Native)

1. **Navegación**: Usar **Expo Router** con grupos de archivos:
   - `(auth)/` → pantallas públicas (login, registro), sin Tab Bar
   - `(app)/` → pantallas protegidas con Tab Bar inferior
   - `(admin)/` → pantallas de administrador, sin Tab Bar de cliente
2. **Almacenamiento seguro**: El JWT se almacena en **Expo SecureStore**, nunca en AsyncStorage ni en memoria volátil.
3. **Estado global**: Usar **Zustand** para `authStore.ts` (sesión) y `cartStore.ts` (carrito).
4. **Rehidratación**: Al iniciar la app, leer JWT de SecureStore y rehidratar `authStore` antes de renderizar.
5. **Guards de navegación**: Implementar en `_layout.tsx` de cada grupo usando `<Redirect>`.
6. **Componentes React Native**: Usar `View`, `Text`, `Pressable`, `FlatList`, `TextInput`, `ScrollView`, `Image`, `Modal`. **Nunca** elementos HTML (`div`, `button`, `input`).
7. **Estilos**: Usar **NativeWind** (clases Tailwind) y constantes de `constants/colors.ts`.
8. **Tipografía**: Syne (títulos), DM Sans (cuerpo), JetBrains Mono (precios/números) via `expo-font`.
9. **Animaciones**: Usar **Moti + React Native Reanimated** para la confirmación de pedido y transiciones. No Framer Motion.
10. **Área táctil mínima**: 44×44px para todos los elementos interactivos.
11. **HTTP Client**: Usar **Axios** con interceptor para Bearer JWT en `services/api.ts`.

---

## 5. Reglas de Gestión de Stock (Críticas)

1. **Frontend**: Deshabilitar botón "Agregar al carrito" si `stock = 0`. Limitar selector de cantidad al stock disponible.
2. **Backend al agregar al carrito**: Validar que `quantity ≤ stock`; retornar HTTP 409 si no.
3. **Backend al confirmar pedido**: Validar stock → descontar → crear orden → limpiar carrito en **una única transacción atómica**.
4. **Frontend en carrito/checkout**: Mostrar `StockAlert` con el mensaje del error 409.
5. **Regla de oro**: El backend es la **única fuente de verdad** del stock. La validación frontend es complementaria.

---

## 6. Reglas de Diseño Visual

- **Dark Mode exclusivo**: Fondo `#071327`, superficies `#0d1f3c`.
- **Color de acción único**: `#74b8d3` (celeste) para todos los elementos interactivos.
- **Token de bordes**: `#1a2f4a` para separadores y bordes sutiles.
- **Border radius**: Cards `12px`, botones `8px`, inputs `8px`.
- **Padding de pantalla**: `16px` horizontal en todas las pantallas.
- **Sin gradientes llamativos**. Estética premium y contenida.

---

## 7. Reglas de Testing

1. **Pruebas unitarias por módulo**: Cada módulo del backend (`auth`, `products`, `categories`, `cart`, `orders`) debe tener su carpeta de tests en `backend/__tests__/modules/<modulo>/`.
2. **Framework de testing**: Usar **Jest** para backend y **Jest + React Native Testing Library** para el frontend.
3. **Mocking**: Mockear el pool de MySQL (`mysql2/promise`) en tests del backend. No hacer queries reales a la BD en unit tests.
4. **Cobertura mínima**: Apuntar a ≥80% de cobertura en services del backend.
5. **Naming convention**: Archivos de test siguen el patrón `<nombre>.test.js` (backend) o `<nombre>.test.tsx` (mobile).
6. **Validar reglas de negocio**: Los tests del carrito y órdenes **deben** verificar los escenarios de stock (RN-01 a RN-08).

---

## 8. Reglas de Git y Versionado

1. **Commits atómicos**: Un commit por funcionalidad o fix. No commits gigantes.
2. **Mensajes descriptivos**: Formato `tipo(módulo): descripción`. Ejemplo: `feat(cart): add stock validation on add item`.
3. **Branches**: `main` (producción), `develop` (integración), `feature/<modulo>` (desarrollo).
4. **No commitear**: `node_modules/`, `.env`, `backend/uploads/`, `.expo/`, `.agent/skills/`.

---

## 9. Flujo de Trabajo del Agente

1. **Antes de implementar**: Leer la documentación pertinente de `/docs`.
2. **Orden de desarrollo**: Seguir el orden de módulos MOD-01 → MOD-07 según `04_modulos_planificados.md`.
3. **Validar dependencias**: No iniciar un módulo sin que sus dependencias estén completas (ej: Cart requiere Products y Auth).
4. **Actualizar seguimiento**: Tras completar un módulo, actualizar `docs/09_seguimiento_desarrollo.md`.
5. **Testing**: Escribir tests unitarios del módulo antes de pasar al siguiente.
6. **Diseño UI**: Consultar los wireframes en `05_diseno_estructura_paginas.md` y usar Stitch AI como referencia visual según `06_prompt_stitch_ai.md`.

---

## 10. Comandos Frecuentes

```bash
# Backend
cd backend && npm install && npm run dev     # Levantar API en :3001

# Mobile
cd mobile && npm install && npx expo start   # Levantar Metro Bundler

# Tests backend
cd backend && npm test                       # Ejecutar Jest

# Tests mobile
cd mobile && npm test                        # Ejecutar Jest + RNTL

# Base de datos
# XAMPP → MySQL → phpMyAdmin → importar 07_schema.sql
```
