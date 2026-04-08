# Prompt y Documentos para Stitch AI — ECommerce Demo (Móvil)

## Documentos a Adjuntar

| # | Archivo                              | Propósito                                           |
|---|--------------------------------------|-----------------------------------------------------|
| 1 | `05_diseno_estructura_paginas.md`    | Wireframes móviles y sistema de diseño              |
| 2 | `04_modulos_planificados.md`         | Funcionalidades, flujos y estados de error de stock |
| 3 | `02_stack_tecnologico.md`            | Stack Expo/React Native y librerías                 |

---

## Prompt Maestro

```
Eres un diseñador UI/UX experto en aplicaciones móviles ecommerce (iOS y Android).
Diseña el sistema completo de pantallas para una aplicación móvil de tienda en línea
desarrollada con Expo y React Native. La app es una demo local con foco en simplicidad
y en el flujo principal de compra de productos físicos.

════════════════════════════════════════
CONTEXTO TÉCNICO
════════════════════════════════════════

Plataforma: Aplicación móvil nativa (iOS + Android)
Framework: Expo SDK 51 + React Native 0.74
Navegación: Expo Router (Tab Bar inferior + Stack Navigator)
Estilos: NativeWind (Tailwind sobre StyleSheet)
Animaciones: Moti + React Native Reanimated

Dimensiones de referencia: 390×844px (iPhone 14) / 360×800px (Android estándar)
Las pantallas deben estar diseñadas para móvil, con elementos táctiles mínimos 44×44px.

════════════════════════════════════════
IDENTIDAD VISUAL
════════════════════════════════════════

Modo: Dark Mode exclusivo

Colores:
  bg:          #071327   fondo base (azul marino profundo)
  surface:     #0d1f3c   tarjetas y superficies elevadas
  border:      #1a2f4a   bordes sutiles
  accent:      #74b8d3   celeste — ÚNICO color interactivo
  accentPress: #5aa4c2   celeste oscuro en onPress
  text:        #f0f4f8   texto principal
  muted:       #8ba3b8   texto secundario / placeholders
  success:     #4ecb8d   stock disponible / pedido OK
  warning:     #f0a050   stock bajo (1–5 uds.)
  danger:      #e05c5c   sin stock / error / alerta inline

Tipografía:
  Títulos:   Syne Bold / ExtraBold (700–800)
  UI/Cuerpo: DM Sans Regular / Medium (400–500)
  Números:   JetBrains Mono Medium (500)

Tokens móviles:
  borderRadius card:  12px
  borderRadius btn:   8px
  borderRadius input: 8px
  padding screen:     16px horizontal
  tap target mínimo:  44×44px

Estética: Premium, contenida. Azul marino profundo como fondo,
celeste como único acento. Sin gradientes llamativos ni decoraciones.
Sombras azuladas sutiles en cards.

════════════════════════════════════════
TIENDA
════════════════════════════════════════

Nombre: [NOMBRE A DEFINIR]
Tipo: Tienda única, un solo vendedor, productos físicos
Categorías: Moda · Cosméticos/Salud · Hogar/Decoración · Accesorios
Sin secciones de destacados, recomendados ni best sellers.

════════════════════════════════════════
NAVEGACIÓN GLOBAL
════════════════════════════════════════

Tab Bar inferior (visible en pantallas autenticadas):
  Tab 1: Catálogo  — ícono grid/store
  Tab 2: Carrito   — ícono bag/cart CON badge numérico celeste
  Tab 3: Pedidos   — ícono clock/box

  Fondo Tab Bar: #0d1f3c
  Borde superior: 1px solid #1a2f4a
  Tab activa: ícono + label #74b8d3
  Tab inactiva: ícono + label #8ba3b8
  Badge carrito: círculo #74b8d3, número #071327

Stack Header (pantallas con volver):
  Fondo: #0d1f3c | Texto: #f0f4f8 | Ícono back: #74b8d3
  Borde inferior: 1px solid #1a2f4a

════════════════════════════════════════
PANTALLAS A DISEÑAR
════════════════════════════════════════

──────────────────────────────────
PANTALLA 1: LOGIN
──────────────────────────────────
Pantalla de inicio de sesión.
- Sin Tab Bar. Fondo #071327 pantalla completa.
- Logo/nombre de tienda centrado en la parte superior (con padding-top generoso)
- Tagline pequeño en #8ba3b8 bajo el logo
- Formulario centrado en la pantalla:
  · Input Email: ícono ✉ izquierda, keyboardType email, fondo #0d1f3c,
    borde #1a2f4a, borde activo #74b8d3, texto #f0f4f8, placeholder #8ba3b8, borderRadius 8
  · Input Contraseña: ícono 🔒, secureTextEntry, mismo estilo
  · Área de error general: texto #e05c5c, DMSans 14px, marginTop 8
  · Botón "INGRESAR": fondo #74b8d3, texto #071327 DMSans 500, borderRadius 8,
    padding vertical 14, full-width, sombra sutil
    Estado loading: ActivityIndicator #071327 dentro del botón
  · Link inferior: "¿No tienes cuenta?" texto #8ba3b8 + "Regístrate" texto #74b8d3

──────────────────────────────────
PANTALLA 2: REGISTRO
──────────────────────────────────
- Sin Tab Bar. Stack con flecha back.
- Título "Crear Cuenta" en Syne Bold
- 4 inputs: Nombre completo, Email, Contraseña, Confirmar contraseña
- Validación inline: borde rojo + texto pequeño #e05c5c debajo de cada campo
- Botón "CREAR CUENTA" primario celeste
- Link "¿Ya tienes cuenta? Inicia sesión"

──────────────────────────────────
PANTALLA 3: CATÁLOGO
──────────────────────────────────
- Header: título "Catálogo" o nombre de tienda. Sin flecha back.
- Barra de tabs de categoría (ScrollView horizontal, no wrap):
  [ Todos ] [ Moda ] [ Cosmét/Salud ] [ Hogar/Dec ] [ Accesorios ]
  · Tab activa: texto #f0f4f8 + borde inferior 2px #74b8d3
  · Tab inactiva: texto #8ba3b8
  · Fondo de la barra: #0d1f3c, separador inferior #1a2f4a
- Grid 2 columnas de ProductCards con gap 12px, padding horizontal 16px
- Pull to refresh visual

ProductCard (diseñar como componente):
  Fondo: #0d1f3c | borde: 1px solid #1a2f4a | borderRadius: 12
  · Imagen: height 160px, borderRadius 12 12 0 0, resizeMode cover
  · Badge categoría: absolute top-8 left-8, fondo #74b8d320,
    texto #74b8d3, fontSize 10, borderRadius 4, padding 2×8
  · Nombre: DMSans 500 14px #f0f4f8, marginTop 10, paddingHorizontal 10
  · Precio: JetBrainsMono 500 18px #74b8d3, marginTop 4, paddingHorizontal 10
  · Botón "Agregar": Pressable full-width, fondo #74b8d3, texto #071327,
    DMSans 500 13px, padding vertical 10, borderRadius 0 0 12 12, marginTop 8

  Variante SIN STOCK:
  · Overlay sobre imagen: fondo #071327 con opacity 0.75
  · Badge centrado sobre overlay: fondo #e05c5c, texto blanco "Sin stock"
  · Botón "Sin disponibilidad": fondo #1a2f4a, texto #8ba3b8, disabled

──────────────────────────────────
PANTALLA 4: DETALLE DE PRODUCTO
──────────────────────────────────
- Stack con header "← Catálogo"
- Sin Tab Bar visible (Stack sobre Catalog)
- ScrollView

  Imagen: width 100%, height 260px, resizeMode cover (sin borderRadius)

  Sección info (padding 16px):
  · Badge de categoría (mismo estilo que en card)
  · Nombre: Syne 700 22px #f0f4f8, marginTop 8
  · Precio: JetBrainsMono 500 24px #74b8d3, marginTop 4
  · Separador: height 1px, fondo #1a2f4a, marginVertical 16
  · Descripción: DMSans 400 14px #8ba3b8, lineHeight 22

  Indicador de stock (3 variantes — mostrar solo la que aplica):
  · Stock > 5:  "✅ Stock disponible: N unidades"  color #4ecb8d
  · Stock 1–5:  "⚠  Pocas unidades: N disponibles" color #f0a050
  · Stock = 0:  "⛔ Sin stock disponible"           color #e05c5c
  Fuente: DMSans 500 14px, ícono izquierda, marginTop 12

  Selector de cantidad (solo si stock > 0):
  · Label "Cantidad" DMSans 14px #8ba3b8
  · Row: Pressable [−] (borde #1a2f4a, 36×36, borderRadius 8)
         + Text número (JetBrainsMono 18px #f0f4f8 centrado)
         + Pressable [+] (mismo estilo)
  · StockAlert debajo del row si qty > stock:
    "⚠ Solo N unidades disponibles" — #e05c5c DMSans 12px

  Botón acción (fixed bottom o al final del scroll):
  · Con stock: "AGREGAR AL CARRITO" fondo #74b8d3, full-width, padding 14
  · Sin stock: "SIN STOCK" fondo #1a2f4a, texto #8ba3b8, disabled

──────────────────────────────────
PANTALLA 5: CARRITO
──────────────────────────────────
- Header "Mi Carrito". Sin flecha back (es tab principal).
- FlatList de CartItems con separador línea #1a2f4a
- Tab Bar visible

CartItem:
  Row: Image 64×64 borderRadius 8 | Info col (flex 1) | Precio+Delete
  Info col: Nombre DMSans 500 14px | Categoría DMSans 12px #8ba3b8
  Controles: Row [−] qty [+] en la misma línea del precio
  Precio: JetBrainsMono 14px #74b8d3, alineado derecha
  Delete: 🗑 Pressable, color #8ba3b8, hover #e05c5c, 44×44 área táctil
  StockAlert: debajo del row completo, visible solo si hay error de stock

Footer sticky (stickyHeaderIndices o View fija abajo):
  "Total: $00.00" — Syne Bold 20px #f0f4f8 alineado derecha
  Botón "IR AL CHECKOUT" — full-width #74b8d3, padding 14

Estado vacío:
  Centered View: ícono 🛒 (Ionicons 64px #1a2f4a) + "Tu carrito está vacío"
  DMSans 16px #8ba3b8 + Botón outline "Explorar catálogo"

──────────────────────────────────
PANTALLA 6: CHECKOUT
──────────────────────────────────
- Stack header "← Carrito | Resumen del Pedido"
- Sin Tab Bar

Card de resumen (fondo #0d1f3c, borde #1a2f4a, borderRadius 12, padding 16):
  Por cada ítem: "Nombre × qty" en DMSans 14px izquierda +
                 "$00.00" en JetBrainsMono derecha
  Row separador: punteado o línea sutil #1a2f4a
  Total: "Total" DMSans 14px #8ba3b8 izquierda +
         "$00.00" Syne Bold 20px #f0f4f8 derecha

Alerta de error de stock (visible solo si falla POST /api/orders):
  View: fondo #e05c5c15, borde izquierdo 3px #e05c5c, padding 12, borderRadius 8
  "⚠ Stock insuficiente para: [Nombre]" DMSans 14px #e05c5c
  "Solo quedan N unidades disponibles" DMSans 12px #e05c5c80

Botón "FINALIZAR PEDIDO":
  full-width, fondo #74b8d3, texto #071327 DMSans 500 16px, padding 16
  Estado loading: ActivityIndicator #071327 + texto "Procesando..."

Link "← Volver al carrito": DMSans 14px #8ba3b8, centered, marginTop 16

──────────────────────────────────
PANTALLA 7: OVERLAY CONFIRMACIÓN
──────────────────────────────────
Modal full-screen o View absolute sobre Checkout.
Fondo: #071327 opacity 0.97

Contenido centrado (vertical + horizontal):
  Círculo: width 96px, height 96px, borderRadius 48,
           fondo #74b8d3, centrado, sombra celeste
  ✓ dentro: Text 40px blanco Syne Bold
  Animación Moti: from={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type:'spring', damping:12, stiffness:90 }}

  "¡Pedido Realizado!" — Syne ExtraBold 26px #f0f4f8, marginTop 24, textAlign center
  "Tu pedido ha sido confirmado." — DMSans 14px #8ba3b8, marginTop 8, textAlign center

  Botones (marginTop 32, ambos full-width, gap 12):
  · "VER MIS PEDIDOS" — primario #74b8d3
  · "VOLVER AL CATÁLOGO" — outline, borde #74b8d3, texto #74b8d3

──────────────────────────────────
PANTALLA 8: HISTORIAL DE PEDIDOS
──────────────────────────────────
- Header "Mis Pedidos". Es tab principal.
- FlatList de OrderCards
- Tab Bar visible

OrderCard (Pressable que expande/colapsa):
  Header row: "#001" Syne 500 14px + fecha DMSans 12px #8ba3b8 +
              badge "Completado" (fondo #4ecb8d20, texto #4ecb8d, borderRadius 6) +
              ícono ▶/▼ #74b8d3
  Total: JetBrainsMono 16px #74b8d3

  Expandido (animación height con Moti):
  Tabla: por cada ítem: nombre | qty | precio unit | subtotal
  Encabezados en DMSans 11px #8ba3b8, datos en DMSans 13px #f0f4f8
  Fila total en Syne 500 14px #74b8d3

Estado vacío: ícono 📦 + "Aún no tienes pedidos" + Botón "Explorar catálogo"

──────────────────────────────────
PANTALLA 9: ADMIN — LISTA PRODUCTOS
──────────────────────────────────
- Stack header "Gestión de Productos" + botón "+ Nuevo" (color #74b8d3) en headerRight
- Sin Tab Bar de cliente
- FlatList de AdminProductItems

AdminProductItem (cada ítem en la lista):
  Row: Image 48×48 borderRadius 8 + Info col + Acciones
  Info: Nombre DMSans 500 14px | Categoría + Precio DMSans 12px #8ba3b8
  Stock: "Stock: N" — color normal #8ba3b8, amarillo si 1–5, rojo si 0
  Estado badge: "Activo" verde / "Inactivo" gris
  Acciones: [✏ Editar] [🚫 Desactivar] / [✅ Activar]
            Pressables con área táctil 44px, texto pequeño

──────────────────────────────────
PANTALLA 10: ADMIN — FORMULARIO PRODUCTO
──────────────────────────────────
- Stack header "← Volver | Crear Producto" o "Editar Producto"
- Sin Tab Bar
- ScrollView con padding 16px

Campos (en orden vertical):
  · "Nombre *" — TextInput, validación inline error rojo bajo el campo
  · "Descripción" — TextInput multiline 4 líneas, style textarea
  · Row: "Precio *" [TextInput keyboardType numeric] | "Stock *" [TextInput numeric]
  · "Categoría *" — Pressable que abre ActionSheet/Modal con las 4 opciones
    Muestra categoría seleccionada con ícono ▼
  · "Imagen del producto" — Pressable con área dashed #1a2f4a, borderRadius 8:
    Sin imagen: ícono 🖼 + "Toca para seleccionar imagen" #8ba3b8
    Con imagen: Image preview width 100% height 200px borderRadius 8

Botones:
  · "GUARDAR PRODUCTO" — full-width, primario #74b8d3, padding 14
  · "CANCELAR" — full-width, outline #1a2f4a, texto #8ba3b8, padding 14

════════════════════════════════════════
ESPECIFICACIONES DE COMPONENTES
════════════════════════════════════════

INPUTS (todos):
  fondo: #0d1f3c | borde normal: 1px solid #1a2f4a
  borde activo (onFocus): 1px solid #74b8d3
  texto: #f0f4f8 | placeholder: #8ba3b8
  borderRadius: 8 | padding: 12 16 | fontSize: 15 DMSans

  Error: borde #e05c5c + "⚠ Mensaje" #e05c5c 12px debajo del input

BOTÓN PRIMARIO:
  fondo: #74b8d3 | onPress: #5aa4c2 | texto: #071327 DMSans 500
  borderRadius: 8 | paddingVertical: 14 | width: 100%

BOTÓN OUTLINE:
  borde: 1px solid #74b8d3 | texto: #74b8d3 | fondo: transparent
  onPress: fondo #74b8d315

BOTÓN DESHABILITADO:
  fondo: #1a2f4a | texto: #8ba3b8 | opacity: 0.6

ALERTA INLINE STOCK (StockAlert):
  texto: #e05c5c | fontSize: 12 | DMSans | marginTop: 6
  prefijo: "⚠ " o "⛔ " según tipo

BADGE ESTADO:
  Completado:  fondo #4ecb8d20, texto #4ecb8d, borderRadius 6, padding 2×8
  Sin stock:   fondo #e05c5c20, texto #e05c5c
  Categoría:   fondo #74b8d320, texto #74b8d3

SEPARADORES:
  height: 1 | fondo: #1a2f4a
```

