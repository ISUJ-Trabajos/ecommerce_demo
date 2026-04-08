# ECommerce Demo

Aplicación móvil de ecommerce desarrollada con **Expo / React Native** (frontend) y **Express + MySQL XAMPP** (backend API REST). Implementa un flujo completo de compra: catálogo, carrito, checkout con gestión de stock atómica, historial de pedidos y panel de administración.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Mobile | Expo SDK 54 · React Native · Expo Router 6 |
| Estado | Zustand · Expo SecureStore |
| Backend | Node.js 20+ · Express 4 · mysql2/promise |
| Base de datos | MySQL 8.x via XAMPP (puerto 3306) |
| Auth | JWT (jsonwebtoken) · bcryptjs |
| Testing | Jest · Supertest |
| Tipado | TypeScript (mobile) |

---

## Requisitos Previos

- **Node.js** 20 o superior
- **XAMPP** con MySQL corriendo en el puerto 3306
- **Expo CLI** — `npm install -g expo-cli` (opcional, `npx expo` funciona sin instalación global)
- **Expo Go** en tu dispositivo físico, o un emulador Android / simulador iOS

---

## Instalación Inicial

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd ecommerce_demo
```

### 2. Configurar la base de datos (XAMPP)

1. Abre **phpMyAdmin** en `http://localhost/phpmyadmin`
2. Crea una base de datos llamada `ecommerce_demo`
3. Importa el archivo de esquema:
   - Ve a la pestaña **Importar**
   - Selecciona el archivo `docs/07_schema.sql`
   - Haz clic en **Continuar**

El script crea todas las tablas, relaciones, stored procedures y seed de productos de prueba.

### 3. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo de entorno copiando el ejemplo:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Edita `backend/.env` si tu configuración de MySQL difiere (usuario, contraseña, puerto):

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # vacío por defecto en XAMPP
DB_NAME=ecommerce_demo
JWT_SECRET=cambia_esto_en_produccion
JWT_EXPIRES_IN=7d
```

### 4. Configurar la App Móvil

```bash
cd mobile
npm install
```

Ajusta la URL de la API en `mobile/constants/api.ts` según tu entorno:

```ts
// Android Emulator
export const API_BASE_URL = 'http://10.0.2.2:3001/api';

// iOS Simulator
export const API_BASE_URL = 'http://localhost:3001/api';

// Dispositivo físico (reemplaza con tu IP local)
export const API_BASE_URL = 'http://192.168.X.X:3001/api';
```

---

## Ejecución en Desarrollo

Abre **dos terminales** simultáneas:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Servidor en http://localhost:3001
# Health check: http://localhost:3001/api/health
```

**Terminal 2 — Mobile:**
```bash
cd mobile
npx expo start
# Escanea el QR con Expo Go, o presiona 'a' para emulador Android, 'i' para iOS
```

---

## Tests

```bash
# Backend (todos los tests)
cd backend
npm test

# Con cobertura
npm run test:coverage
```

Resultado esperado: **5 suites, 28 tests** (Fase 0 + Fase 1 completadas).

---

## Estructura del Proyecto

```
ecommerce_demo/
├── backend/                    ← API REST Express
│   ├── src/
│   │   ├── app.js              ← Express setup (CORS, rutas, static)
│   │   ├── config/db.js        ← Pool MySQL
│   │   ├── middleware/         ← verifyJWT · isAdmin
│   │   └── modules/
│   │       └── auth/           ← routes · controller · service
│   ├── __tests__/              ← Tests Jest + Supertest
│   ├── server.js               ← Entry point
│   └── .env.example            ← Variables de entorno (plantilla)
│
├── mobile/                     ← App Expo / React Native
│   ├── app/
│   │   ├── _layout.tsx         ← Root layout (fuentes + hydrate sesión)
│   │   ├── index.tsx           ← Redirect a /(auth)/login
│   │   ├── (auth)/             ← Login · Registro (sin Tab Bar)
│   │   ├── (app)/              ← Catálogo · Carrito · Pedidos (Tab Bar + guard JWT)
│   │   └── (admin)/            ← Panel Admin (guard admin role)
│   ├── components/layout/      ← ScreenWrapper
│   ├── constants/              ← colors · api · categories
│   ├── services/               ← api.ts (Axios) · authService.ts
│   ├── store/                  ← authStore.ts (Zustand + SecureStore)
│   └── hooks/                  ← useAuth.ts
│
└── docs/                       ← Documentación del proyecto
    ├── 01_diagrama_entidad_relacion.md
    ├── 02_stack_tecnologico.md
    ├── 03_estructura_infraestructura.md
    ├── 04_modulos_planificados.md
    ├── 05_diseno_estructura_paginas.md
    ├── 06_prompt_stitch_ai.md
    ├── 07_schema.sql
    ├── 08_planificacion_desarrollo.md  ← Plan de implementación por fases
    └── 09_seguimiento_desarrollo.md    ← Checklist de progreso
```

