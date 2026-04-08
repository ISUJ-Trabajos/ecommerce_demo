# Diseño y Estructura de Pantallas — ECommerce Demo (Móvil Expo)

> Todas las pantallas son para dispositivo móvil (375–430px de ancho).

> Componentes React Native: `View`, `Text`, `Pressable`, `FlatList`, `TextInput`, `ScrollView`.

Para el desarrollo de la interfaz se utilizará el servidor MCP **Stitch AI**. Utiliza y analiza el requerimiento a resolver de forma visual y con las skills que tienes como Agente de IA. Utiliza, visualiza o genera mockups y prototipos de las pantallas en base al proyecto de stitch con nombre "Diseño Interfaces Ecommerce Demo".

---

## Sistema de Diseño

### Paleta de Colores (`mobile/constants/colors.ts`)
```ts
export const Colors = {
  bg:          '#071327',   // Fondo base — azul marino profundo
  surface:     '#0d1f3c',   // Tarjetas y superficies elevadas
  border:      '#1a2f4a',   // Bordes sutiles
  accent:      '#74b8d3',   // Celeste — único color de acción
  accentHover: '#5aa4c2',   // Celeste oscuro (onPressIn)
  text:        '#f0f4f8',   // Texto principal
  muted:       '#8ba3b8',   // Texto secundario / placeholders
  success:     '#4ecb8d',   // Stock disponible / completado
  warning:     '#f0a050',   // Stock bajo (1–5 unidades)
  danger:      '#e05c5c',   // Sin stock / error / alerta inline
};
```

### Tipografía (`expo-font` + `useFonts`)
```
Títulos / Display:  Syne_700Bold, Syne_800ExtraBold
UI / Cuerpo:        DMSans_400Regular, DMSans_500Medium
Precios / Números:  JetBrainsMono_500Medium
```

### Tokens de Diseño
```
borderRadius.card:   12
borderRadius.btn:    8
borderRadius.input:  8
spacing.screen:      16   (padding horizontal en todas las pantallas)
spacing.section:     24
shadow.card: { shadowColor: '#071327', shadowOffset: {0,4}, shadowOpacity: 0.6, elevation: 6 }
```

---

## Componentes de Navegación

### Tab Bar (`(app)/_layout.tsx`)
```
┌────────────────────────────────────────┐
│  Pantalla activa                       │
│  ...                                   │
├────────────────────────────────────────┤
│  🏬 Catálogo  │  🛒 [2]  │  📦 Pedidos │  ← Tab Bar fija en fondo
└────────────────────────────────────────┘
  Fondo: #0d1f3c · borde superior: #1a2f4a
  Tab activa: ícono + texto #74b8d3
  Tab inactiva: ícono + texto #8ba3b8
  Badge carrito: círculo #74b8d3 sobre ícono, texto #071327
```

### Header de Pantalla (Stack Navigator)
```
┌────────────────────────────────────────┐
│  ← Volver     Título de Pantalla       │
└────────────────────────────────────────┘
  Fondo: #0d1f3c · texto: #f0f4f8 · borde inferior: #1a2f4a
```

---

## Pantallas

---

### S-01 · Login `(auth)/login`

```
┌────────────────────────────────────────┐
│  [StatusBar dark]                      │
│                                        │
│           🏬 Nombre Tienda             │
│         Subtítulo / tagline            │
│                                        │
│  ┌────────────────────────────────┐    │
│  │  ✉  Email                      │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │  🔒  Contraseña                │    │
│  └────────────────────────────────┘    │
│                                        │
│  ── Mensaje de error (si aplica) ──   │  ← texto #e05c5c
│                                        │
│  ┌────────────────────────────────┐    │
│  │         INGRESAR               │    │  ← fondo #74b8d3, texto #071327
│  └────────────────────────────────┘    │
│                                        │
│  ¿No tienes cuenta?  [Regístrate]      │  ← texto #8ba3b8 + link #74b8d3
│                                        │
└────────────────────────────────────────┘
```

**Componentes RN**
- `ScrollView` con `contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}`
- `TextInput` con `keyboardType="email-address"` y `secureTextEntry`
- `Pressable` para el botón con feedback `onPressIn` (color `accentHover`)
- `ActivityIndicator` dentro del botón durante el loading