---

## Prompts de Refinamiento

### Estados de stock en detalle de producto
```
Muestra los 3 estados del indicador de stock en la pantalla de Detalle
como variantes del mismo componente:
(1) stock alto: fila con ✅ y texto verde "Stock disponible: 15 unidades"
(2) stock bajo (1–5): fila con ⚠ y texto naranja "Pocas unidades: 3 disponibles"
(3) sin stock: fila con ⛔ y texto rojo "Sin stock disponible"
Debajo de los controles de cantidad, mostrar la alerta roja inline
"⚠ Solo 3 unidades disponibles" cuando la qty supera el stock.
```

### ProductCard variantes
```
Diseña la ProductCard con sus 3 variantes:
(1) Normal con stock: botón celeste activo "Agregar al carrito"
(2) Stock bajo (1-3 uds): mismo botón + badge "Pocas unidades" naranja
(3) Sin stock: overlay oscuro sobre imagen + badge rojo + botón gris deshabilitado
Las 3 variantes deben verse en un grid de 2 columnas.
```

### CartItem con alerta de stock
```
Diseña el componente CartItem con la variante de error activa:
Debajo del row de controles (− qty +) debe aparecer el componente StockAlert:
"⚠ Solo 2 unidades disponibles" en rojo pequeño.
El botón [+] de ese ítem debe estar visualmente deshabilitado (gris, opacity 0.4).
```

