/**
 * promociones-data.js v1.0
 * Sabana Farma — Datos de promociones
 * 
 * Generado con base en:
 * - Top 300 productos más vendidos (datos reales de ventas)
 * - Inventario con costos y márgenes verificados
 * - Informe de ventas $32.579.100 de periodo analizado
 * 
 * REGLAS DE RENTABILIDAD aplicadas:
 *   2×1: solo productos con margen ≥ 50% (cliente paga 2, gana 1 = margen ÷ 2 ≥ 25%)
 *   Combo: precio combo > suma de costos × 1.20 (mínimo 20% margen sobre combo)
 *   Descuento %: solo si margen - descuento ≥ 15%
 *   Flash: productos con stock > 15 unidades y margen ≥ 35%
 * 
 * Actualizar cada semana. No inventar datos — usar inventario_drog.xlsx.
 */

/* ══════════════════════════════════════════════════════════
   OFERTAS FLASH — duran 48h, stock limitado verificado
   ══════════════════════════════════════════════════════════ */
var OFERTAS_FLASH = [
  {
    id: 'flash-002',
    nombre: 'Vitamina E 400UI × 100 cáps',
    presentacion: 'Frasco',
    precio_normal: 5000,
    precio_oferta: 4332,
    descuento_pct: 13,
    stock_display: 200,
    ranking_ventas: 90,
    vendidos: 25,
    icono: '💛',
    categoria: 'Medicamentos',
    wa_texto: 'Hola%2C+quiero+la+Vitamina+E+400UI+x100+en+oferta+%244.332',
    valido_hasta: '2026-07-12',
    etiqueta: '⭐ Suplemento del mes'
  },
  {
    id: 'flash-003',
    nombre: 'Crema Pods Aclarant B3 sachet',
    presentacion: 'Sachet × 24',
    precio_normal: 2200,
    precio_oferta: 1800,
    descuento_pct: 18,
    stock_display: 21,
    ranking_ventas: 136,
    vendidos: 18,
    icono: '✨',
    categoria: 'Cuidado Personal y Belleza',
    wa_texto: 'Hola%2C+quiero+la+Crema+Pods+Aclarant+B3+en+oferta+%241.800',
    valido_hasta: '2026-07-12',
    etiqueta: '💄 Belleza flash'
  },
  {
    id: 'flash-004',
    nombre: 'Loratadina 10mg tabletas',
    presentacion: 'Caja × 30 tab',
    precio_normal: 2500,
    precio_oferta: 2000,
    descuento_pct: 20,
    stock_display: 640,
    ranking_ventas: 98,
    vendidos: 24,
    icono: '🤧',
    categoria: 'Medicamentos',
    wa_texto: 'Hola%2C+quiero+la+Loratadina+10mg+en+oferta+%242.000',
    valido_hasta: '2026-07-12',
    etiqueta: '🌿 Anti-alergia'
  },
  {
    id: 'flash-005',
    nombre: 'Ainedix Aceclofenaco 100mg',
    presentacion: 'Caja × 10 tab',
    precio_normal: 5200,
    precio_oferta: 4368,
    descuento_pct: 16,
    stock_display: 42,
    ranking_ventas: 93,
    vendidos: 25,
    icono: '💙',
    categoria: 'Medicamentos',
    wa_texto: 'Hola%2C+quiero+el+Ainedix+Aceclofenaco+en+oferta+%244.368',
    valido_hasta: '2026-07-12',
    etiqueta: '⚡ Anti-inflamatorio'
  },
];

/* ══════════════════════════════════════════════════════════
   COMBOS RENTABLES — precio combo calculado sobre costos reales
   ══════════════════════════════════════════════════════════ */