---

### S-02 · Registro `(auth)/register`

```
┌────────────────────────────────────────┐
│  ← Volver                             │
│                                        │
│           Crear Cuenta                 │
│                                        │
│  ┌────────────────────────────────┐    │
│  │  👤  Nombre completo           │    │
│  └────────────────────────────────┘    │
│  ✗ Campo requerido                     │  ← error inline #e05c5c small
│                                        │
│  ┌────────────────────────────────┐    │
│  │  ✉  Email                      │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │  🔒  Contraseña                │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │  🔒  Confirmar contraseña      │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │        CREAR CUENTA            │    │
│  └────────────────────────────────┘    │
│                                        │
│  ¿Ya tienes cuenta?  [Inicia sesión]   │
└────────────────────────────────────────┘
```

---

### S-03 · Catálogo `(app)/catalog/index`

```
┌────────────────────────────────────────┐
│  [Header: 🏬 Nombre · sin back arrow] │
├────────────────────────────────────────┤
│  ← Scroll horizontal de tabs →        │
│  [Todos][Moda][Cosmét.][Hogar][Acces.] │
│          ^^^^ activa: borde #74b8d3   │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────┐  ┌──────────┐           │
│  │  [IMG]   │  │  [IMG]   │           │
│  │ [badge]  │  │ [SIN STCK│  ← overlay│
│  │ Nombre   │  │ Nombre   │           │
│  │ $00.00   │  │ $00.00   │           │
│  │[+ Carrit]│  │[Agotado] │ ← disabled│
│  └──────────┘  └──────────┘           │
│                                        │
│  ┌──────────┐  ┌──────────┐           │
│  │  [IMG]   │  │  [IMG]   │           │
│  │ Nombre   │  │ Nombre   │           │
│  │ $00.00   │  │ $00.00   │           │
│  │[+ Carrit]│  │[+ Carrit]│           │
│  └──────────┘  └──────────┘           │
│                                        │
├────────────────────────────────────────┤
│  🏬 Catálogo  │  🛒 [2]  │  📦 Pedidos│
└────────────────────────────────────────┘
```

**Componentes RN**
- `FlatList` con `numColumns={2}` para el grid de productos
- `ScrollView horizontal` para los tabs de categoría
- `RefreshControl` para pull-to-refresh
- `ProductCard` como `renderItem`

**ProductCard**
```
┌──────────────────┐
│    [IMAGEN]      │  ← Image resizeMode="cover" height=160
│  [cat badge]     │  ← posición absolute top-left
├──────────────────┤
│ Nombre producto  │  ← Text DMSans 500
│ $00.00           │  ← Text JetBrainsMono #74b8d3
│ [AGREGAR ▸]      │  ← Pressable full-width #74b8d3
└──────────────────┘
  fondo: #0d1f3c · borde: #1a2f4a · borderRadius: 12
```

---

### S-04 · Detalle de Producto `(app)/catalog/[id]`

```
┌────────────────────────────────────────┐
│  ← Catálogo                           │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │          [IMAGEN]                │  │  ← height: 260
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [badge categoría]                     │
│  Nombre del Producto                   │  ← Syne Bold 22px
│  $00.00                                │  ← JetBrainsMono #74b8d3 24px
│                                        │
│  Descripción del producto. Texto       │  ← DMSans #8ba3b8
│  completo de la descripción...         │
│  ────────────────────────────────      │
│                                        │
│  ✅ Stock disponible: 15 unidades      │  ← #4ecb8d  (stock > 5)
│  ⚠  Pocas unidades: 3 disponibles     │  ← #f0a050  (stock 1–5)
│  ⛔  Sin stock disponible              │  ← #e05c5c  (stock = 0)
│                                        │
│  Cantidad:                             │
│  ┌────┐  ┌───┐  ┌────┐                │
│  │ −  │  │ 1 │  │ +  │                │
│  └────┘  └───┘  └────┘                │
│  ⚠ Solo 3 unidades disponibles        │  ← StockAlert, #e05c5c small
│                                        │
│  ┌──────────────────────────────────┐  │
│  │      AGREGAR AL CARRITO          │  │  ← #74b8d3 / deshabilitado si stock=0
│  └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│  Tab Bar                               │
└────────────────────────────────────────┘
```

