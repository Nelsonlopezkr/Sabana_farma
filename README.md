# 💊 Sabana Farma — Sitio Web

> Plataforma farmacéutica moderna para pedidos por WhatsApp.  
> **Mosquera y Funza, Cundinamarca, Colombia.**

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github)](https://sabanafarma.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

---

## 🏪 Sobre el negocio

**Sabana Farma** es una droguería local con domicilio **siempre GRATIS** en Mosquera y Funza (Cundinamarca). Ofrecemos más de 2.000 productos — medicamentos, cuidado personal, bebé y mercado — con pedidos directos por WhatsApp.

| Dato | Valor |
|---|---|
| 📦 Pedidos | [311 871 94 76](https://wa.me/573118719476) |
| 💳 Pagos (Nequi) | 323 249 7559 |
| 🕐 Horario | Lunes – Domingo, 7 am – 10 pm |
| 🚚 Cobertura | Mosquera y Funza, Cundinamarca |
| 💰 Métodos de pago | Nequi · Daviplata · Bancolombia · Efectivo |

---

## 🗂️ Estructura del proyecto

```
Sabana_farma/
├── index.html              # Página principal (hero, top ventas, categorías)
├── productos.html          # Catálogo completo con filtros y buscador
├── promociones.html        # Ofertas, cupones WhatsApp y countdown semanal
├── afiliaciones.html       # Programa Cliente Preferente (hero cinematográfico)
├── contacto.html           # Contacto, mapa y horarios
├── politica-datos.html     # Política de privacidad HABEAS DATA
│
├── css/
│   └── estilos.css         # Hoja de estilos unificada (~8.800+ líneas)
│
├── js/
│   ├── catalogo.js         # Motor de renderizado del catálogo (sistema laboratorios{})
│   ├── carrito.js          # Carrito con localStorage, animaciones, WhatsApp
│   ├── checkout.js         # Finalización de pedido por WhatsApp
│   ├── productos-data.js   # Base de datos de productos (~2.028 items)
│   ├── top-ventas-data.js  # Top 300 más vendidos (datos reales de ventas)
│   ├── promo-dia.js        # Barra promocional del día (rotativa por día)
│   ├── navbar-search.js    # Buscador global en navbar (todas las páginas)
│   ├── theme.js            # Sistema dark/light mode anti-FOUC
│   └── wa-config.js        # Configuración central de WhatsApp
│
├── img/
│   ├── icono.jpg           # Logo principal
│   ├── favicon.ico         # Favicon del sitio
│   ├── apple-touch-icon.png
│   └── productos/          # Imágenes de productos
│
├── manifest.json           # PWA manifest (instalable en móvil)
├── sw.js                   # Service Worker (cache offline)
└── .htaccess               # Apache: HTTPS, GZIP, caché, bloqueo .xlsx
```

---

## ⚙️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura, ARIA, Schema.org |
| CSS3 + Custom Properties | Responsive, dark mode, animaciones |
| JavaScript Vanilla (ES5+) | Sin frameworks — máxima compatibilidad |
| localStorage | Carrito persistente entre sesiones |
| PWA (manifest + SW) | Instalable en móvil, soporte offline |
| Python + pandas | Conversión Excel → JS para el catálogo |

---

## 📂 Datos del catálogo

Los productos provienen de archivos Excel del sistema de inventario:

| Archivo | Contenido |
|---|---|
| `inventario_drog.xlsx` | Inventario completo con precios y presentaciones |
| `Top_300_Productos_MasVendidos.xlsx` | Ranking de ventas reales (300 productos) |
| `InformeProductoVentas_*.xlsx` | Reportes mensuales de ventas |

### Actualizar el catálogo

```bash
# 1. Exportar el inventario actualizado desde el sistema POS
# 2. Ejecutar el script de conversión
python3 REPORTE_ESTRATEGIA.py

# 3. Los archivos generados son:
#    - js/productos-data.js     (todos los productos)
#    - js/top-ventas-data.js    (top 300 más vendidos)

# 4. Subir al servidor via FTP/hPanel
```

---

## 🎨 Categorías de productos

| # | Categoría | Emoji | Descripción |
|---|---|---|---|
| 1 | Medicamentos | 💊 | Genéricos, marca, OTC |
| 2 | Cuidado Personal y Belleza | 💄 | Skincare, maquillaje, higiene |
| 3 | Bebé y Mamá | 👶 | Pañales, cremas, leches |
| 4 | Mercado y Hogar | 🏠 | Aseo, alimentos, limpieza |

---

## 🔍 Buscador Global (`navbar-search.js`)

El archivo `js/navbar-search.js` inyecta automáticamente un buscador en el navbar de **todas las páginas**:

- **Desktop**: aparece entre los links y el carrito
- **Móvil**: sticky debajo del navbar azul
- **Autocompletado**: usa `window.CATALOGO` en tiempo real
- **En `productos.html`**: filtra el grid directamente sin recargar
- **En otras páginas**: redirige a `productos.html?buscar=...`
- **Sin resultados**: botón directo a WhatsApp para preguntar

```html
<!-- Agregar antes de </body> en cada página HTML -->
<script src="js/navbar-search.js"></script>
```

---

## 🛍️ Sistema del carrito

- **Persistencia**: `localStorage` — sobrevive cierres del navegador
- **Compatibilidad**: productos simples, `variantes[]`, y sistema `laboratorios{}`
- **Animación**: efecto fly-to-cart al agregar un producto
- **Checkout**: genera mensaje WhatsApp con resumen completo del pedido
- **Domicilio**: siempre gratis (nunca muestra costo de envío)

---

## 🌙 Dark Mode

Sistema dual de selectores para máxima compatibilidad CSS:

```css
/* SIEMPRE ambos selectores juntos */
[data-theme="dark"] .elemento,
body.oscuro .elemento {
  /* estilos dark */
}
```

El tema se aplica **antes del primer render** (anti-FOUC) mediante script inline en `<head>`.

---

## 📱 PWA

La app es instalable en dispositivos móviles:

| Característica | Valor |
|---|---|
| Instalación | Chrome móvil → "Agregar a pantalla de inicio" |
| Service Worker | Cache First (assets), Network First (HTML) |
| Offline | Muestra páginas previamente visitadas |
| Manifest | Nombre, colores, íconos configurados |

---

## 🏷️ Programa de Afiliación (Cliente Preferente)

La página `afiliaciones.html` incluye:

- **Hero cinematográfico** con orbes animados y partículas
- **Stats animados** (2.028+ productos, 10+ años, 20% descuento)
- **6 beneficios** en cards con hover animado
- **Timeline de 3 pasos** para afiliarse
- **3 promociones exclusivas** para afiliados
- **3 testimonios** de clientes reales
- **CTA final** con botón WhatsApp destacado

---

## 🎁 Cupones WhatsApp (`promociones.html`)

6 cupones activos con enlace directo a WhatsApp:

| Cupón | Descuento | Condición |
|---|---|---|
| Primera Compra | 10% | Mínimo $20.000 |
| Vitaminas | 15% | Sin mínimo |
| Bienvenida Afiliado | 20% | Mínimo $30.000 |
| Compra +$50.000 | Envío + Regalo | Mosquera y Funza |
| Bebé y Mamá | 12% | Mínimo $25.000 |
| Mes Cumpleaños | 20% | Solo afiliados |

---

## 🚀 Despliegue (GitHub Pages)

El sitio se publica automáticamente con **GitHub Pages** desde la rama `main`:

```bash
git add -A
git commit -m "descripción del cambio"
git pull --rebase origin main
git push origin main
# GitHub Pages redespliega solo en 1–2 minutos
```

- Dominio: **https://sabanafarma.com** — DNS en mi.com.co (4 registros A de GitHub + CNAME www).
- El archivo `CNAME` en la raíz mantiene el dominio personalizado — **no borrarlo**.
- ⚠️ No subir al repositorio: `*.xlsx` (inventario privado), `*.py` internos ni reportes.

## 📞 Contacto

| Canal | Dato |
|---|---|
| WhatsApp pedidos | [311 871 94 76](https://wa.me/573118719476) |
| Pagos Nequi / Transferencia | 312 421 39 86 |
| GitHub | [Nelsonlopezkr/Sabana_farma](https://github.com/Nelsonlopezkr/Sabana_farma) |

---

## 📄 Licencia
https://sabanafarma.com/productos.html

Proyecto privado — © 2024–2026 Sabana Farma.  
Todos los derechos reservados. No se permite reproducción sin autorización.