### Animación del overlay de confirmación
```
Diseña el OrderSuccessOverlay para mobile. Es una View absolutamente posicionada
que ocupa toda la pantalla con fondo #071327 opacity 0.97.
El contenido central tiene: círculo celeste grande (96px) con ✓ blanco,
"¡Pedido Realizado!" en Syne ExtraBold blanco,
subtexto en #8ba3b8,
y dos botones apilados verticalmente.
Muestra el estado "antes" (botón loading en Checkout) y el estado "después"
(overlay de éxito visible).
```

### Admin — formulario móvil
```
Diseña la pantalla de formulario de producto admin optimizada para móvil.
Los campos Precio y Stock deben ir en una fila de 2 columnas (Row con flex).
La sección de imagen debe ser una Pressable con dashed border cuando no hay imagen,
y un Image preview cuando ya hay imagen seleccionada.
El selector de categoría debe ser un Pressable que muestre las opciones como
un Modal bottomSheet con las 4 opciones y una ✓ en la seleccionada.
```

---

## Orden de Trabajo en Stitch AI

```
1. Crear proyecto en Stitch AI
2. Adjuntar los 3 archivos MD como contexto
3. Pegar el Prompt Maestro completo
4. Generar pantallas en orden S-01 → S-10
5. Usar prompts de refinamiento para estados de stock y animaciones
6. Exportar tokens de diseño para usar en NativeWind / StyleSheet
```