---

### S-05 · Carrito `(app)/cart`

```
┌────────────────────────────────────────┐
│  Mi Carrito                           │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐  │
│  │ [IMG]  Nombre Producto      🗑   │  │
│  │ [64px] Categoría                 │  │
│  │        − 2 +     $59.98          │  │
│  │        ⚠ Solo 1 disponible       │  │  ← StockAlert inline #e05c5c
│  └──────────────────────────────────┘  │
│  ─────────────────────────────────     │
│  ┌──────────────────────────────────┐  │
│  │ [IMG]  Nombre Producto 2    🗑   │  │
│  │ [64px] Categoría                 │  │
│  │        − 1 +     $29.99          │  │
│  └──────────────────────────────────┘  │
│                                        │
│            Total: $89.97               │  ← Syne Bold #f0f4f8
│  ┌──────────────────────────────────┐  │
│  │        IR AL CHECKOUT            │  │  ← #74b8d3
│  └──────────────────────────────────┘  │
│                                        │
│  ─── Estado vacío (sin ítems) ───     │
│       🛒  Tu carrito está vacío        │
│    [ Explorar catálogo ]               │
├────────────────────────────────────────┤
│  Tab Bar                               │
└────────────────────────────────────────┘
```

**Comportamiento stock en carrito**
- Al presionar `+`: PATCH a la API → si 409 `STOCK_EXCEEDED`, mostrar `StockAlert` bajo ese ítem
- Botón `+` se deshabilita visualmente si `qty = stock` actual del producto
- El botón "IR AL CHECKOUT" nunca se deshabilita por stock (validación final en checkout)

---

### S-06 · Checkout `(app)/checkout`

```
┌────────────────────────────────────────┐
│  ← Carrito    Resumen del Pedido      │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  Producto A × 2 ......... $59.98 │  │
│  │  Producto B × 1 ......... $29.99 │  │
│  │  ─────────────────────────────── │  │
│  │  Total .................. $89.97 │  │  ← Syne Bold grande
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │  ← Solo visible si hay error
│  │ ⚠ Stock insuficiente:            │  │
│  │   "Blazer" · Solo quedan 1 und.  │  │
│  └──────────────────────────────────┘  │  fondo #e05c5c15, borde #e05c5c
│                                        │
│  ┌──────────────────────────────────┐  │
│  │       FINALIZAR PEDIDO           │  │  ← #74b8d3 · spinner loading
│  └──────────────────────────────────┘  │
│                                        │
│  ← Volver al carrito                  │  ← texto #8ba3b8
│                                        │
├────────────────────────────────────────┤
│  Tab Bar                               │
└────────────────────────────────────────┘
```

---

### S-07 · Overlay de Confirmación (Moti)

*Renderizado sobre la pantalla de Checkout como Modal o componente absolutamente posicionado*

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│           ╔══════════╗                 │
│           ║    ✓     ║  ← Moti scale  │
│           ╚══════════╝     bounce     │
│                                        │
│         ¡Pedido Realizado!             │  ← Syne Bold, #f0f4f8
│                                        │
│     Tu pedido ha sido confirmado       │  ← DMSans, #8ba3b8
│                                        │
│  ┌──────────────────────────────────┐  │
│  │        VER MIS PEDIDOS           │  │  ← primario #74b8d3
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │      VOLVER AL CATÁLOGO          │  │  ← outline #74b8d3
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
  Fondo: #071327 opacity 0.97 · absolute fill
```

**Secuencia de animación Moti**
```ts
// Círculo ✓
<MotiView from={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} />

// Título
<MotiText from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400 }} />

// Subtexto
<MotiText transition={{ delay: 650 }} />