var COMBOS = [
  {
    id: 'combo-salud-01',
    titulo: 'Combo Bienestar Diario',
    descripcion: 'Vitamina C + Vitamina E + Zinc — inmunidad completa',
    items: [
      { nombre: 'Vical Vitamina C 500mg × 144 tab', precio: 5055 },
      { nombre: 'Vitamina E 400UI × 100 cáps',      precio: 4332 },
      { nombre: 'Vit Max Complejo B + Zinc',         precio: 3800 },
    ],
    precio_normal: 13187,   /* suma individual */
    precio_combo:  11500,   /* combo 13% descuento — margen promedio 90%+ justifica */
    ahorro: 1687,
    icono: '🌟',
    categoria: 'Salud',
    wa_texto: 'Hola%2C+quiero+el+Combo+Bienestar+Diario+%2811.500%29',
    etiqueta: 'Ahorra $1.687'
  },
  {
    id: 'combo-dolor-01',
    titulo: 'Combo Anti-Dolor Express',
    descripcion: 'X Ray Dol + Aceclofenaco — alivio rápido y duradero',
    items: [
      { nombre: 'X Ray Dol 48 tabletas',              precio: 3327 },
      { nombre: 'Ainedix Aceclofenaco 100mg × 10',    precio: 4368 },
    ],
    precio_normal: 7695,
    precio_combo:  6800,
    ahorro: 895,
    icono: '💊',
    categoria: 'Medicamentos',
    wa_texto: 'Hola%2C+quiero+el+Combo+Anti-Dolor+Express+%286.800%29',
    etiqueta: 'Ahorra $895'
  },
  {
    id: 'combo-bebe-01',
    titulo: 'Combo Bebé Feliz',
    descripcion: 'Aceite Johnson\'s + Toallas Winny Aloe — cuidado suave',
    items: [
      { nombre: "Johnson's Aceite Baby surt 50ml",   precio: 8200 },
      { nombre: 'Toallas Winny Aloe + Vit E × 100',  precio: 12550 },
    ],
    precio_normal: 20750,
    precio_combo:  18500,
    ahorro: 2250,
    icono: '🍼',
    categoria: 'Bebé y Mamá',
    wa_texto: 'Hola%2C+quiero+el+Combo+Bebé+Feliz+%2818.500%29',
    etiqueta: 'Ahorra $2.250'
  },
  {
    id: 'combo-higiene-01',
    titulo: 'Combo Higiene Oral Completa',
    descripcion: 'Colgate Triple Acción + Listerine Cool Mint',
    items: [
      { nombre: 'Colgate Triple Acción 150ml',       precio: 14500 },
      { nombre: 'Listerine Cool Mint 180ml',          precio: 13900 },
    ],
    precio_normal: 28400,
    precio_combo:  25000,
    ahorro: 3400,
    icono: '🦷',
    categoria: 'Cuidado Personal y Belleza',
    wa_texto: 'Hola%2C+quiero+el+Combo+Higiene+Oral+%2825.000%29',
    etiqueta: 'Ahorra $3.400'
  },
  {
    id: 'combo-tension-01',
    titulo: 'Combo Control de Presión',
    descripcion: 'Losartán 50mg + Eutarpan 10mg — manejo crónico al mejor precio',
    items: [
      { nombre: 'Losartán 50mg × 30 tab',   precio: 6000 },
      { nombre: 'Eutarpan 10mg × 100 tab',  precio: 7500 },
    ],
    precio_normal: 13500,
    precio_combo:  12000,
    ahorro: 1500,
    icono: '❤️',
    categoria: 'Medicamentos',
    wa_texto: 'Hola%2C+quiero+el+Combo+Control+de+Presión+%2812.000%29',
    etiqueta: 'Ahorra $1.500'
  },
  /* ── NUEVOS julio 2026 — temporada de gripa (frío/lluvia en la sabana).
     Precios tomados del CATÁLOGO actual (los que cobra el carrito).
     ⚠ Verificar margen contra inventario_drog.xlsx antes de publicar. ── */
  {
    id: 'combo-gripa-01',
    titulo: 'Combo Gripa Total',
    descripcion: 'Resfrygrip + Noraver Garganta + Pax Noche — día y noche cubiertos',
    items: [
      { nombre: 'Resfrygrip Plus X 100 Caps',              precio: 1400 },
      { nombre: 'Noraver Garganta Sabores Surt X 12 Unds', precio: 2300 },
      { nombre: 'Pax Caliente Noche Limón/Panela 24 Sbs',  precio: 2800 },
    ],
    precio_normal: 6500,
    precio_combo:  5800,   /* 11% desc — los 3 son top ventas (rk #3, #19, #12) */
    ahorro: 700,
    icono: '🤒',
    categoria: 'Medicamentos',
    wa_texto: 'Hola%2C+quiero+el+Combo+Gripa+Total+%285.800%29',
    etiqueta: 'Ahorra $700 · Temporada de frío'
  },
  {
    id: 'combo-hidratacion-01',
    titulo: 'Combo Hidratación Familiar',
    descripcion: '2 Electrolit + 1 Pedialyte Max con Zinc — y activas el domicilio GRATIS',
    items: [
      { nombre: 'Electrolit Hidratante 625 ML (×2)',       precio: 17000 },
      { nombre: 'Pedialyte Max con Zinc Surtidos 500 ML',  precio: 10300 },
    ],
    precio_normal: 27300,
    precio_combo:  24900,  /* 9% desc + supera $20.000 → domicilio gratis */
    ahorro: 2400,
    icono: '💧',
    categoria: 'Medicamentos',
    wa_texto: 'Hola%2C+quiero+el+Combo+Hidratación+Familiar+%2824.900%29',
    etiqueta: 'Ahorra $2.400 + Domicilio GRATIS'
  },
  {
    id: 'combo-botiquin-01',
    titulo: 'Botiquín Básico Familiar',
    descripcion: 'Acetaminofén + curas + gasas + alcohol + suero — todo hogar lo necesita',
    items: [
      { nombre: 'Acetaminofén 500 Mg 300 Tabletas',        precio: 1500 },
      { nombre: 'Curas Hansaplast Impermeables 100 Unds',  precio: 200 },
      { nombre: 'Gasa Alfa Estéril 3X3 Sbs',               precio: 1000 },
      { nombre: 'Alcohol MK X 350 ML',                     precio: 5900 },
      { nombre: 'Suero Fisiológico 500 ML',                precio: 4000 },
    ],
    precio_normal: 12600,
    precio_combo:  10900,  /* 13% desc — gancho de ticket alto con top sellers */
    ahorro: 1700,
    icono: '🩹',
    categoria: 'Medicamentos',
    wa_texto: 'Hola%2C+quiero+el+Botiqu%C3%ADn+B%C3%A1sico+Familiar+%2810.900%29',
    etiqueta: 'Ahorra $1.700'
  },
];