---

## Módulos Planificados

| Fase | Módulo | Estado |
|------|--------|--------|
| 0 | Infraestructura base (backend + mobile) | ✅ Completo |
| 1 | Autenticación (registro + login) | ✅ Completo |
| 2 | Catálogo + Detalle de producto | ⬜ Pendiente |
| 3 | Carrito de compras | ⬜ Pendiente |
| 4 | Checkout + confirmación | ⬜ Pendiente |
| 5 | Historial de pedidos | ⬜ Pendiente |
| 6 | Panel de administración | ⬜ Pendiente |
| 7 | Integración final + QA | ⬜ Pendiente |

Consulta [`docs/09_seguimiento_desarrollo.md`](./docs/09_seguimiento_desarrollo.md) para el estado detallado de cada tarea.

---

## Uso con Agentes de IA

Este proyecto está configurado para trabajar con agentes de IA (Antigravity, Gemini CLI, Claude Code, etc.) mediante un sistema de **skills** y un archivo `AGENT.md`.

### AGENT.md

El archivo [`AGENT.md`](./AGENT.md) en la raíz del repositorio contiene las instrucciones que el agente debe seguir: arquitectura del proyecto, reglas de desarrollo, convenciones de código y notas sobre la base de datos. **Los agentes lo leen automáticamente al iniciar.**

### Skills (Habilidades de IA)

Las skills son módulos de instrucciones especializadas que extienden las capacidades del agente para tareas como diseño de UI, generación de pantallas, pruebas, despliegue, etc.

> **Las skills NO están incluidas en el repositorio** (excluidas en `.gitignore`). Deben instalarse localmente antes de comenzar a desarrollar con un agente.

Para instalar las skills requeridas, sigue las instrucciones detalladas en:

**[`skill_agent_install.md`](./skill_agent_install.md)**

Este documento cubre la instalación de 4 colecciones de skills:

| Colección | Skills | Uso |
|-----------|--------|-----|
| **Stitch Skills** (Google Labs) | `stitch-design`, `design-md`, `enhance-prompt`, `react-components`, `remotion`, `shadcn-ui`, `stitch-loop`, `taste-design` | Diseño UI, generación de pantallas, conversión a componentes |
| **UI/UX Pro Max** (NextLevelBuilder) | `ui-ux-pro-max` | Motor de diseño con 67 estilos, 161 paletas, 57 tipografías |
| **React Best Practices** (Vercel Labs) | `react-best-practices` | Optimización de rendimiento React / Next.js |
| **Expo Skills** (Expo Team) | `building-native-ui`, `native-data-fetching`, `expo-deployment`, + 9 más | Expo Router, EAS, módulos nativos, despliegue |

Una vez instaladas, el agente las detecta automáticamente al encontrarlas en `.agent/skills/`.

### Reglas del Workspace

Las reglas específicas de este proyecto para el agente están en:

```
.agent/workflows/workspace-rules.md
```

Incluyen convenciones de arquitectura, gestión de stock, paleta de colores, estrategia de testing y flujo de trabajo modular.

---

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor Express | `3001` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | *(vacío)* |
| `DB_NAME` | Nombre de la base de datos | `ecommerce_demo` |
| `JWT_SECRET` | Clave secreta para firmar JWT | *(cambiar en prod)* |
| `JWT_EXPIRES_IN` | Duración del token JWT | `7d` |

---

## Notas de Desarrollo

- **Gestión de stock**: El backend es la fuente de verdad. Todo el procesamiento de órdenes usa transacciones atómicas MySQL (`sp_create_order`) para evitar condiciones de carrera.
- **Modo oscuro exclusivo**: La app no tiene modo claro. Paleta fija: fondo `#071327`, acento celeste `#74b8d3`.
- **XAMPP requerido**: No hay soporte para servicios de BD en la nube en este proyecto de demostración.
