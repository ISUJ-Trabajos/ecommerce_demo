# Diagrama Entidad-Relación — ECommerce Demo
> Motor: MySQL 8.x · XAMPP · Puerto 3306

---

## Entidades y Atributos

### USERS
| Campo        | Tipo            | Restricción                        |
|--------------|-----------------|------------------------------------|
| id           | INT UNSIGNED    | PK, AUTO_INCREMENT                 |
| name         | VARCHAR(100)    | NOT NULL                           |
| email        | VARCHAR(150)    | UNIQUE, NOT NULL                   |
| password     | VARCHAR(255)    | NOT NULL — hash bcrypt             |
| role         | ENUM            | `'admin'` / `'client'` DEFAULT `'client'` |
| created_at   | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP          |

---

### CATEGORIES
| Campo | Tipo        | Restricción      |
|-------|-------------|------------------|
| id    | TINYINT UNSIGNED | PK, AUTO_INCREMENT |
| name  | VARCHAR(80) | UNIQUE, NOT NULL |
| slug  | VARCHAR(80) | UNIQUE, NOT NULL |

> Valores fijos del sistema: `Moda` · `Cosméticos/Salud` · `Hogar/Decoración` · `Accesorios`

---

### PRODUCTS
| Campo        | Tipo             | Restricción                          |
|--------------|------------------|--------------------------------------|
| id           | INT UNSIGNED     | PK, AUTO_INCREMENT                   |
| category_id  | TINYINT UNSIGNED | FK → CATEGORIES(id), NOT NULL        |
| name         | VARCHAR(150)     | NOT NULL                             |
| description  | TEXT             |                                      |
| price        | DECIMAL(10,2)    | NOT NULL, CHECK ≥ 0                  |
| stock        | INT UNSIGNED     | NOT NULL DEFAULT 0                   |
| image_url    | VARCHAR(255)     | NULL — ruta relativa `/uploads/…`    |
| is_active    | TINYINT(1)       | NOT NULL DEFAULT 1                   |
| created_at   | TIMESTAMP        | DEFAULT CURRENT_TIMESTAMP            |

---

### CART_ITEMS
| Campo      | Tipo         | Restricción                                    |
|------------|--------------|------------------------------------------------|
| id         | INT UNSIGNED | PK, AUTO_INCREMENT                             |
| user_id    | INT UNSIGNED | FK → USERS(id) ON DELETE CASCADE               |
| product_id | INT UNSIGNED | FK → PRODUCTS(id) ON DELETE CASCADE            |
| quantity   | INT UNSIGNED | NOT NULL DEFAULT 1                             |
| added_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                      |

> Restricción única compuesta: `(user_id, product_id)` — un registro por producto por usuario.

---

### ORDERS
| Campo      | Tipo          | Restricción                                 |
|------------|---------------|---------------------------------------------|
| id         | INT UNSIGNED  | PK, AUTO_INCREMENT                          |
| user_id    | INT UNSIGNED  | FK → USERS(id) ON DELETE RESTRICT           |
| total      | DECIMAL(10,2) | NOT NULL                                    |
| status     | ENUM          | `'completed'` DEFAULT `'completed'`         |
| created_at | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP                   |

---

### ORDER_ITEMS
| Campo      | Tipo          | Restricción                                 |
|------------|---------------|---------------------------------------------|
| id         | INT UNSIGNED  | PK, AUTO_INCREMENT                          |
| order_id   | INT UNSIGNED  | FK → ORDERS(id) ON DELETE CASCADE           |
| product_id | INT UNSIGNED  | FK → PRODUCTS(id) ON DELETE RESTRICT        |
| quantity   | INT UNSIGNED  | NOT NULL                                    |
| unit_price | DECIMAL(10,2) | NOT NULL — precio congelado al momento      |

---

## Diagrama de Relaciones

```
CATEGORIES ──────< PRODUCTS >──────── CART_ITEMS >────── USERS
                      │                                     │
                      │                                     │
                   ORDER_ITEMS >────── ORDERS >─────────────┘
```

| Relación                  | Tipo  | Descripción                                  |
|---------------------------|-------|----------------------------------------------|
| CATEGORIES → PRODUCTS     | 1 : N | Una categoría tiene muchos productos         |
| USERS → CART_ITEMS        | 1 : N | Un usuario tiene muchos ítems en carrito     |
| PRODUCTS → CART_ITEMS     | 1 : N | Un producto puede estar en varios carritos   |
| USERS → ORDERS            | 1 : N | Un usuario puede tener múltiples pedidos     |
| ORDERS → ORDER_ITEMS      | 1 : N | Un pedido contiene uno o más ítems           |
| PRODUCTS → ORDER_ITEMS    | 1 : N | Un producto puede aparecer en varios pedidos |

---

## Reglas de Negocio y Gestión de Stock

| Regla | Descripción |
|-------|-------------|
| **RN-01** | El frontend consulta el stock antes de permitir "Agregar al carrito"; si `stock = 0` el botón se deshabilita. |
| **RN-02** | Al agregar al carrito, la API valida que la cantidad solicitada no supere el `stock` disponible; si supera, retorna error 409 con mensaje inline. |
| **RN-03** | Al modificar la cantidad en carrito, la API re-valida contra el stock en tiempo real. |
| **RN-04** | Al confirmar el pedido (`POST /api/orders`), la API verifica stock de **todos** los ítems en transacción; si alguno no tiene suficiente stock, el pedido se rechaza completo. |
| **RN-05** | Tras confirmar el pedido exitosamente, la API descuenta el stock en un `UPDATE` dentro de la misma transacción MySQL. |
| **RN-06** | El precio en `ORDER_ITEMS.unit_price` se congela al momento de la compra. |
| **RN-07** | Sólo el `admin` puede crear, editar y desactivar productos. |
| **RN-08** | Al desactivar un producto (`is_active = 0`), no aparece en el catálogo pero sus `order_items` históricos se conservan. |