/* ══════════════════════════════════════════════════════════
   2×1 Y LLEVA MÁS — solo con margen ≥ 50% verificado
   ══════════════════════════════════════════════════════════ */
var PROMOS_2X1 = [
  {
    id: '2x1-002',
    tipo: '2×1',
    nombre: 'Loratadina 10mg',
    presentacion: 'Caja × 30 tab',
    precio_unitario: 2000,
    precio_promo: 2000, /* paga 1 lleva 2 */
    cantidad_promo: 2,
    cantidad_paga: 1,
    stock: 640,
    icono: '🤧',
    margen_real: 72,    /* % — costo $556, vende $2000 → 2×1 queda margen 44% */
    wa_texto: 'Hola%2C+quiero+el+2x1+de+Loratadina+10mg',
    etiqueta: '2×1 Anti-alergia'
  },
  {
    id: '2x1-003',
    tipo: '2×1',
    nombre: 'Curas Hansaplast Impermeables × 100',
    presentacion: 'Caja × 100 unds',
    precio_unitario: 490,
    precio_promo: 490,
    cantidad_promo: 2,
    cantidad_paga: 1,
    stock: 1035,
    icono: '🩹',
    margen_real: 75,    /* % — justifica 2×1 ampliamente */
    wa_texto: 'Hola%2C+quiero+el+2x1+de+Curas+Hansaplast+100+unds',
    etiqueta: '2×1 Primeros auxilios'
  },
];

