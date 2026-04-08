# Stack Tecnológico — ECommerce Demo (Móvil · Expo · Local)

## Principios de Selección
> Aplicación móvil nativa desarrollada con Expo (React Native). El backend corre localmente en Node.js conectado al MySQL de XAMPP. La app móvil consume la API REST a través de la red local o mediante el alias de emulador.

---

## Aplicación Móvil (Frontend — Expo / React Native)

| Tecnología                  | Versión  | Rol                                                          |
|-----------------------------|----------|--------------------------------------------------------------|
| **Expo**                    | SDK 51+  | Plataforma de desarrollo React Native (CLI + bundler Metro)  |
| **React Native**            | 0.74+    | Framework UI para componentes nativos iOS y Android          |
| **Expo Router**             | 3+       | Navegación file-based (similar a Next.js); rutas protegidas  |
| **NativeWind**              | 4+       | Clases Tailwind CSS adaptadas a React Native (StyleSheet)    |
| **Axios**                   | 1+       | Cliente HTTP para consumir la API REST con interceptores JWT |
| **Zustand**                 | 4+       | Estado global ligero: sesión de usuario y carrito            |
| **Moti**                    | 0.29+    | Animaciones declarativas para React Native                   |
| **React Native Reanimated** | 3+       | Motor de animaciones nativas (dependencia de Moti)           |
| **Expo SecureStore**        | 13+      | Almacenamiento seguro del JWT en keychain del dispositivo    |
| **Expo Image Picker**       | 15+      | Selección de imágenes desde galería (módulo admin)           |
| **React Native Safe Area Context** | 4+ | Manejo de notch, status bar e indicadores del sistema    |

### Por qué Expo sobre bare React Native
- Expo CLI con `npx expo start` levanta el proyecto sin configuración nativa de Android Studio ni Xcode.
- Expo Go permite probar la app en un dispositivo físico escaneando un QR, sin necesidad de compilar.
- Expo SDK gestiona permisos, cámara, galería y almacenamiento seguro con módulos listos.

### Reemplazos clave respecto a la versión web
| Web (versión anterior)  | Móvil Expo (esta versión)               |
|-------------------------|-----------------------------------------|
| Vite + React DOM        | Expo + React Native                     |
| React Router            | Expo Router (file-based)                |
| Tailwind CSS (web)      | NativeWind (Tailwind sobre StyleSheet)  |
| Framer Motion           | Moti + React Native Reanimated          |
| localStorage            | Expo SecureStore                        |
| `<div>`, `<button>`...  | `<View>`, `<Pressable>`, `<Text>`...    |
| CSS hover states        | `onPressIn` / `onPressOut` en Pressable |

### Herramientas de prueba
| Herramienta           | Plataforma     | Uso                                        |
|-----------------------|----------------|--------------------------------------------|
| **Expo Go**           | iOS / Android  | Prueba en dispositivo físico vía QR        |
| **Android Emulator**  | Windows/Mac    | Emulador Android (Android Studio AVD)      |
| **iOS Simulator**     | macOS only     | Simulador iOS (Xcode)                      |

---

## Backend (API REST)

| Tecnología            | Versión | Rol                                                |
|-----------------------|---------|----------------------------------------------------|
| **Node.js**           | 20+ LTS | Runtime del servidor                               |
| **Express**           | 4+      | Framework API REST                                 |
| **mysql2**            | 3+      | Driver MySQL con soporte a Promises y pool         |
| **jsonwebtoken**      | 9+      | Generación y verificación de tokens JWT            |
| **bcryptjs**          | 2+      | Hash de contraseñas (pure JS — sin binarios nativos)|
| **multer**            | 1+      | Upload de imágenes al directorio `/uploads`        |
| **cors**              | 2+      | CORS abierto (`origin: '*'`) para desarrollo local |
| **dotenv**            | 16+     | Variables de entorno desde `.env`                  |
| **express-validator** | 7+      | Validación de inputs en cada endpoint              |

> **Nota CORS**: La app Expo accede al backend por la IP de la máquina host (no `localhost`). Se requiere `cors({ origin: '*' })` durante el desarrollo local.

---

## Base de Datos

| Tecnología | Versión     | Config                                        |
|------------|-------------|-----------------------------------------------|
| **MySQL**  | 8.x (XAMPP) | Puerto `3306` · usuario `root` · password vacía |
| **mysql2** | 3+          | Pool de conexiones en el backend Express       |

---

## Herramientas de Desarrollo

| Herramienta  | Uso                                                   |
|--------------|-------------------------------------------------------|
| **XAMPP**    | MySQL 8.x + phpMyAdmin para gestión visual de BD      |
| **Nodemon**  | Reinicio automático del servidor Express en cambios   |
| **Postman**  | Prueba manual de endpoints REST                       |
| **Expo CLI** | `npx expo start` — servidor Metro + QR para Expo Go   |
| **ESLint**   | Linting JS/JSX (backend + app móvil)                  |
| **Prettier** | Formateo de código                                    |
| **Git**      | Control de versiones                                  |

---

## Arquitectura de Comunicación

```
┌──────────────────────────────────────────┐
│         APP MÓVIL (Expo / RN)            │
│  Android Emulator · iOS Sim · Expo Go    │
│                                          │
│  Zustand (auth + cart)                   │
│  Expo SecureStore (JWT)                  │
│  Axios (interceptor Bearer token)        │
└────────────────┬─────────────────────────┘
                 │
                 │  HTTP  ·  Authorization: Bearer <JWT>
                 │  Base URL: http://<IP_HOST>:3001/api
                 ▼
┌──────────────────────────────────────────┐
│       EXPRESS API  ·  Puerto 3001        │
│  verifyJWT  ·  isAdmin  ·  multer        │
│  mysql2 pool (transacciones de stock)    │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│     MySQL XAMPP  ·  Puerto 3306          │
│     ecommerce_demo                       │
└──────────────────────────────────────────┘
```

### URL Base de la API por entorno de prueba

| Entorno                     | Base URL                        | Razón                              |
|-----------------------------|---------------------------------|------------------------------------|
| **Android Emulator**        | `http://10.0.2.2:3001/api`      | Alias interno del emulador al host |
| **iOS Simulator**           | `http://localhost:3001/api`     | Comparte red con el host           |
| **Dispositivo físico (LAN)**| `http://192.168.X.X:3001/api`   | IP real de la máquina en la red    |

> Configurar la variable `API_BASE_URL` en `mobile/.env` o `mobile/constants/api.ts` según el entorno.

---

## Puertos del Sistema Local

| Servicio             | Puerto | URL de acceso                     |
|----------------------|--------|-----------------------------------|
| Expo Metro Bundler   | 8081   | http://localhost:8081             |
| Expo Dev Tools       | 19000  | Interno (usado por emulador / Go) |
| Express API Backend  | 3001   | http://localhost:3001/api         |
| MySQL XAMPP          | 3306   | localhost:3306                    |
| phpMyAdmin           | 80     | http://localhost/phpmyadmin       |