// Botones
<MotiView transition={{ delay: 900 }} />
```

---

### S-08 · Historial de Pedidos `(app)/orders/index`

```
┌────────────────────────────────────────┐
│  Mis Pedidos                           │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  Pedido #001          ▼          │  │  ← Pressable expande
│  │  12 ene 2025                     │  │
│  │  $89.97   [✅ Completado]         │  │
│  │ ─────────────────────────────    │  │  ← Expandido:
│  │  Producto A   × 2   $59.98       │  │
│  │  Producto B   × 1   $29.99       │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  Pedido #002          ▶          │  │  ← Colapsado
│  │  15 ene 2025  $34.99  [✅]        │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ─── Estado vacío ───                 │
│       📦  Aún no tienes pedidos        │
│    [ Explorar catálogo ]               │
│                                        │
├────────────────────────────────────────┤
│  Tab Bar                               │
└────────────────────────────────────────┘
```

---

### S-09 · Admin — Lista de Productos `(admin)/products/index`

```
┌────────────────────────────────────────┐
│  ← Salir    Gestión de Productos      │
│                         [+ Nuevo]      │  ← botón header derecho
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ [IMG] Bolso Tote Canvas          │  │
│  │ [48px] Accesorios · $55.99       │  │
│  │        Stock: 22  [✅ Activo]     │  │
│  │                  [✏ Edit] [🚫]   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ [IMG] Aceite Corporal Argán       │  │
│  │       Cosméticos · $27.99         │  │
│  │       Stock: 0   [❌ Sin stock]   │  │  ← stock en #e05c5c
│  │                  [✏ Edit] [🚫]   │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

**Componentes RN**
- `FlatList` con `ItemSeparatorComponent`
- Cada ítem: fila con imagen, info, stock coloreado y acciones
- Acciones con `Pressable` pequeños (no botones full-width)

---

### S-10 · Admin — Formulario de Producto `(admin)/products/new` | `[id]`

```
┌────────────────────────────────────────┐
│  ← Volver    Crear / Editar Producto  │
├────────────────────────────────────────┤
│  (ScrollView)                          │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  Nombre *                        │  │
│  │  [_______________________________│  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  Descripción                     │  │
│  │  [_______________________________│  │
│  │  [multiline, 4 líneas____________│  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌───────────────┐  ┌────────────────┐ │
│  │  Precio *     │  │  Stock *       │ │
│  │  [$__________]│  │  [0___________]│ │
│  └───────────────┘  └────────────────┘ │
│                                        │
│  Categoría *                           │
│  ┌──────────────────────────────────┐  │
│  │  [▼ Seleccionar categoría      ] │  │  ← Picker / modal Select
│  └──────────────────────────────────┘  │
│                                        │
│  Imagen del producto                   │
│  ┌──────────────────────────────────┐  │
│  │   [🖼 Preview / placeholder]     │  │
│  │   [ Seleccionar imagen ]         │  │  ← Expo Image Picker
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │        GUARDAR PRODUCTO          │  │  ← #74b8d3
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │          CANCELAR                │  │  ← outline gris
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

## Componentes de Stock Reutilizables

### `StockAlert` (`components/ui/StockAlert.tsx`)
```tsx
// Uso:
<StockAlert available={3} />           // "⚠ Solo 3 unidades disponibles"
<StockAlert outOfStock />              // "⛔ Sin stock disponible"

// Estilo: color #e05c5c · fontSize 12 · DMSans · marginTop 6
// Solo visible cuando hay un problema (undefined → no renderiza)
```

### `StockBadge` — estados en ProductCard
| Stock       | Color texto    | Texto mostrado        |
|-------------|----------------|-----------------------|
| > 5         | `#4ecb8d`      | "En stock"            |
| 1 – 5       | `#f0a050`      | "Pocas unidades"      |
| 0           | `#e05c5c`      | "Sin stock"           |

---

## Flujo de Pantallas (Mobile)

```
index.tsx (redirect)
      │
      ├─ sin token ──▶ (auth)/login ──▶ (auth)/register
      │
      └─ con token ──▶ (app)/catalog  ← Tab Bar
                              │
                    onPress ProductCard
                              │
                              ▼
                      (app)/catalog/[id]
                              │
                    "Agregar al carrito"
                              │
                    badge Tab Bar actualizado
                              │
                     Tab "Carrito" ──▶ (app)/cart
                              │
                    "Ir al Checkout"
                              │
                              ▼
                        (app)/checkout
                              │
                    "FINALIZAR PEDIDO"
                              │
                    OrderSuccessOverlay
                              │
                    ──▶ (app)/orders
```