/* ══════════════════════════════════════════════════════════
   CUPONES DE DESCUENTO — por monto de compra
   ══════════════════════════════════════════════════════════ */
var CUPONES = [
  {
    codigo: 'SALUD10',
    descripcion: '10% descuento en tu compra de medicamentos',
    descuento_pct: 10,
    minimo_compra: 30000,
    categoria_aplica: 'Medicamentos',
    valido_hasta: '2026-07-31',
    usos_maximos: 50,
    activo: true
  },
  {
    codigo: 'BEBE15',
    descripcion: '15% en productos Bebé y Mamá por compras ≥$40.000',
    descuento_pct: 15,
    minimo_compra: 40000,
    categoria_aplica: 'Bebé y Mamá',
    valido_hasta: '2026-07-31',
    usos_maximos: 30,
    activo: true
  },
  {
    codigo: 'GRIPA10',
    descripcion: '10% en productos para gripa y defensas por compras ≥$25.000',
    descuento_pct: 10,
    minimo_compra: 25000,
    categoria_aplica: 'Medicamentos',
    valido_hasta: '2026-07-31',
    usos_maximos: 40,
    activo: true
  },
  {
    codigo: 'BIENVENIDO10',
    descripcion: '10% en tu PRIMERA compra ≥$25.000 — cliente nuevo',
    descuento_pct: 10,
    minimo_compra: 25000,
    categoria_aplica: 'Todas',
    valido_hasta: '2026-08-31',
    usos_maximos: 100,
    activo: true
  },
  {
    codigo: 'BELLEZA20',
    descripcion: '20% en Cuidado Personal y Belleza por compras ≥$50.000',
    descuento_pct: 20,
    minimo_compra: 50000,
    categoria_aplica: 'Cuidado Personal y Belleza',
    valido_hasta: '2026-07-15',
    usos_maximos: 25,
    activo: true
  },
];

/* ══════════════════════════════════════════════════════════
   PRODUCTO DEL MES — julio 2026
   Elegido por: mayor volumen de ventas + precio accesible + stock amplio
   ══════════════════════════════════════════════════════════ */
var PRODUCTO_MES = {
  nombre: 'Electrolit Hidratante Sabores Surtidos 625 ML',
  presentacion: 'Frasco',
  precio: 8500,
  precio_anterior: null, /* sin descuento inventado: la promo real es 2+1 al 25% */
  descripcion: 'El hidratante más vendido de la droguería. Compra 2 y el tercero con 25% de descuento — el ahorro se aplica solo en tu carrito. Todos los sabores.',
  icono: '💧',
  ranking: 1,
  vendidos_mes: 269,
  stock: 189,
  wa_texto: 'Hola%2C+quiero+el+Electrolit+del+mes+con+la+promo+2%2B1+al+25%25',
  valido_hasta: '2026-07-31'
};

/* ══ DESACTIVADAS (jul 2026): las promos 2×1/3×2 y combos fueron
   reemplazadas por el descuento automático por monto de compra
   (5% ≥ $50.000 · 7% ≥ $100.000 · 10% ≥ $150.000 — ver carrito.js).
   Los datos de arriba se conservan solo como referencia histórica. ══ */
PROMOS_2X1 = [];
COMBOS     = [];

/* Exportar para uso global */
if (typeof window !== 'undefined') {
  window.OFERTAS_FLASH   = OFERTAS_FLASH;
  window.COMBOS          = COMBOS;
 