/**
 * ══════════════════════════════════════════════════════════
 *  Droguerías Económicas — Base de datos de productos
 *  productos-data.js  |  v9.0
 *
 *  ✔ Estructura original conservada al 100%
 *  ✔ NUEVO: campo "presentaciones" en categoría Medicamentos
 *    → Permite venta por Unidad, Caja, Blíster, Frasco, etc.
 *    → Las demás categorías NO usan este campo (sin cambios)
 *
 *  ¿Cómo agregar presentaciones a un medicamento?
 *  -----------------------------------------------
 *  Agrega este bloque dentro del objeto del producto:
 *
 *    presentaciones: [
 *      { tipo: 'Unidad', precio: 500 },
 *      { tipo: 'Caja x10', precio: 4500 },
 *      { tipo: 'Blíster x4', precio: 2000 },
 *    ],
 *
 *  → El precio del selector de presentación es INDEPENDIENTE
 *    del precio en "variantes" (que representa la marca/tamaño)
 *  → Si un producto NO tiene "presentaciones", funciona igual que antes
 * ══════════════════════════════════════════════════════════
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   SISTEMA DE IMÁGENES — Picsum con seed fijo (sin CORS)
   ════════════════════════════════════════════════════════════ */
const pic = (seed, w = 400, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const SEEDS = {
  med: ['medicine1','pharma2','health3','pill4','capsule5','drug6','tablet7','medical8','clinic9','dose10','remedy11','cure12','rx13','pharm14','vial15','syringe16','inject17','bottle18','pack19','blister20','med21','med22','med23','med24','med25'],
  bel: ['beauty1','makeup2','cosmetic3','lipstick4','cream5','serum6','skincare7','beauty8','rouge9','mascara10','perfume11','lotion12','toner13','blush14','eyeshadow15','foundation16','gloss17','primer18','bronzer19','palette20'],
  cui: ['care1','soap2','shampoo3','dental4','hygiene5','deodorant6','toothpaste7','razor8','cotton9','bandage10','firstaid11','thermometer12','glucometer13','compress14','alcohol15','gauze16','glove17','mask18','lotion19','cream20'],
  beb: ['baby1','infant2','diaper3','formula4','wipes5','toy6','bottle7','pacifier8','cream9','powder10','lotion11','shampoo12','monitor13','thermometer14','vitamin15','booties16','blanket17','bath18','clothes19','milk20'],
  mer: ['home1','kitchen2','clean3','grocery4','detergent5','coffee6','rice7','oil8','sugar9','water10','bleach11','soap12','trash13','paper14','candle15','battery16','insect17','air18','pet19','food20'],
  mar: ['generic1','brand2','own3','store4','private5','economy6','value7','basic8','essential9','quality10','pack11','bottle12','tube13','box14','bag15','tablet16','capsule17','cream18','gel19','spray20'],
};

let _counters = { med:0, bel:0, cui:0, beb:0, mer:0, mar:0 };
function imgMed()  { const s = SEEDS.med[_counters.med++ % SEEDS.med.length]; return pic(s); }
function imgBel()  { const s = SEEDS.bel[_counters.bel++ % SEEDS.bel.length]; return pic(s); }
function imgCui()  { const s = SEEDS.cui[_counters.cui++ % SEEDS.cui.length]; return pic(s); }
function imgBeb()  { const s = SEEDS.beb[_counters.beb++ % SEEDS.beb.length]; return pic(s); }
function imgMer()  { const s = SEEDS.mer[_counters.mer++ % SEEDS.mer.length]; return pic(s); }
function imgMar()  { const s = SEEDS.mar[_counters.mar++ % SEEDS.mar.length]; return pic(s); }

/* ── Tags ── */
const T = {
  oferta:    { label: 'Oferta',       color: '#e53935' },
  vendido:   { label: 'Más vendido',  color: '#1565C0' },
  nuevo:     { label: 'Nuevo',        color: '#2E7D32' },
  promo:     { label: 'Promo',        color: '#e65100' },
  exclusivo: { label: 'Exclusivo',    color: '#6A1B9A' },
};

/* ════════════════════════════════════════════════════════════
   CATÁLOGO — Productos con soporte de presentaciones
   ════════════════════════════════════════════════════════════
   SISTEMA DE IMÁGENES POR LABORATORIO
   ─────────────────────────────────────────────────────────
   Para que cada laboratorio muestre su propia imagen al
   seleccionarse, agrega el campo `imagen` directamente en
   el bloque del laboratorio:

     laboratorios: {
       genfar_s_a: {
         nombre: 'GENFAR S.A.',
         nombreProducto: 'ACETAMINOFEN 500MG X 48 TAB',
         imagen: 'img/productos/Genfar Acetaminofen.jpg',  ← AQUÍ
         precios: { ... }
       },
       mk_tecnoquimicas: {
         nombre: 'TECNOQUIMICAS S.A.',
         nombreProducto: 'ACETAMINOFEN MK 500MG X100',
         imagen: 'img/productos/MK Acetaminofen 500mg.jpg', ← AQUÍ
         precios: { ... }
       }
     }

   Si un laboratorio NO tiene campo `imagen`:
   - catalogo.js intentará hacer fuzzy-match con variantes[]
   - Si tampoco hay variante con imagen → usa producto.imagen
   - Si tampoco → usa imagen placeholder de picsum.photos
   ════════════════════════════════════════════════════════════ */
const CATALOGO = [

  /* ─────────────────────────────────────────────────────────
     1. MEDICAMENTOS — ANALGÉSICOS Y ANTIPIRÉTICOS
     ─────────────────────────────────────────────────────────
     NUEVO: campo "presentaciones" disponible en medicamentos
     Si el producto tiene "presentaciones", el usuario podrá
     elegir comprar por Unidad, Caja, Blíster, etc.
     ───────────────────────────────────────────────────────── */
  {
    id: 1,
    nombre: 'Acetaminofén 500mg',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'CRONOFEN ACETAMINOFEN 500MG X100TAB',
        imagen: 'img/productos/Cronofen 500mg x400 tab.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
      tecnoquimicas_s_a: {
        imagen: 'img/productos/MK 500mg x10.jpg',
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ACETAMINOFEN FORTE    500MG  +  CAFEINA  65 MG  X',
        precios: {
          blister: { label: 'Blíster', precio: 9200 },
          caja: { label: 'Caja', precio: 17300 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'ACETAMINOFEN 500MG + CAFEINA 65MG X 48 TAB',
        imagen: 'img/productos/ACETAMINOFEN 500MG + CAFEINA 65MG X 48 TAB.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 33000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        imagen: 'img/productos/Laproff 500mg x300.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
          frasco: { label: 'Frasco', precio: 4100 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 10 TAB',
        imagen: 'img/productos/PLURIGRAM CIPROFLOZACINA 500MG 10 TAB.jpg',
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'ACETAMINOFEN 150 MG JARABE 90 ML LS',
        imagen: 'img/productos/ACETAMINOFEN 150 MG JARABE 90 ML LS.jpg',
        precios: {
          frasco: { label: 'Frasco', precio: 8500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Genfar / Lafrancol',
    descripcion: 'Analgésico y antipirético de acción rápida. Disponible en varias marcas y presentaciones.',
    imagen: 'img/productos/Acetaminofén 500mg.jpg',
    tags: [T.vendido],
    /*
     * PRESENTACIONES: permite vender este medicamento por unidad
     * El precio de "Unidad" es el precio de 1 sola tableta/cápsula
     */
    presentaciones: [
      { tipo: 'Unidad',      precio: 200  },
      { tipo: 'Blíster x10', precio: 1800 },
      { tipo: 'Caja x100',   precio: 16000 },
    ],
    variantes: [
      { laboratorio: 'Cronofen',  tipo: 'Cronofen 500mg x400 tab', precio: 28000, imagen: 'img/productos/Cronofen 500mg x400 tab.jpg' },
      { laboratorio: 'MK',        tipo: 'MK 500mg x10',            precio: 3200,  imagen: 'img/productos/MK 500mg x10.jpg' },
      { laboratorio: 'MK',        tipo: 'MK 500mg x100',           precio: 18000, imagen: 'img/productos/MK 500mg x100.jpg' },
      { laboratorio: 'Lafrancol', tipo: 'Laproff 500mg x300',      precio: 42000, imagen: 'img/productos/Laproff 500mg x300.jpg' },
      { laboratorio: 'Genfar',    tipo: 'Genfar Jarabe 120ml',     precio: 7800,  imagen: 'img/productos/Genfar Jarabe 120ml.jpg' },
    ],
  },
  {
    id: 2,
    nombre: 'Ibuprofeno 400mg',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'IBUPROFENO 400MG X60 TAB COASPHARMA',
        imagen: 'img/productos/IBUPROFENO 400MG X60 TAB COASPHARMA.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 12000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'IBUPROFENO   400MG X 300 TABLETAS RECUB',
        imagen: 'img/productos/Laproff 400mg x300 tab recub.jpg',
        precios: {
          caja: { label: 'Caja', precio: 50300 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'IBUPROFENO SUSPENSION 120 ML AG',
        imagen: 'img/productos/IBUPROFENO SUSPENSION 120 ML AG.jpg',
        precios: {
          frasco: { label: 'Frasco', precio: 9300 },
        },
      },
      bcn_medical_s_a: {
        nombre: 'BCN MEDICAl S.A',
        nombreProducto: 'KLAFEDOL IBUPROFENO 5 % PORCENTAJE GEL 50 GRAMOS B',
        imagen: 'img/productos/KLAFEDOL IBUPROFENO 5 % PORCENTAJE GEL 50 GRAMOS B,jpg',
        precios: {
          caja: { label: 'Caja', precio: 19800 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'NEXT GL IBUPROFENO 200 MG MILIGRAMO(S) CAPSULA DE',
        imagen: 'img/productos/NEXT GL IBUPROFENO 200 MG MILIGRAMO(S) CAPSULA DE.jpg',
        precios: {
          caja: { label: 'Caja', precio: 12800 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'LEGRIP IBUPROFENO 200 MG MILIGRAMO(S) CAPSULA DE G',
        imagen: 'img/productos/LEGRIP IBUPROFENO 200 MG MILIGRAMO(S) CAPSULA DE G.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 9500 },
          caja: { label: 'Caja', precio: 90000 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ADVIL ULTRA IBUPROFENO FSCO X 20 CAPS',
        imagen: 'img/productos/ADVIL ULTRA IBUPROFENO FSCO X 20 CAPS.jpg',
        precios: {
          caja: { label: 'Caja', precio: 41000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DOLISTAN  IBUPROFENO JARABE  120 ML',
        imagen: 'img/productos/DOLISTAN  IBUPROFENO JARABE  120 ML.jpg',
        precios: {
          caja: { label: 'Caja', precio: 16900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'IBUPROFENO 800 MG 30 CAPSULAS BLANDAS MK TECNOQUIM',
        imagen: 'img/productos/IBUPROFENO 800 MG 30 CAPSULAS BLANDAS MK TECNOQUIM.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 6400 },
          caja: { label: 'Caja', precio: 37000 },
          unidad: { label: 'Unidad', precio: 1400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lafrancol/ MK / Genfar',
    descripcion: 'Antiinflamatorio no esteroideo para dolor e inflamación muscular y articular.',
    imagen: 'img/productos/Ibuprofeno 400mg.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',      precio: 300  },
      { tipo: 'Blíster x10', precio: 2500 },
      { tipo: 'Caja x30',    precio: 7000 },
    ],
    variantes: [
      { laboratorio: 'Lafrancol', tipo: 'Laproff 400mg x300 tab recub', precio: 49000, imagen: 'img/productos/Laproff 400mg x300 tab recub.jpg' },
      { laboratorio: 'MK',        tipo: 'MK 400mg x10',                 precio: 29000, imagen: 'img/productos/MK 400mg x10.jpg' },
      { laboratorio: 'Genfar',    tipo: 'Genfar 400mg x10',             precio: 4000,  imagen: 'img/productos/Genfar 400mg x10.jpg' },
    ],
  },
  {
    id: 3,
    nombre: 'Ibuprofeno 800mg',
    laboratorios: {
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'IBUPROFENO SUSPENSION 120 ML AG',
        imagen: 'img/productos/Ibuprofeno Suspensión 120ml.jpg',
        precios: {
          frasco: { label: 'Frasco', precio: 9300 },
        },
      },
      bcn_medical_s_a: {
        nombre: 'BCN MEDICAl S.A',
        nombreProducto: 'KLAFEDOL IBUPROFENO 5 % PORCENTAJE GEL 50 GRAMOS B',
        imagen: 'img/productos/KLAFEDOL IBUPROFENO 5 % PORCENTAJE GEL 50 GRAMOS BI.jpg',
        precios: {
          caja: { label: 'Caja', precio: 19800 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'ACTIVIRAL  ACICLOVIR 800MG X 10 TAB',
        imagen: 'img/productos/ACTIVIRAL  ACICLOVIR 800MG X 10 TAB.jpg',
        precios: {
          caja: { label: 'Caja', precio: 25800 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'IBUPROFENO 800MG X60 TAB COASPHARMA',
        imagen: 'img/productos/IBUPROFENO 800MG X60 TAB COASPHARMA.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 12000 },
        },
      },
      tecnoquimicas_s_a: {
        imagen: 'img/productos/MK 800mg 30 cáps blandas.jpg',
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'IBUPROFENO 800 MG 30 CAPSULAS BLANDAS MK TECNOQUIM',
        precios: {
          blister: { label: 'Blíster', precio: 6400 },
          caja: { label: 'Caja', precio: 37000 },
          unidad: { label: 'Unidad', precio: 1400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Motrin',
    descripcion: 'Antiinflamatorio de alta potencia para dolor severo. Requiere control médico.',
    imagen: 'img/productos/MK 800mg caja x50 tab.jpg',
    tags: [T.oferta],
    presentaciones: [
      { tipo: 'Unidad',   precio: 600  },
      { tipo: 'Caja x50', precio: 24000 },
    ],
    variantes: [
      { laboratorio: 'MK',     tipo: 'MK 800mg caja x50 tab',    precio: 24000, imagen: 'img/productos/MK 800mg caja x50 tab.jpg' },
      { laboratorio: 'MK',     tipo: 'MK 800mg 30 cáps blandas', precio: 28000, imagen: 'img/productos/MK 800mg 30 cáps blandas.jpg' },
      { laboratorio: 'Motrin', tipo: 'Motrin 800mg x30 tab',      precio: 32000, imagen: 'img/productos/Motrin 800mg x30 tab.jpg' },
    ],
  },
  {
    id: 4,
    nombre: 'Dolex Forte',
    laboratorios: {
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX FORTE NF 48 TABLETAS',
        imagen: 'img/productos/DOLEX FORTE NF 48 TABLETAS.jpg',
        precios: {
          caja: { label: 'Caja', precio: 57600 },
          unidad: { label: 'Unidad', precio: 1600 },
          par: { label: 'Par', precio: 3000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DOLEX FORTE CAJA 100 UND',
        imagen: 'img/productos/DOLEX FORTE CAJA 100 UND.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 9500 },
          caja: { label: 'Caja', precio: 193523 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'MINOXIDIL FORTE 5% LOCION 60 ML MK',
        imagen: 'img/productos/MINOXIDIL FORTE 5% LOCION 60 ML MK.jpg',
        precios: {
          frasco: { label: 'Frasco', precio: 76900 },
          caja: { label: 'Caja', precio: 59000 },
          par: { label: 'Par', precio: 6700 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'CAFI ASPIRINA FORTE X 36 TAB',
        imagen: 'img/productos/CAFI ASPIRINA FORTE X 36 TAB.jpg',
        precios: {
          caja: { label: 'Caja', precio: 37500 },
          par: { label: 'Par', precio: 2200 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'LUMBAL FORTE 36 TABLETAS',
        imagen: 'img/productos/LUMBAL FORTE 36 TABLETAS.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 14000 },
          caja: { label: 'Caja', precio: 80744 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'NAPROFLASH FORTE 500 MG 80 TBS',
        imagen: 'img/productos/NAPROFLASH FORTE 500 MG 80 TBS.jpg',
        precios: {
          caja: { label: 'Caja', precio: 160000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'GSK',
    descripcion: 'Analgésico de doble acción para dolores intensos. Fórmula probada GSK.',
    imagen: 'img/productos/Dolex Forte caja x100 tab.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 500  },
      { tipo: 'Blíster x4', precio: 1800 },
      { tipo: 'Caja x100', precio: 28000 },
    ],
    variantes: [
      { laboratorio: 'GSK', tipo: 'Dolex Forte caja x100 tab', precio: 28000, imagen: 'img/productos/Dolex Forte caja x100 tab.jpg' },
      { laboratorio: 'GSK', tipo: 'Dolex Forte x10 tab',       precio: 6800,  imagen: 'img/productos/Dolex Forte x10 tab.jpg' },
    ],
  },
  {
    id: 5,
    nombre: 'Dolex Bebés',
    laboratorios: {
      glaxo_smithkline_con: {
        imagen: 'img/productos/Dolex Bebés 60ml jarabe.jpg',
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX BEBES 60 ML JARABE',
        precios: {
          frasco: { label: 'Frasco', precio: 17300 },
          caja: { label: 'Caja', precio: 25000 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1500 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          blister: { label: 'Blíster', precio: 5300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'GSK',
    descripcion: 'Acetaminofén en jarabe 120ml para bebés. Alivio de fiebre y dolor leve.',
    imagen: 'img/productos/Dolex Bebés 120ml jarabe.jpg',
    tags: [T.vendido],
    /* Sin presentaciones — se vende solo como frasco completo */
    variantes: [
      { laboratorio: 'GSK', tipo: 'Dolex Bebés 60ml jarabe', precio: 12000, imagen: 'img/productos/Dolex Bebés 60ml jarabe.jpg' },
    ],
  },
  {
    id: 6,
    nombre: 'X Ray Dol',
    categoria: 'Medicamentos',
    marca: 'Grunenthal',
    descripcion: 'Tramadol + Ketorolaco. Analgésico combinado para dolor moderado a severo.',
    imagen: 'img/productos/X Ray Dol x48 tabletas.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 900  },
      { tipo: 'Blíster x6', precio: 5000 },
    ],
    variantes: [
      { laboratorio: 'Grunenthal', tipo: 'X Ray Dol x48 tabletas', precio: 42000, imagen: 'img/productos/X Ray Dol x48 tabletas.jpg' },
      { laboratorio: 'Grunenthal', tipo: 'X Ray Dol x80 tabletas', precio: 68000, imagen: 'img/productos/X Ray Dol x80 tabletas.jpg' },
    ],
  },
  {
    id: 7,
    nombre: 'Sevedol Extra Fuerte',
    laboratorios: {
      lafrancol_s_a: {
        imagen: 'img/productos/Extra Fuerte x60 tab.jpg',
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'SEVEDOL EXTRAFUERTE X 24 TAB',
        imagen: 'img/productos/SEVEDOL EXTRAFUERTE X 24 TAB.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 10800 },
          caja: { label: 'Caja', precio: 43200 },
          par: { label: 'Par', precio: 3600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Sevedol',
    descripcion: 'Analgésico de alta potencia para dolores intensos musculares y articulares.',
    imagen: 'img/productos/Extra Fuerte x60 tab.jpg',
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Unidad',   precio: 500  },
      { tipo: 'Caja x60', precio: 28000 },
    ],
    variantes: [
      { laboratorio: 'Sevedol', tipo: 'Extra Fuerte x60 tab', precio: 28000, imagen: 'img/productos/Extra Fuerte x60 tab.jpg' },
    ],
  },
  {
    id: 8,
    nombre: 'Naproxeno 500mg',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        imagen: 'img/productos/NAPROXENO 500MG CAJA X 300 TABLETAS.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 100 TAB',
         imagen: 'img/productos/PLURIGRAM CIPROFLOZACINA 500MG 100 TAB.jpg',
        
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'NAPROXENO SODICO 125MG/5ML',
        imagen: 'img/productos/NAPROXENO SODICO 125MG5ML.jpg',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
          blister: { label: 'Blíster', precio: 1500 },
        },
      },
      lafrancol_s_a: {
        imagen: 'img/productos/Naproxeno 500mg x300 tab.jpg',
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'NAPROXENO 500 MG 10 TABLETAS AG',
        precios: {
          caja: { label: 'Caja', precio: 5000 },
        },
      },
      capsuland_colombia_s: {
        nombre: 'Capsuland Colombia SAS',
        nombreProducto: 'COLAGENO SUPL DIET 500MG X 30 CAPS',
        precios: {
          frasco: { label: 'Frasco', precio: 19900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'COLAGENO HIDROLIZADO 500MG X30 CAPS',
        imagen: 'img/productos/Naproxeno 500mg x300 tab.jpg',
        precios: {
          caja: { label: 'Caja', precio: 32000 },
          blister: { label: 'Blíster', precio: 18000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lafrancol / LP',
    descripcion: 'AINE para dolor moderado, artritis y dismenorrea. Larga duración.',
    imagen: 'img/productos/Naproxeno 500mg x300 tab.jpg',
    tags: [T.oferta],
    presentaciones: [
      { tipo: 'Unidad',    precio: 400  },
      { tipo: 'Blíster x8', precio: 3000 },
    ],
    variantes: [
      { laboratorio: 'LP',        tipo: 'Naproflash Forte 500mg x80 tab', precio: 28000, imagen: 'img/productos/Naproflash Forte 500mg x80 tab.jpg' },
      { laboratorio: 'Lafrancol', tipo: 'Naproxeno 500mg x300 tab',       precio: 58000, imagen: 'img/productos/Naproxeno 500mg x300 tab.jpg' },
    ],
  },
  {
    id: 9,
    nombre: 'Naproxeno 250mg',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PERCLUSONE NAPROXENO 250MG  X 10 TAB',
        imagen: 'img/productos/Naproxeno 250mg x300 tab.jpg',
        precios: {
          caja: { label: 'Caja', precio: 11900 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        imagen: 'img/productos/Naproxeno 250mg x300 tab.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'EUMOXINA AMOXICILINA  250MG / 5 ML SUSP X 100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 23900 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'NAPROXENO SODICO 125MG/5ML',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
          frasco: { label: 'Frasco', precio: 7900 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'NAPROXENO 500 MG 10 TABLETAS AG',
        precios: {
          caja: { label: 'Caja', precio: 5000 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'FLEMOXIN  SUSP  CARBOCISTEINA  250MG/5ML   X 120ML',
        precios: {
          caja: { label: 'Caja', precio: 15600 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'NAPROXENO 500 MG MILIGRAMO(S) TABLETA GENFAR S.A.',
        imagen: 'img/productos/Naproxeno 250mg x300 tab.jpg',
        precios: {
          caja: { label: 'Caja', precio: 5800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Antiinflamatorio no esteroideo en presentación de 250mg. Ideal inicio de tratamiento.',
    imagen: 'img/productos/Naproxeno 250mg x300 tab.jpg',
    tags: [],
    presentaciones: [
      { tipo: 'Unidad',    precio: 250  },
      { tipo: 'Caja x300', precio: 38000 },
    ],
    variantes: [
      { laboratorio: 'LP', tipo: 'Naproxeno 250mg x300 tab', precio: 38000, imagen: 'img/productos/Naproxeno 250mg x300 tab.jpg' },
    ],
  },
  {
    id: 10,
    nombre: 'Advil Ultra',
    laboratorios: {
      pfizer_s_a_s: {
        imagen: 'img/productos/Advil Ultra x72 cáps.jpg',
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ADVIL ULTRA X 40 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 69000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 2300 },
          par: { label: 'Par', precio: 4000 },
          unidad: { label: 'Unidad', precio: 2300 },
          frasco: { label: 'Frasco', precio: 37000 },
        },
      },
      health_care: {
        nombre: 'HEALTH CARE',
        nombreProducto: 'ADVIL ULTRA  CAJA X 72 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA ULTRA 500 MG 100 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      colombiana_kimberly_: {
        nombre: 'COLOMBIANA KIMBERLY COLPA',
        nombreProducto: 'TOA.KOTEX ULTRA TELA 10 UDS AHOR.15 KISS',
        precios: {
          paquete: { label: 'Paquete', precio: 6800 },
        },
      },
      lab_vogue: {
        nombre: 'LAB VOGUE',
        nombreProducto: 'VOGUE PESTANINA ULTRA VOLUMEN NEGRO 9 GRAMOS LABOR',
        precios: {
          frasco: { label: 'Frasco', precio: 22500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Pfizer',
    descripcion: 'Ibuprofeno en cápsulas líquidas de absorción rápida. Alivio en 15 minutos.',
    imagen: 'img/productos/Advil Ultra x72 cáps.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',      precio: 500  },
      { tipo: 'Blíster x6',  precio: 2800 },
    ],
    variantes: [
      { laboratorio: 'Pfizer', tipo: 'Advil Ultra x72 cáps',         precio: 32000, imagen: 'img/productos/Advil Ultra x72 cáps.jpg' },
      { laboratorio: 'Pfizer', tipo: 'Advil Max x72 cáps',           precio: 34000, imagen: 'img/productos/Advil Max x72 cáps.jpg' },
      { laboratorio: 'Pfizer', tipo: 'Advil Gripa x72 cáps',         precio: 35000, imagen: 'img/productos/Advil Gripa x72 cáps.jpg' },
      { laboratorio: 'Pfizer', tipo: 'Advil Gripa Max x40 cáps liq', precio: 22000, imagen: 'img/productos/Advil Gripa Max x40 cáps liq.jpg' },
      { laboratorio: 'Pfizer', tipo: 'Advil Espalda x20 tab',        precio: 14000, imagen: 'img/productos/Advil Espalda x20 tab.jpg' },
    ],
  },
  {
    id: 11,
    nombre: 'Ibuflash Migrán',
    laboratorios: {
      tecnoquimicas_s_a: {
        imagen: 'img/productos/Ibuflash Migrán x30 cáps.jpg',
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'IBUFLASH  MIGRAN  X30 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 62674 },
          par: { label: 'Par', precio: 4700 },
          blister: { label: 'Blíster', precio: 9200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Ibuflash',
    descripcion: 'Ibuprofeno de liberación rápida formulado para migraña y cefalea tensional.',
    imagen: 'img/productos/Ibuflash Migrán x30 cáps.jpg',
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Unidad',    precio: 700  },
      { tipo: 'Caja x30',  precio: 18000 },
    ],
    variantes: [
      { laboratorio: 'Ibuflash', tipo: 'Ibuflash Migrán x30 cáps', precio: 18000, imagen: 'img/productos/Ibuflash Migrán x30 cáps.jpg' },
    ],
  },
  {
    id: 12,
    nombre: 'Lumbal Forte',
    laboratorios: {
      lafrancol_s_a: {
        imagen: 'img/productos/Lumbal Forte x36 tab.jpg',
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'LUMBAL FORTE 36 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 14000 },
          caja: { label: 'Caja', precio: 80744 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'MINOXIDIL FORTE 5% LOCION 60 ML MK',
        imagen: 'img/productos/Lumbal Forte x36 tab.jpg',
        precios: {
          frasco: { label: 'Frasco', precio: 76900 },
          caja: { label: 'Caja', precio: 59000 },
          par: { label: 'Par', precio: 6700 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX FORTE NF 48 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 57600 },
          unidad: { label: 'Unidad', precio: 1600 },
          blister: { label: 'Blíster', precio: 6500 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'CAFI ASPIRINA FORTE X 36 TAB',
        precios: {
          caja: { label: 'Caja', precio: 37500 },
          par: { label: 'Par', precio: 2200 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'NAPROFLASH FORTE 500 MG 80 TBS',
        precios: {
          caja: { label: 'Caja', precio: 160000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      salus_pharma: {
        nombre: 'SALUS PHARMA',
        nombreProducto: 'NODOL FORTE X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 17000 },
          caja: { label: 'Caja', precio: 38700 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      boehringer_ingelheim: {
        nombre: 'BOEHRINGER INGELHEIM',
        nombreProducto: 'NIFLAMIN PL FORTE 15 MG 5 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 42500 },
          unidad: { label: 'Unidad', precio: 9200 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ROBITUSSIN TOS FORTE JBE 150 ML',
        precios: {
          caja: { label: 'Caja', precio: 22900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lumbal',
    descripcion: 'Analgésico y relajante muscular para dolor lumbar agudo.',
    imagen: 'img/productos/Lumbal Forte x36 tab.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 650  },
      { tipo: 'Caja x36', precio: 22000 },
    ],
    variantes: [
      { laboratorio: 'Lumbal', tipo: 'Lumbal Forte x36 tab', precio: 22000, imagen: 'img/productos/Lumbal Forte x36 tab.jpg' },
    ],
  },
  {
    id: 13,
    nombre: 'Duraflex Espalda Forte',
    laboratorios: {
      tecnoquimicas_s_a: {
        imagen: 'img/productos/Duraflex Espalda Forte x18 cáps.jpg',
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DURAFLEX ESPALDA FORTE X 18 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 59000 },
          par: { label: 'Par', precio: 6700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Duraflex',
    descripcion: 'Alivia el dolor de espalda con fórmula combinada de rápida acción.',
    imagen: 'img/productos/Duraflex Espalda Forte x18 cáps.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'Duraflex', tipo: 'Duraflex Espalda Forte x18 cáps', precio: 16000, imagen: 'img/productos/Duraflex Espalda Forte x18 cáps.jpg' },
    ],
  },
  {
    id: 14,
    nombre: 'Fencafen 100mg',
    laboratorios: {
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'TRAMADOL 10 %GOTAS ORALES 100MG /10ML EXPOFARMA',
        precios: {
          frasco: { label: 'Frasco', precio: 8900 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'NITOXIPAR NITAZOXANIDA 100MG/5ML  SUSP X 30 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29800 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'FENCAFEN 100 MG 50 TABLETAS',
        imagen: 'img/productos/Fencafen 100mg x50 tab.jpg',
        precios: {
          caja: { label: 'Caja', precio: 100000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 2000 },
        },
      },
      ophalac: {
        nombre: 'OPHALAC',
        nombreProducto: 'ACIDO ACETILSALICILICO 100MG',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'TIAMINA 100MG/ML  X10 ML SOL INY  CJX12UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 6700 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MICOTRAZOL  ITRACONAZOL  100MG   X4 CAPS',
        imagen: 'img/productos/Fencafen 100mg x50 tab.jpg',
        precios: {
          caja: { label: 'Caja', precio: 22500 },
          blister: { label: 'Blíster', precio: 2500 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'HIERRO SACAROSA 100MG/5ML  SOL INY',
        precios: {
          caja: { label: 'Caja', precio: 33000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'IBUPROFENO SUSP 100MG/5ML',
        precios: {
          caja: { label: 'Caja', precio: 4900 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'SULFAOFTAL SULFACETAMINA SODICA 100MG/ML  15 ML SO',
        precios: {
          caja: { label: 'Caja', precio: 19500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Fencafen',
    descripcion: 'Analgésico y antiespasmódico. Alivia dolor abdominal y espasmos musculares.',
    imagen: 'img/productos/Fencafen 100mg x50 tab.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'Fencafen', tipo: 'Fencafen 100mg x50 tab', precio: 18000, imagen: 'img/productos/Fencafen 100mg x50 tab.jpg' },
    ],
  },
  {
    id: 15,
    nombre: 'Aspirina 100mg',
    laboratorios: {
      bayer_s_a: {
        imagen: 'img/productos/Pack 4 Aspirina 100mg x140 tab.jpg',
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
          par: { label: 'Par', precio: 2200 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'TRAMADOL 10 %GOTAS ORALES 100MG /10ML EXPOFARMA',
        precios: {
          frasco: { label: 'Frasco', precio: 8900 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'NITOXIPAR NITAZOXANIDA 100MG/5ML  SUSP X 30 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29800 },
        },
      },
      ophalac: {
        nombre: 'OPHALAC',
        nombreProducto: 'ACIDO ACETILSALICILICO 100MG',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'TIAMINA 100MG/ML  X10 ML SOL INY  CJX12UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 6700 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MICOTRAZOL  ITRACONAZOL  100MG   X4 CAPS',
        imagen: 'img/productos/Aspirina efervescente 500mg x50.jpg',
        precios: {
          caja: { label: 'Caja', precio: 22500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Bayer / MK',
    descripcion: 'Antiagregante plaquetario preventivo cardiovascular. Uso diario cardioprotector.',
    imagen: 'img/productos/Pack 4 Aspirina 100mg x140 tab.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 150   },
      { tipo: 'Caja x28',  precio: 3500  },
      { tipo: 'Caja x140', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'Bayer', tipo: 'Pack 4 Aspirina 100mg x140 tab', precio: 42000, imagen: 'img/productos/Pack 4 Aspirina 100mg x140 tab.jpg' },
      { laboratorio: 'MK',    tipo: 'ASA 100mg x100 tab',             precio: 16000, imagen: 'img/productos/ASA 100mg x100 tab.jpg' },
      { laboratorio: 'Bayer', tipo: 'Aspirina efervescente 500mg x50', precio: 22000, imagen: 'img/productos/Aspirina efervescente 500mg x50.jpg' },
    ],
  },
  {
    id: 16,
    nombre: 'Neosaldina',
    laboratorios: {
      eurofarma_colombia_s: {
        imagen: 'img/productos/Neosaldina x25 blister x4 grageas.jpg',
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'NEOSALDINA CAJA X 25 BLISTER X 4 GRANJEAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 150000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Neosaldina',
    descripcion: 'Analgésico combinado para cefalea y migraña. Clásico de alta efectividad.',
    imagen: 'img/productos/Neosaldina x25 blister x4 grageas.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad (sobre x4)', precio: 1000 },
      { tipo: 'Caja x25 sobres',   precio: 22000 },
    ],
    variantes: [
      { laboratorio: 'Neosaldina', tipo: 'x25 blister x4 grageas', precio: 22000, imagen: 'img/productos/Neosaldina x25 blister x4 grageas.jpg' },
    ],
  },
  {
    id: 17,
    nombre: 'Alka-Seltzer',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ALKA- SELTZER  60 TABL',
        imagen: 'img/productos/Alka-Seltzer x60 tab efervescentes.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 2400 },
          caja: { label: 'Caja', precio: 59748 },
          unidad: { label: 'Unidad', precio: 1500 },
          six_pack: { label: 'Six Pack', precio: 1 },
        },
      },
      bayer_s_a: {
        imagen: 'img/productos/Alka-Seltzer x60 tab efervescentes.jpg',
        nombre: 'BAYER S.A.',
        nombreProducto: 'ALKA SELTZER EXTREME  CAJA X 4  SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
          unidad: { label: 'Unidad', precio: 2700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Bayer',
    descripcion: 'Antiácido efervescente para malestar estomacal, resaca y acidez.',
    imagen: 'img/productos/Alka-Seltzer x60 tab efervescentes.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad (x2 tab)', precio: 1200  },
      { tipo: 'Caja x60 tab',    precio: 28000 },
    ],
    variantes: [
      { laboratorio: 'Bayer', tipo: 'Alka-Seltzer x60 tab efervescentes', precio: 28000, imagen: 'img/productos/Alka-Seltzer x60 tab efervescentes.jpg' },
    ],
  },
  {
    id: 18,
    nombre: 'Ainedix (Aceclofenaco 100mg)',
    laboratorios: {
      labquifar_ltda: {
        imagen: 'img/productos/Aceclofenaco 100mg x10 tab.jpg',
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'AINEDIX  ACECLOFENACO 100 MG CAJA X 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 16800 },
          par: { label: 'Par', precio: 3500 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Ainedix',
    descripcion: 'AINE de nueva generación con menor irritación gástrica. Dolor articular y muscular.',
    imagen: 'img/productos/Aceclofenaco 100mg x10 tab.jpg',
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Unidad',   precio: 1300  },
      { tipo: 'Caja x10', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'Ainedix', tipo: 'Aceclofenaco 100mg x10 tab', precio: 12000, imagen: 'img/productos/Aceclofenaco 100mg x10 tab.jpg' },
    ],
  },

  /* ── Antiespasmódicos ── */
  {
    id: 19,
    nombre: 'Espasmydol',
    laboratorios: {
      labquifar_ltda: {
        imagen: 'img/productos/Espasmydol MetroIbup x20 tab.jpg',
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'ESPASMYDOL METO/IBUP X 20 TAB',
        precios: {
          caja: { label: 'Caja', precio: 38000 },
          par: { label: 'Par', precio: 4000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Grunenthal',
    descripcion: 'Metoclopramida + Ibuprofeno. Para cólicos y dolor abdominal con náuseas.',
    imagen: 'img/productos/Espasmydol Metrolbup x20 tab.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 1000  },
      { tipo: 'Caja x20', precio: 18000 },
    ],
    variantes: [
      { laboratorio: 'Grunenthal', tipo: 'Espasmydol MetroIbup x20 tab', precio: 18000, imagen: 'img/productos/Espasmydol MetroIbup x20 tab.jpg' },
    ],
  },
  {
    id: 20,
    nombre: 'Buscopan / Buscapina',
    laboratorios: {
      boehringer_ingelheim: {
        imagen: 'img/productos/Buscapina Fem x90 tab.jpg',
        nombre: 'BOEHRINGER INGELHEIM',
        nombreProducto: 'BUSCAPINA FEM X 90 TAB',
        precios: {
          caja: { label: 'Caja', precio: 152440 },
          par: { label: 'Par', precio: 3600 },
          unidad: { label: 'Unidad', precio: 1900 },
        },
      },
      sanofi_aventis_de_co: {
        imagen: 'img/productos/Buscapina NF Comp. 325-10mg x100 tab.jpg',
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'BUSCAPINA NF COMPOSITUM 325/10MG 100 TBS',
        precios: {
          caja: { label: 'Caja', precio: 140000 },
          par: { label: 'Par', precio: 3700 },
          unidad: { label: 'Unidad', precio: 2000 },
          blister: { label: 'Blíster', precio: 16000 },
          ampolla: { label: 'Ampolla', precio: 15800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Sanofi / Lafrancol',
    descripcion: 'Butilescopolamina para cólicos, espasmos intestinales y dolor menstrual.',
    imagen: 'img/productos/Buscapina Fem x90 tab.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 450   },
      { tipo: 'Blíster x4', precio: 1600 },
    ],
    variantes: [
      { laboratorio: 'Sanofi',    tipo: 'Buscapina NF Comp. 325/10mg x100 tab', precio: 38000, imagen: 'img/productos/Buscapina NF Comp. 325-10mg x100 tab.jpg' },
      { laboratorio: 'Lafrancol', tipo: 'Buscapina Fem x90 tab',                precio: 42000, imagen: 'img/productos/Buscapina Fem x90 tab.jpg' },
    ],
  },
  {
    id: 21,
    nombre: 'Viceralgina',
    laboratorios: {
      labquifar_ltda: {
        imagen: 'img/productos/Viceralgina 10-500mg tab.jpg',
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'VICERALGINA (BUTILBROMURO DE HIOSCINA 10 MG + ACET',
        precios: {
          caja: { label: 'Caja', precio: 34000 },
          par: { label: 'Par', precio: 4000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Sanofi',
    descripcion: 'Hioscina + Acetaminofén. Antiespasmódico combinado para cólicos con dolor.',
    imagen: 'img/productos/Viceralgina 10-500mg tab.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 700   },
      { tipo: 'Blíster x4', precio: 2500 },
    ],
    variantes: [
      { laboratorio: 'Sanofi', tipo: 'Viceralgina 10/500mg tab', precio: 14000, imagen: 'img/productos/Viceralgina 10-500mg tab.jpg' },
    ],
  },
  {
    id: 22,
    nombre: 'Hioscina N-Butilbromuro 10mg',
    laboratorios: {
      labquifar_ltda: {
        imagen: 'img/productos/Viceralgina 10-500mg tab.jpg',
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'VICERALGINA (BUTILBROMURO DE HIOSCINA 10 MG + ACET',
        precios: {
          caja: { label: 'Caja', precio: 34000 },
          par: { label: 'Par', precio: 4000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      salus_pharma: {
        nombre: 'SALUS PHARMA',
        nombreProducto: 'NODOL SPAS ACETAM 325MG + HIOSCINA N-B 10MG X 10 T',
        precios: {
          caja: { label: 'Caja', precio: 17500 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      laproff: {
        imagen: 'img/productos/Hioscina 10mg x400 tab recub.jpg',
        nombre: 'LAPROFF',
        nombreProducto: 'HIOSCINA N-BUTILBROMURO  10 MG X 400 TAB RECUB',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 138000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'HIOSCINA N-BUTILBROMURO  10 MG CAJA X 330 TAB',
        precios: {
          caja: { label: 'Caja', precio: 130000 },
          unidad: { label: 'Unidad', precio: 4500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Antiespasmódico puro de alta concentración para espasmos intestinales severos.',
    imagen: 'img/productos/Hioscina 10mg x400 tab recub.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'LP', tipo: 'Hioscina 10mg x400 tab recub', precio: 58000, imagen: 'img/productos/Hioscina 10mg x400 tab recub.jpg' },
    ],
  },
  {
    id: 23,
    nombre: 'Dolorsin Fem',
    laboratorios: {
      novamed_s_a: {
        imagen: 'img/productos/Dolorsin Fem x36 cápsulas.jpg',
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'DOLORSIN FEM 36 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 8500 },
          caja: { label: 'Caja', precio: 71706 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Dolorsin',
    descripcion: 'Formulado específicamente para dolor menstrual y cólicos femeninos.',
    imagen: 'img/productos/Dolorsin Fem x36 cápsulas.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 700   },
      { tipo: 'Caja x36', precio: 22000 },
    ],
    variantes: [
      { laboratorio: 'Dolorsin', tipo: 'Dolorsin Fem x36 cápsulas', precio: 22000, imagen: 'img/productos/Dolorsin Fem x36 cápsulas.jpg' },
    ],
  },

  /* ── Antigripales ── */
  {
    id: 24,
    nombre: 'Noxpirin F Adultos',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NOXPIRIN PLUS CAPS ADLUTOS DIA NOCHE X  120 CAPS',
        imagen: 'img/productos/Noxpirin F Día Naranja x24 sbs.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 114000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      lab_siegfried_s_a: {
        imagen: 'img/productos/Noxpirin F Día Naranja x24 sbs.jpg',
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'NOXPIRIN F JUGO DIA MANDARINA GRA.24 SBS',
        precios: {
          caja: { label: 'Caja', precio: 38400 },
          unidad: { label: 'Unidad', precio: 2600 },
          blister: { label: 'Blíster', precio: 5000 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'LASS ADULTOS 50 SUPOSITORIOS',
        precios: {
          frasco: { label: 'Frasco', precio: 50000 },
          unidad: { label: 'Unidad', precio: 1900 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'BLOQ.SUNDARK ADULTOS SPF 60 120 ML',
        precios: {
          caja: { label: 'Caja', precio: 54000 },
        },
      },
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'BISOLVON ADULTOS 120 ML',
        precios: {
          caja: { label: 'Caja', precio: 33500 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'CEP.PRO 1000 ADULTOS DOBLE ACCION 2X1',
        precios: {
          paquete: { label: 'Paquete', precio: 15900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lafrancol',
    descripcion: 'Antigripal multisíntoma en polvo para bebida caliente. Sabores panela y limón.',
    imagen: 'img/productos/Noxpirin Plus Cáps x100.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Sobre individual', precio: 700   },
      { tipo: 'Caja x24 sobres', precio: 14000 },
    ],
    variantes: [
      { laboratorio: 'Lafrancol', tipo: 'Noxpirin F Noche Panela-Limón x24 sbs', precio: 14000, imagen: 'img/productos/Noxpirin F Noche Panela-Limón x24 sbs.jpg' },
      { laboratorio: 'Lafrancol', tipo: 'Noxpirin F Día Naranja x24 sbs',        precio: 14000, imagen: 'img/productos/Noxpirin F Día Naranja x24 sbs.jpg' },
      { laboratorio: 'Lafrancol', tipo: 'Noxpirin F Junior 15g x24 sbs',         precio: 12000, imagen: 'img/productos/Noxpirin F Junior 15g x24 sbs.jpg' },
      { laboratorio: 'Lafrancol', tipo: 'Noxpirin Plus Cáps x100',               precio: 32000, imagen: 'img/productos/Noxpirin Plus Cáps x100.jpg' },
      { laboratorio: 'Lafrancol', tipo: 'Noxpirin Plus Cáps x120',               precio: 38000, imagen: 'img/productos/Noxpirin Plus Cáps x120.jpg' },
    ],
  },
  {
    id: 25,
    nombre: 'Noraver Gripa',
    laboratorios: {
      tecnoquimicas_s_a: {
        imagen: 'img/productos/Noraver Gripa+Tos Fast x60 cáps liq.jpg',
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER GRIPA Y  TOS FAST TOTAL X 60 CAPS LIQ',
        precios: {
          caja: { label: 'Caja', precio: 168674 },
          par: { label: 'Par', precio: 5600 },
          unidad: { label: 'Unidad', precio: 2900 },
          blister: { label: 'Blíster', precio: 2900 },
          frasco: { label: 'Frasco', precio: 30900 },
        },
      },
      chalver_de_colombia: {
        nombre: 'CHALVER DE COLOMBIA',
        nombreProducto: 'DESCONGEL GRIPA 100 CAP.BLANDA GELAT.',
        precios: {
          caja: { label: 'Caja', precio: 120000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 1300 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX GRIPA 100 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5300 },
          caja: { label: 'Caja', precio: 89574 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'NEXT GRIPA X 48 TAB',
        precios: {
          caja: { label: 'Caja', precio: 78000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ADVIL GRIPA 10 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Noraver',
    descripcion: 'Antigripal completo día y noche. Disponible en tabletas, cápsulas y polvo.',
    imagen: 'img/productos/noravergripa.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Sobre individual', precio: 900   },
      { tipo: 'Caja x12 sobres', precio: 10000 },
    ],
    variantes: [
      { laboratorio: 'Noraver', tipo: 'Noraver Garganta x12 sobres surtidos', precio: 10000, imagen: 'img/productos/Noraver Garganta x12 sobres surtidos.jpg' },
      { laboratorio: 'Noraver', tipo: 'Noraver Gripa Noche Panela-Limón',     precio: 10000, imagen: 'img/productos/Noraver Gripa Noche Panela-Limón.jpg' },
      { laboratorio: 'Noraver', tipo: 'Noraver Gripa Bebida Día x12 sobres',  precio: 10000, imagen: 'img/productos/Noraver Gripa Bebida Día x12 sobres.jpg' },
      { laboratorio: 'Noraver', tipo: 'Noraver Gripa+Tos Fast x60 cáps liq',  precio: 28000, imagen: 'img/productos/Noraver Gripa+Tos Fast x60 cáps liq.jpg' },
    ],
  },
  {
    id: 26,
    nombre: 'PAX Antigripal',
    categoria: 'Medicamentos',
    marca: 'PAX',
    descripcion: 'Bebida caliente antigripal de acción rápida. Noche y día.',
    imagen: 'img/productos/PAX Día Naranja x24 sbs.jpg',
    tags: [],
    presentaciones: [
      { tipo: 'Sobre individual', precio: 600   },
      { tipo: 'Caja x24 sobres', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'PAX', tipo: 'PAX Caliente Noche Limón/Panela x24 sbs', precio: 12000, imagen: 'img/productos/PAX Caliente Noche Limón-Panela x24 sbs.jpg' },
      { laboratorio: 'PAX', tipo: 'PAX Día Naranja x24 sbs',                 precio: 12000, imagen: 'img/productos/PAX Día Naranja x24 sbs.jpg' },
    ],
  },
  {
    id: 27,
    nombre: 'Milpax NF',
    laboratorios: {
      farma_de_colombia_s_: {
        imagen: 'img/productos/Milpax NF Cereza Sachet 10ml x12 sbs.jpg',
        nombre: 'FARMA DE COLOMBIA S.A.',
        nombreProducto: 'MILPAX NF CEREZA SACHET 10 ML 12 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 24000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Milpax',
    descripcion: 'Solución oral cereza para fiebre y malestar gripal en niños. Sabor agradable.',
    imagen: 'img/productos/Milpax NF Cereza Sachet 10ml x12 sbs.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'Milpax', tipo: 'Milpax NF Cereza Sachet 10ml x12 sbs', precio: 9000, imagen: 'img/productos/Milpax NF Cereza Sachet 10ml x12 sbs.jpg' },
    ],
  },
  {
    id: 28,
    nombre: 'Mieltertos Gripa',
    laboratorios: {
      lab_natural_freshly_: {
        imagen: 'img/productos/Mieltertos Gripa Noche Panela-Limón.jpg',
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'MIELTERTOS GRIPA NOCHE PANE.LIMON 24 SBS',
        precios: {
          caja: { label: 'Caja', precio: 43200 },
          unidad: { label: 'Unidad', precio: 2500 },
          blister: { label: 'Blíster', precio: 2500 },
          frasco: { label: 'Frasco', precio: 29500 },
        },
      },
      chalver_de_colombia: {
        nombre: 'CHALVER DE COLOMBIA',
        nombreProducto: 'DESCONGEL GRIPA 100 CAP.BLANDA GELAT.',
        precios: {
          caja: { label: 'Caja', precio: 120000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 1300 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX GRIPA 100 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5300 },
          caja: { label: 'Caja', precio: 89574 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'NEXT GRIPA X 48 TAB',
        precios: {
          caja: { label: 'Caja', precio: 78000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ADVIL GRIPA 10 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER GRIPA Y  TOS FAST TOTAL X 60 CAPS LIQ',
        precios: {
          caja: { label: 'Caja', precio: 168674 },
          par: { label: 'Par', precio: 5600 },
          unidad: { label: 'Unidad', precio: 2900 },
          blister: { label: 'Blíster', precio: 2900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Mieltertos',
    descripcion: 'Antigripal con miel natural. Pastillas masticables y polvo para bebida caliente.',
    imagen: 'img/productos/Mieltertos Gripa Noche Panela-Limón.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'Mieltertos', tipo: 'Pastillas Masticables x12 sbs',    precio: 9000,  imagen: 'img/productos/Mieltertos Pastillas Masticables x12 sbs.jpg' },
      { laboratorio: 'Mieltertos', tipo: 'Gripa Noche Panela-Limón x24 sbs', precio: 12000, imagen: 'img/productos/Mieltertos Gripa Noche Panela-Limón.jpg' },
    ],
  },
  {
    id: 29,
    nombre: 'Descongel Gripa',
    laboratorios: {
      chalver_de_colombia: {
        imagen: 'img/productos/Descongel Gripa x100 cáps blandas gelat.jpg',
        nombre: 'CHALVER DE COLOMBIA',
        nombreProducto: 'DESCONGEL GRIPA 100 CAP.BLANDA GELAT.',
        precios: {
          caja: { label: 'Caja', precio: 120000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 1300 },
          unidad: { label: 'Unidad', precio: 16200 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX GRIPA 100 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5300 },
          caja: { label: 'Caja', precio: 89574 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'NEXT GRIPA X 48 TAB',
        precios: {
          caja: { label: 'Caja', precio: 78000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ADVIL GRIPA 10 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER GRIPA Y  TOS FAST TOTAL X 60 CAPS LIQ',
        precios: {
          caja: { label: 'Caja', precio: 168674 },
          par: { label: 'Par', precio: 5600 },
          unidad: { label: 'Unidad', precio: 2900 },
          blister: { label: 'Blíster', precio: 2900 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'MIELTERTOS GRIPA NOCHE PANE.LIMON 24 SBS',
        precios: {
          caja: { label: 'Caja', precio: 43200 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'CONGESTEX GRIPA GRANULADO 30 SBS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Descongel',
    descripcion: 'Descongestionante nasal en cápsulas blandas gelatin. Alivio rápido.',
    imagen: 'img/productos/Descongel Gripa x100 cáps blandas gelat.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'Descongel', tipo: 'Descongel Gripa x100 cáps blandas gelat.', precio: 28000, imagen: 'img/productos/Descongel Gripa x100 cáps blandas gelat.jpg' },
    ],
  },
  {
    id: 30,
    nombre: 'Sinutab Plus NS',
    laboratorios: {
      johnson_johnson_de_c: {
        imagen: 'img/productos/Sinutab Plus NS x12 tab.jpg',
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'SINUTAB PLUS NS 12 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 25500 },
          par: { label: 'Par', precio: 4200 },
          unidad: { label: 'Unidad', precio: 2100 },
          paquete: { label: 'Paquete', precio: 4700 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'HIDRAPLUS  75 ZINC     SURTIDO  400 ML SUERO',
        precios: {
          botella: { label: 'Botella', precio: 10600 },
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 102400 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NOXPIRIN PLUS CAPS ADLUTOS DIA NOCHE X  120 CAPS',
        imagen: 'img/productos/Sinutab Plus NS x12 tab.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 114000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CALADERM CLEAR PLUS 120 GR',
        precios: {
          frasco: { label: 'Frasco', precio: 19800 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'RESFRYGRIP PLUS X 100 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 12000 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 1400 },
        },
      },
      ruecam: {
        nombre: 'RUECAM',
        nombreProducto: 'DRENOLAX PLUSS SUSP X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 24900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'J&J',
    descripcion: 'Descongestiona las vías nasales y alivia el dolor sinusal. Sin somnolencia.',
    imagen: 'img/productos/Sinutab Plus NS x12 tab.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'J&J', tipo: 'Sinutab Plus NS x12 tab', precio: 10000, imagen: 'img/productos/Sinutab Plus NS x12 tab.jpg' },
    ],
  },
  {
    id: 31,
    nombre: 'Congestex',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'CONGESTEX 60 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          par: { label: 'Par', precio: 3000 },
          caja: { label: 'Caja', precio: 60000 },
          unidad: { label: 'Unidad', precio: 2000 },
          frasco: { label: 'Frasco', precio: 28500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Congestex',
    descripcion: 'Descongestionante nasal y de vías respiratorias de larga duración.',
    imagen: 'img/productos/Congestex x60 cápsulas.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'Congestex', tipo: 'Congestex x60 cápsulas', precio: 24000, imagen: 'img/productos/Congestex x60 cápsulas.jpg' },
    ],
  },
  {
    id: 32,
    nombre: 'Vick VapoRub',
    laboratorios: {
      procter_gamble_colom: {
        imagen: 'img/productos/Vick VapoRub 12g x12 unds.jpg',
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'VICK VAPORUB 12 GR 12 UDS',
        precios: {
          caja: { label: 'Caja', precio: 48000 },
          pote___lata: { label: 'Pote / Lata', precio: 4800 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DROPPSS LIMON VICK PASTILLAS  SOBRE X 4 LAB.',
        imagen: 'img/productos/Vick VapoRub 12g x12 unds.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 40000 },
          frasco: { label: 'Frasco', precio: 64000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'VICK BALSAMO BEBE 50 GRAMOS PYG COLOMBIA LTDA.',
        precios: {
          caja: { label: 'Caja', precio: 26800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'P&G',
    descripcion: 'Bálsamo de mentol para alivio de congestión nasal y tos. Clásico del frío.',
    imagen: 'img/productos/Vick VapoRub 12g x12 unds.jpg',
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad 12g', precio: 1100  },
      { tipo: 'Caja x12',   precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'P&G', tipo: 'Vick VapoRub 12g x12 unds', precio: 12000, imagen: 'img/productos/Vick VapoRub 12g x12 unds.jpg' },
    ],
  },
  {
    id: 33,
    nombre: 'Pastillas Vick Drops',
    laboratorios: {
      procter_gamble_colom: {
        imagen: 'img/productos/Vick Drops x125 pastillas.jpg',
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'PASTILLAS VICK DROPS MENTOL',
        precios: {
          caja: { label: 'Caja', precio: 48276 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PASTILLAS VICK DROPS X 125 PASTILLAS',
        imagen: 'img/productos/Vick Drops x125 pastillas.jpg',
        precios: {
          blister: { label: 'Blíster', precio: 2600 },
          frasco: { label: 'Frasco', precio: 64000 },
          unidad: { label: 'Unidad', precio: 600 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'P&G',
    descripcion: 'Caramelos medicinales de mentol para alivio de tos y dolor de garganta.',
    imagen: 'img/productos/Vick Drops x125 pastillas.jpg',
    tags: [],
    variantes: [
      { laboratorio: 'P&G', tipo: 'Vick Drops x125 pastillas', precio: 18000, imagen: 'img/productos/Vick Drops x125 pastillas.jpg' },
    ],
  },
  {
    id: 34,
    nombre: 'Antihistamínico Clorfeniramina',
    laboratorios: {
      ecar_ltda: {
        imagen: 'img/productos/Clorfeniramina Jarabe 120ml.jpg',
        nombre: 'ECAR LTDA',
        nombreProducto: 'CLORFENIRAMINA JARABE 120 ML EC',
        precios: {
          frasco: { label: 'Frasco', precio: 5900 },
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 4000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'CLORFENIRAMINA MALEATO 4 MG X 20 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 3500 },
        },
      },
      labinco_s_a: {
        nombre: 'LABINCO S.A.',
        nombreProducto: 'CLORFENIRAMINA 2/5 MG/ML  SOL JARABE 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5600 },
        },
      },
      lab_licol_ltda: {
        nombre: 'LAB. LICOL LTDA',
        nombreProducto: 'CLORFENIRAMINA 2/5 MG/ML  SOLUCION JARABE 120 MILI',
        precios: {
          frasco: { label: 'Frasco', precio: 5500 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'CLORFENIRAMINA MALEATO 2MG/5ML 120ML',
        precios: {
          caja: { label: 'Caja', precio: 5900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'EC',
    descripcion: 'Antihistamínico clásico para alergias y gripa. Jarabe pediátrico.',
    imagen: 'img/productos/Clorfeniramina Jarabe 120ml.jpg',
    tags: [T.oferta],
    variantes: [
      { laboratorio: 'EC', tipo: 'Clorfeniramina Jarabe 120ml', precio: 5900  , imagen: 'img/productos/Clorfeniramina Jarabe 120ml.jpg' },
    ],
  },
  {
    id: 35,
    nombre: 'Loratadina 10mg',
    laboratorios: {
      megalifesciences: {
        nombre: 'MEGALIFESCIENCES',
        nombreProducto: 'LOREZE LORATADINA 10MG X 10 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      laproff: {
        imagen: 'img/productos/Loratadina 10mg x400.jpg',
        nombre: 'LAPROFF',
        nombreProducto: 'LORATADINA 10 MG MILIGRAMO(S) TABLETA LABORATORIOS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 380000 },
          frasco: { label: 'Frasco', precio: 5000 },
        },
      },
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'BUSCAPINA NF COMPOSITUM 325/10MG 100 TBS',
        precios: {
          caja: { label: 'Caja', precio: 140000 },
          par: { label: 'Par', precio: 3700 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      gonher_farmaceutica_: {
        nombre: 'GONHER FARMACEUTICA LTDA',
        nombreProducto: 'BUPROFEN IBUPRO 10MG/5ML  SUSP  X120ML',
        precios: {
          frasco: { label: 'Frasco', precio: 22900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NEWTARPAM DESLORATADINA DE 5MG',
        imagen: 'img/productos/Loratadina 10mg x400.jpg',
        precios: {
          caja: { label: 'Caja', precio: 15800 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'METOCLOPRAMIDA 10MG/2ML SOL  INY X 1 AMP',
        precios: {
          caja: { label: 'Caja', precio: 4400 },
        },
      },
      ruecam: {
        nombre: 'RUECAM',
        nombreProducto: 'CRISTHALER DESLORATADINA JARB 2,5MG/5ML   X120ML',
        precios: {
          caja: { label: 'Caja', precio: 22800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Genfar / Tecnoquímicas',
    descripcion: 'Antihistamínico sin somnolencia para rinitis alérgica y urticaria.',
    imagen: 'img/productos/Loratadina 10mg x400.jpg',
    tags: [T.oferta, T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 300  },
      { tipo: 'Caja x10',  precio: 2500 },
      { tipo: 'Caja x100', precio: 18000 },
    ],
    variantes: [
      { laboratorio: 'LP',  tipo: 'Loratadina 10mg x400 ', precio: 22000,imagen: 'img/productos/Loratadina 10mg x400.jpg' },
      { laboratorio: 'MK',  tipo: 'MK 10mg x10 tab',          precio: 2800, imagen: 'img/productos/MK 10mg x10 tab.jpg' },
      { laboratorio: 'MK',  tipo: 'MK Jarabe 60ml',            precio: 8500, imagen: 'img/productos/MK Jarabe 60ml.jpg' },
    ],
  },

  /* ── Gastrointestinales ── */
  {
    id: 36,
    nombre: 'Omeprazol 20mg',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'PROZIDEX   OMEPRAZOL   20MG   CAJA X 30 UND',
        precios: {
          caja: { label: 'Caja', precio: 10200 },
          blister: { label: 'Blíster', precio: 11200 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'TRIMEBUTINA SIMETICON.200/120MG 30TBS PC',
        precios: {
          caja: { label: 'Caja', precio: 82000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 31500 },
          blister: { label: 'Blíster', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'ENALAPRIL 20MG X 20 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 4000 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'INVICTUS 20MG TABLETA RECUBIERTA',
        precios: {
          caja: { label: 'Caja', precio: 72000 },
          unidad: { label: 'Unidad', precio: 18000 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'OMEPRAZOL 40 MG POLVO LIOFILIZADO PARA SOLUCION IN',
        precios: {
          caja: { label: 'Caja', precio: 11500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ESOMEPRAZOL 40MG 10 TAB     MK PROMO',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
        },
      },
      mk: {
        nombre: 'MK',
        nombreProducto: 'FLUOXETINA 20MG  MK',
        precios: {
          caja: { label: 'Caja', precio: 12900 },
        },
      },
      farmacol_chinoin_sas: {
        nombre: 'FARMACOL CHINOIN SAS',
        nombreProducto: 'OMEPRAZOL 20 MG MILIGRAMO(S) CAPSULA FARMACOL CHIN',
        precios: {
          blister: { label: 'Blíster', precio: 3400 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Genfar / Lafrancol',
    descripcion: 'Inhibidor de bomba de protones para gastritis y reflujo gastroesofágico.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 400   },
      { tipo: 'Caja x10', precio: 3800  },
      { tipo: 'Caja x30', precio: 11000 },
    ],
    variantes: [
      { laboratorio: 'Farmacol', tipo: 'Omeprazol 20mg x300 cáps (Farmacol Chino)', precio: 32000 },
      { laboratorio: 'MK',       tipo: 'MK 20mg x30 cáps',                          precio: 11000 },
      { laboratorio: 'MK',       tipo: 'MK 20mg x10 cáps',                          precio: 4200  },
    ],
  },
  {
    id: 37,
    nombre: 'Diexsoprazol (Esomeprazol 40mg)',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ESOMEPRAZOL 40MG 10 TAB     MK PROMO',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'DIEXSOPRAZOL ESOMEPRAZOL 20 MG X 10 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 10000 },
          caja: { label: 'Caja', precio: 19800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Diexsoprazol',
    descripcion: 'Esomeprazol 40mg de mayor potencia para reflujo y esofagitis erosiva.',
    imagen: imgMed(),
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Unidad',   precio: 1000  },
      { tipo: 'Caja x30', precio: 28000 },
    ],
    variantes: [
      { laboratorio: 'Diexsoprazol', tipo: 'Esomeprazol 40mg x30 cáps', precio: 28000 },
    ],
  },
  {
    id: 38,
    nombre: 'Loperamida 2mg',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'LOPERAMIDA CLORHIDRATO  2 MG  X 240 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2900 },
          caja: { label: 'Caja', precio: 116000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LOPERAMIDA 2 MG X 6 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Antidiarreico de acción rápida. Detiene la diarrea en horas.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 250  },
      { tipo: 'Blíster x4', precio: 900 },
      { tipo: 'Caja x12',  precio: 2500 },
    ],
    variantes: [
      { laboratorio: 'LP',  tipo: 'Loperamida 2mg x240 tab', precio: 38000 },
      { laboratorio: 'MK',  tipo: 'MK 2mg x12 tab',          precio: 5500  },
    ],
  },
  {
    id: 39,
    nombre: 'Metoclopramida 10mg',
    laboratorios: {
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'METOCLOPRAMIDA 10MG/2ML SOL  INY X 1 AMP',
        precios: {
          caja: { label: 'Caja', precio: 4400 },
          ampolla: { label: 'Ampolla', precio: 4600 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'METOCLOPRAMIDA 10 MG 400 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'BUSCAPINA NF COMPOSITUM 325/10MG 100 TBS',
        precios: {
          caja: { label: 'Caja', precio: 140000 },
          par: { label: 'Par', precio: 3700 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'METOCLOPRAMIDA SUSPENSION ORAL 4 MG / ML',
        precios: {
          frasco: { label: 'Frasco', precio: 6800 },
        },
      },
      gonher_farmaceutica_: {
        nombre: 'GONHER FARMACEUTICA LTDA',
        nombreProducto: 'BUPROFEN IBUPRO 10MG/5ML  SUSP  X120ML',
        precios: {
          frasco: { label: 'Frasco', precio: 22900 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'KETOPROFENO  10MG / 2ML SOL INY X6 AMP',
        precios: {
          ampolla: { label: 'Ampolla', precio: 5900 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'HEMETIL 30ML   METOCLOPRAMIDA 4MG',
        precios: {
          caja: { label: 'Caja', precio: 16900 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'FLUNARIZINA 10MG  X20TAB',
        precios: {
          caja: { label: 'Caja', precio: 5300 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER BENZOCAINA 10MG  CEREZA',
        precios: {
          blister: { label: 'Blíster', precio: 10500 },
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Antiemético para náuseas, vómito y reflujo. Procinético digestivo.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'LP', tipo: 'Metoclopramida 10mg x400 tab', precio: 38000 },
    ],
  },
  {
    id: 40,
    nombre: 'Smecta 3g',
    laboratorios: {
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SMECTA 3 GR 10 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 7800 },
          caja: { label: 'Caja', precio: 75000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Ipsen',
    descripcion: 'Absorbente intestinal para diarrea aguda y crónica en adultos y niños.',
    imagen: imgMed(),
    tags: [],
    presentaciones: [
      { tipo: 'Sobre individual', precio: 1500  },
      { tipo: 'Caja x10 sobres', precio: 14000 },
    ],
    variantes: [
      { laboratorio: 'Ipsen', tipo: 'Smecta 3g x10 sobres', precio: 14000 },
    ],
  },
  {
    id: 41,
    nombre: 'Gaviscon Doble Acción',
    laboratorios: {
      rb_health_colombia: {
        nombre: 'RB HEALTH COLOMBIA',
        nombreProducto: 'GAVISCON DOBLE ACCION SUSP.10 ML X 12UDS',
        precios: {
          caja: { label: 'Caja', precio: 36000 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'CEP.PRO 1000 ADULTOS DOBLE ACCION 2X1',
        precios: {
          paquete: { label: 'Paquete', precio: 15900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Reckitt',
    descripcion: 'Antiácido + alginato. Barrera física contra el reflujo. Rápido y duradero.',
    imagen: imgMed(),
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Sobre 10ml',      precio: 1800  },
      { tipo: 'Caja x12 sobres', precio: 18000 },
    ],
    variantes: [
      { laboratorio: 'Reckitt', tipo: 'Gaviscon Doble Acción Susp. 10ml x12 unds', precio: 18000 },
    ],
  },
  {
    id: 42,
    nombre: 'Sal de Frutas',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'SAL DE FRUTAS 50 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 3200 },
          caja: { label: 'Caja', precio: 85000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      levapan_s_a: {
        nombre: 'LEVAPAN S.A.',
        nombreProducto: 'COMPOTA SAN JORGE FRUTAS MIXTAS 113G',
        precios: {
          frasco: { label: 'Frasco', precio: 2400 },
        },
      },
      corchito: {
        nombre: 'CORCHITO',
        nombreProducto: 'LLAMA DIENTES FRUTAS AROMATIZADAS CORCHITO',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
      tecnofarma_s_a: {
        nombre: 'TECNOFARMA S.A',
        nombreProducto: 'SAL DE FRUTAS LUA PLUS SABOR CITRUS 22 SOBRES X 6',
        precios: {
          caja: { label: 'Caja', precio: 69619 },
          unidad: { label: 'Unidad', precio: 3400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'GSK / LUA',
    descripcion: 'Antiácido efervescente para acidez y dispepsia. Alivio inmediato.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Sobre individual', precio: 600  },
      { tipo: 'Caja x22 sobres', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'LUA', tipo: 'Sal de Frutas LUA Plus Citrus x22 sbs x6', precio: 12000 },
      { laboratorio: 'LP',  tipo: 'Sal de Frutas x50 sobres',                  precio: 8000  },
    ],
  },
  {
    id: 43,
    nombre: 'Bisacodilo 5mg',
    laboratorios: {
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'BISACODILO 5 MG 100 TABLETAS RC',
        precios: {
          blister: { label: 'Blíster', precio: 4900 },
          caja: { label: 'Caja', precio: 20400 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'FARMALAX BISACODILO 5 MG 100 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 20000 },
        },
      },
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'DULCOLAX BISACODILO 5 MG MILIGRAMO(S) GRAGEA SANOF',
        precios: {
          caja: { label: 'Caja', precio: 17800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'RC',
    descripcion: 'Laxante de contacto para estreñimiento ocasional. Acción nocturna.',
    imagen: imgMed(),
    tags: [],
    presentaciones: [
      { tipo: 'Unidad',    precio: 150   },
      { tipo: 'Caja x100', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'RC', tipo: 'Bisacodilo 5mg x100 tab', precio: 12000 },
    ],
  },
  {
    id: 44,
    nombre: 'Ciruelax Minitabs',
    laboratorios: {
      scandinavia_pharma_l: {
        nombre: 'SCANDINAVIA PHARMA  LTDA',
        nombreProducto: 'CIRUELAX MINITABS 60 COMPRIMIDOS',
        precios: {
          blister: { label: 'Blíster', precio: 1800 },
          caja: { label: 'Caja', precio: 45000 },
          frasco: { label: 'Frasco', precio: 37500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CIRUELAX EXTRACTO HOJAS CASSIA X 20 COMP',
        precios: {
          caja: { label: 'Caja', precio: 23000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Ciruelax',
    descripcion: 'Laxante natural a base de ciruela. Minicomprimidos fáciles de tomar.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Ciruelax', tipo: 'Ciruelax Minitabs x60 comprimidos', precio: 18000 },
    ],
  },
  {
    id: 45,
    nombre: 'Lass Adultos',
    laboratorios: {
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'LASS ADULTOS 50 SUPOSITORIOS',
        precios: {
          frasco: { label: 'Frasco', precio: 50000 },
          unidad: { label: 'Unidad', precio: 1900 },
        },
      },
      prebel: {
        nombre: 'PREBEL',
        nombreProducto: 'DTE ELIZABETH ARDEN CLASS.MINI ROL.30ML',
        precios: {
          unidad: { label: 'Unidad', precio: 3100 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'BLOQ.SUNDARK ADULTOS SPF 60 120 ML',
        precios: {
          caja: { label: 'Caja', precio: 54000 },
          blister: { label: 'Blíster', precio: 3200 },
        },
      },
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'BISOLVON ADULTOS 120 ML',
        precios: {
          caja: { label: 'Caja', precio: 33500 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'CEP.PRO 1000 ADULTOS DOBLE ACCION 2X1',
        precios: {
          paquete: { label: 'Paquete', precio: 15900 },
        },
      },
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'APOSITOS OCULARES  ADULTOS  X20UNDS',
        precios: {
          caja: { label: 'Caja', precio: 17500 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      s_c_johnson_colombia: {
        nombre: 'S.C. JOHNSON COLOMBIANA',
        nombreProducto: 'REPELENTE STAY OFF SPRAY ADULTOS  120ML',
        precios: {
          unidad: { label: 'Unidad', precio: 21800 },
        },
      },
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'HANSAPLAST ESPARADRAPO CLASSIC 5MX2.5CM',
        precios: {
          caja: { label: 'Caja', precio: 14700 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'DTE REXONA ANTITRANS CLASSIC MUJER CREMA 35G',
        precios: {
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lass',
    descripcion: 'Supositorios de glicerina para estreñimiento. Acción local y rápida.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Lass', tipo: 'Lass Adultos x50 supositorios', precio: 22000 },
    ],
  },
  {
    id: 46,
    nombre: 'Lomotil 2.5mg',
    laboratorios: {
      grunenthal_colombian: {
        nombre: 'GRUNENTHAL COLOMBIANA S.A',
        nombreProducto: 'LOMOTIL 2.5 MG 12 CAJAS X 4 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Pfizer',
    descripcion: 'Antidiarreico de prescripción para diarrea aguda severa.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Pfizer', tipo: 'Lomotil 2.5mg 12 cajas x4 tab', precio: 48000 },
    ],
  },
  {
    id: 47,
    nombre: 'Gastrum Plus Menta',
    laboratorios: {
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'GASTRUM PLUS MENTA 10 SACHETS 10 ML',
        precios: {
          caja: { label: 'Caja', precio: 20000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'SEDA DENTAL REACH CERA EXPANSION PLUS MENTA',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Gastrum',
    descripcion: 'Antiácido con menta para alivio de acidez y malestar estomacal.',
    imagen: imgMed(),
    tags: [],
    presentaciones: [
      { tipo: 'Sobre 10ml',      precio: 1500  },
      { tipo: 'Caja x10 sobres', precio: 14000 },
    ],
    variantes: [
      { laboratorio: 'Gastrum', tipo: 'Gastrum Plus Menta x10 sachets 10ml', precio: 14000 },
    ],
  },
  {
    id: 48,
    nombre: 'Fluimucil 200mg',
    laboratorios: {
      zambon: {
        nombre: 'ZAMBON',
        nombreProducto: 'FLUIMUCIL 200 MG 30 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 39000 },
          frasco: { label: 'Frasco', precio: 37800 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'LOMECAN CLOTRIMAZOL 200MG 3 OVU.VAG.',
        precios: {
          caja: { label: 'Caja', precio: 62000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ISODINE OVULOS 200MG YODOVPOVI  X24 OVUL',
        precios: {
          caja: { label: 'Caja', precio: 72000 },
          unidad: { label: 'Unidad', precio: 3100 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'PLUROPON  AIC OROTICO 200MG OXIPURINA 50MG   X10 C',
        precios: {
          caja: { label: 'Caja', precio: 28900 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'METOCARBAMOL/IBUFROFENO  500MG/200MG   X10TAB MK T',
        precios: {
          caja: { label: 'Caja', precio: 20000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Zambon',
    descripcion: 'Acetilcisteína mucolítica para flemas espesas en gripa y bronquitis.',
    imagen: imgMed(),
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Sobre individual', precio: 1000  },
      { tipo: 'Caja x30 sobres', precio: 28000 },
    ],
    variantes: [
      { laboratorio: 'Zambon',   tipo: 'Fluimucil 200mg x30 sobres',             precio: 28000 },
      { laboratorio: 'Zifluvis', tipo: 'Zifluvis 600mg Acetilcisteína x30 sbs',  precio: 32000 },
    ],
  },
  {
    id: 49,
    nombre: 'Bonfiest Plus',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'BONFIEST PLUS  X 32 UNDS',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 102400 },
          botella: { label: 'Botella', precio: 10600 },
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NOXPIRIN PLUS CAPS ADLUTOS DIA NOCHE X  120 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 114000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CALADERM CLEAR PLUS 120 GR',
        precios: {
          frasco: { label: 'Frasco', precio: 19800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'STAYFREE ADAPT PLUS X 12 TOALL',
        precios: {
          paquete: { label: 'Paquete', precio: 4700 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'RESFRYGRIP PLUS X 100 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 12000 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 1400 },
        },
      },
      ruecam: {
        nombre: 'RUECAM',
        nombreProducto: 'DRENOLAX PLUSS SUSP X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 24900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Bonfiest',
    descripcion: 'Antiflatulento y digestivo para gases, hinchazón y pesadez.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Bonfiest', tipo: 'Bonfiest Plus x32 unds', precio: 14000 },
    ],
  },
  {
    id: 50,
    nombre: 'Dimenhidrinato 50mg (Mareol)',
    laboratorios: {
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'MAREOL DIMENHIDRINATO 50 MG X 72 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 9000 },
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Pasedol / Mareol',
    descripcion: 'Antimareo y antiemético para viajes. Previene náuseas y vértigo.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 300   },
      { tipo: 'Caja x72',  precio: 18000 },
    ],
    variantes: [
      { laboratorio: 'Mareol',  tipo: 'Mareol Dimenhidrinato 50mg x72 tab',  precio: 18000 },
      { laboratorio: 'Pasedol', tipo: 'Pasedol Dimenhidrinato 50mg x100 tab', precio: 22000 },
    ],
  },

  /* ── Antibióticos ── */
  {
    id: 51,
    nombre: 'Amoxicilina 500mg',
    laboratorios: {
      bcn_medical_s_a: {
        nombre: 'BCN MEDICAl S.A',
        nombreProducto: 'SOLOMOXY AMOXICILINA 500MG  X60CAP',
        precios: {
          blister: { label: 'Blíster', precio: 10000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'AMOXICILINA 500 MG 50 CAPSULAS LS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 15000 },
          frasco: { label: 'Frasco', precio: 9500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'AMOXICILINA 500 MG 60 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 5500 },
          caja: { label: 'Caja', precio: 25000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'AMOXICILINA 500 MG 50 CAPSULAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'EUMOXINA AMOXICILINA  250MG / 5 ML SUSP X 100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 23900 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AMOXICILINA 500 MG X 100 CAPS COASPHARMA',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lafrancol / Genfar / Coaspharma',
    descripcion: 'Antibiótico betalactámico de amplio espectro. Requiere receta médica.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    /* Nota: los antibióticos NO se venden por unidad en Colombia
     * por regulación INVIMA — se omite el campo presentaciones */
    variantes: [
      { laboratorio: 'Coaspharma', tipo: 'Coaspharma 500mg x100 cáps', precio: 28000 },
      { laboratorio: 'Tripsopen',  tipo: 'Tripsopen 500mg x100 cáps',  precio: 30000 },
      { laboratorio: 'Eumoxina',   tipo: 'Eumoxina 250mg/5ml Susp 100ml', precio: 12000 },
      { laboratorio: 'LP',         tipo: 'Amoxicilina 500mg x50 cáps', precio: 14000 },
      { laboratorio: 'Solomoxy',   tipo: 'Solomoxy 500mg x60 cáps',    precio: 16000 },
    ],
  },
  {
    id: 52,
    nombre: 'Metronidazol 500mg',
    laboratorios: {
      ruecam: {
        nombre: 'RUECAM',
        nombreProducto: 'TROPXIM - F METRONIDAZOL 500MG + CLOTRIMAZOL 100MG',
        precios: {
          blister: { label: 'Blíster', precio: 22000 },
          caja: { label: 'Caja', precio: 42000 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'METRONIDAZOL 500 MG 200 OVULOS PC',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 90000 },
          unidad: { label: 'Unidad', precio: 7000 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'MEBICITROF METRONIDAZOL SUSP 250 MG X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 22900 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'ACETAMICOFEN 500MG 300 TABLETAS  COASPHARMA',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 30000 },
          frasco: { label: 'Frasco', precio: 7600 },
        },
      },
      capsuland_colombia_s: {
        nombre: 'Capsuland Colombia SAS',
        nombreProducto: 'COLAGENO SUPL DIET 500MG X 30 CAPS',
        precios: {
          frasco: { label: 'Frasco', precio: 19900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'COLAGENO HIDROLIZADO 500MG X30 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 32000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP / Ecar',
    descripcion: 'Antibiótico para infecciones parasitarias y anaerobias. Requiere receta.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Ecar', tipo: 'Metronidazol 500mg x100 tab',    precio: 14000 },
      { laboratorio: 'LP',   tipo: 'Metronidazol 500mg x200 óvulos', precio: 28000 },
    ],
  },
  {
    id: 53,
    nombre: 'Ciprofloxacina 500mg',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BIOQUIFLOX CIPROFLOXACINA 500MG X6TAB',
        precios: {
          caja: { label: 'Caja', precio: 15900 },
          blister: { label: 'Blíster', precio: 18000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'ACETAMICOFEN 500MG 300 TABLETAS  COASPHARMA',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      b_c_n_medical_s_a: {
        nombre: 'B C N MEDICAL S.A',
        nombreProducto: 'PROCATEC 500 MG CIPROFLOXACINA 10 TBS',
        precios: {
          caja: { label: 'Caja', precio: 13800 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'CIPROFLOXACINA 500 MG 10 TABLETAS AG',
        precios: {
          caja: { label: 'Caja', precio: 4900 },
        },
      },
      capsuland_colombia_s: {
        nombre: 'Capsuland Colombia SAS',
        nombreProducto: 'COLAGENO SUPL DIET 500MG X 30 CAPS',
        precios: {
          frasco: { label: 'Frasco', precio: 19900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Plurigram / MK',
    descripcion: 'Antibiótico fluoroquinolona de amplio espectro. Requiere receta médica.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Plurigram', tipo: 'Plurigram Ciprofloxacina 500mg x10 tab', precio: 14000 },
      { laboratorio: 'MK',        tipo: 'MK Ciprofloxacina 500mg x10 tab',        precio: 13000 },
    ],
  },
  {
    id: 54,
    nombre: 'Cefalexina 500mg',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 10 CAPSULAS MK PROMO',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'CEPRAX CEFALEXINA 500 MG X 50 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 12000 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 100 CAPSULAS RC',
        precios: {
          blister: { label: 'Blíster', precio: 5900 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'CEFALEXINA 250 MG / 5 ML  POLVO PARA SUSP  X 60 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'ACETAMICOFEN 500MG 300 TABLETAS  COASPHARMA',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 10 CAPSULAS GF',
        precios: {
          caja: { label: 'Caja', precio: 6900 },
        },
      },
      capsuland_colombia_s: {
        nombre: 'Capsuland Colombia SAS',
        nombreProducto: 'COLAGENO SUPL DIET 500MG X 30 CAPS',
        precios: {
          frasco: { label: 'Frasco', precio: 19900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'COLAGENO HIDROLIZADO 500MG X30 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 32000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Recipe / Ceprax',
    descripcion: 'Antibiótico cefalosporina para infecciones de piel y tejidos blandos.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Recipe', tipo: 'Cefalexina 500mg x250 cáps',    precio: 58000 },
      { laboratorio: 'Ceprax', tipo: 'Ceprax Cefalexina 500mg x50 cáps', precio: 14000 },
    ],
  },
  {
    id: 55,
    nombre: 'Azitromicina 500mg',
    laboratorios: {
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'MILAGRAM AZITROMICINA 500MG X 6TAB       PROMO',
        precios: {
          caja: { label: 'Caja', precio: 29800 },
        },
      },
      lab_delta_s_a: {
        nombre: 'LAB DELTA S.A.',
        nombreProducto: 'DELTAZITROM AZITROMICINA 500MG',
        precios: {
          caja: { label: 'Caja', precio: 17800 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AZITROMICINA 500 MG X 3 TAB COASPHARMA',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
          frasco: { label: 'Frasco', precio: 13800 },
          blister: { label: 'Blíster', precio: 1500 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'AZITROMICINA 500 MG 3 TABLETAS MP',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'AZITROMICINA 500 MG 3 TABLETAS AG',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'AZITROMICINA 500 MG     MK    PROMO',
        precios: {
          caja: { label: 'Caja', precio: 10500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Azitrobac',
    descripcion: 'Macrólido de amplio espectro. Una toma diaria por 3–5 días.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [T.nuevo],
    variantes: [
      { laboratorio: 'Azitrobac', tipo: 'Azitrobac 500mg PROMO', precio: 12000 },
    ],
  },
  {
    id: 56,
    nombre: 'Lincomicina',
    laboratorios: {
      profar_laborables_s_: {
        nombre: 'PROFAR LABORABLES S.A.',
        nombreProducto: 'LINCOFAR  LINCOMICINA 600MG/2ML  X10 AMP',
        precios: {
          caja: { label: 'Caja', precio: 147656 },
          unidad: { label: 'Unidad', precio: 15000 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'LINCOMICINA          AMPOLLA     CAJA   X  100   U',
        precios: {
          caja: { label: 'Caja', precio: 400000 },
          unidad: { label: 'Unidad', precio: 4900 },
        },
      },
      lab_delta_s_a: {
        nombre: 'LAB DELTA S.A.',
        nombreProducto: 'LINCODELT LINCOMICINA INY 600 MG CJ X 10 AMP',
        precios: {
          ampolla: { label: 'Ampolla', precio: 14000 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lafrancol',
    descripcion: 'Antibiótico lincosamida en ampolla para infecciones graves. Uso hospitalario.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Lafrancol', tipo: 'Lincomicina ampolla x100 unds', precio: 58000 },
    ],
  },
  {
    id: 57,
    nombre: 'Clindamicina 600mg/4ml',
    laboratorios: {
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'CLINDAMICINA 600 MG/4 ML 10 AMPOLLAS',
        precios: {
          ampolla: { label: 'Ampolla', precio: 8100 },
          caja: { label: 'Caja', precio: 65000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'CLINDAMICINA SOLUCION 1% 30 ML W',
        precios: {
          caja: { label: 'Caja', precio: 42500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'CLINDAMICINA CREMA VAGINAL 40 GR MK',
        precios: {
          caja: { label: 'Caja', precio: 42000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GINKGO BILOBA 600MG X30 CAPS LIVING NATURAL',
        precios: {
          caja: { label: 'Caja', precio: 32000 },
        },
      },
      profar_laborables_s_: {
        nombre: 'PROFAR LABORABLES S.A.',
        nombreProducto: 'LINCOFAR  LINCOMICINA 600MG/2ML  X10 AMP',
        precios: {
          caja: { label: 'Caja', precio: 147656 },
          unidad: { label: 'Unidad', precio: 15000 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'CLINBAC  CLINDAMICINA SOL INY  4ML  X 2  AMP',
        precios: {
          caja: { label: 'Caja', precio: 42000 },
          unidad: { label: 'Unidad', precio: 21000 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'CALFAFEM D CARBONATO DE  CALCIO 600MG+VIT D3 250',
        precios: {
          caja: { label: 'Caja', precio: 27000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'ZIFLUVIS GRANULADO SOL ORAL 600MG CAJA * 10 SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 1300 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
      colompack_s_a: {
        nombre: 'COLOMPACK S A',
        nombreProducto: 'STOMAVID NH METRONI 600MG + NIFUROXAZIDA 200MG  18',
        precios: {
          blister: { label: 'Blíster', precio: 15900 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lafrancol',
    descripcion: 'Antibiótico lincosamida en ampolla para infecciones anaerobias severas.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Lafrancol', tipo: 'Clindamicina 600mg/4ml x10 ampollas', precio: 32000 },
    ],
  },
  {
    id: 58,
    nombre: 'Ampicilina',
    laboratorios: {
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'AMPICILINA 250 MG SUSPENSION 60 ML LS',
        precios: {
          frasco: { label: 'Frasco', precio: 13200 },
          blister: { label: 'Blíster', precio: 6800 },
          caja: { label: 'Caja', precio: 55000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'AMPICILINA 500 MG 100 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 43000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'AMPICILINA   1G  X   100 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 10000 },
          caja: { label: 'Caja', precio: 100000 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'AMPICILINA 1G POLV EST SOL INY 1 VIAL VITALIS',
        precios: {
          caja: { label: 'Caja', precio: 5000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'AMPICILINA 500 MG X100CAPS  GENFAR S.A.',
        precios: {
          blister: { label: 'Blíster', precio: 8100 },
          caja: { label: 'Caja', precio: 60000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AMPICILINA 500MG CAJA X50CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 17500 },
        },
      },
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'AMPICILINA 500 MG CAJA X 100CAP',
        precios: {
          blister: { label: 'Blíster', precio: 5500 },
          caja: { label: 'Caja', precio: 52000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Tecnoquímicas',
    descripcion: 'Antibiótico penicilínico para infecciones respiratorias y urinarias.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Tecnoquímicas', tipo: 'Ampicilina 500mg x50 cáps', precio: 14000 },
      { laboratorio: 'Tecnoquímicas', tipo: 'Ampicilina 1g tab',          precio: 18000 },
    ],
  },
  {
    id: 59,
    nombre: 'Doxiciclina 100mg',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'VIBRADOX ( DOXICICLINA 100MG) CAJA X 14 CAPS  PROM',
        precios: {
          caja: { label: 'Caja', precio: 24800 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'TRAMADOL 10 %GOTAS ORALES 100MG /10ML EXPOFARMA',
        precios: {
          frasco: { label: 'Frasco', precio: 8900 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'NITOXIPAR NITAZOXANIDA 100MG/5ML  SUSP X 30 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29800 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'DOXICICLINA  100 MG X 10 CAPS COASPHARMA',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
        },
      },
      ophalac: {
        nombre: 'OPHALAC',
        nombreProducto: 'ACIDO ACETILSALICILICO 100MG',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'TIAMINA 100MG/ML  X10 ML SOL INY  CJX12UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 6700 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'DOXICICLINA 100 MG 10 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 9800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MICOTRAZOL  ITRACONAZOL  100MG   X4 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 22500 },
          blister: { label: 'Blíster', precio: 2500 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'HIERRO SACAROSA 100MG/5ML  SOL INY',
        precios: {
          caja: { label: 'Caja', precio: 33000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK',
    descripcion: 'Tetraciclina de amplio espectro para infecciones atípicas y acné severo.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'MK', tipo: 'Doxiciclina 100mg x10 tab', precio: 10000 },
    ],
  },
  {
    id: 60,
    nombre: 'Metroxazide',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'METROXAZIDE COMP X 18 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 12500 },
          caja: { label: 'Caja', precio: 36900 },
          unidad: { label: 'Unidad', precio: 2500 },
          frasco: { label: 'Frasco', precio: 32800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Metroxazide',
    descripcion: 'Metronidazol + Trimetoprim. Combinado antibiótico-antiprotozoario.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Metroxazide', tipo: 'Metroxazide x18 tabletas', precio: 12000 },
    ],
  },

  /* ── Diclofenaco ── */
  {
    id: 61,
    nombre: 'Diclofenaco 50mg',
    laboratorios: {
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'DICLOFENACO 1% GEL 50 GR VT',
        precios: {
          tubo: { label: 'Tubo', precio: 8100 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'DICLOFENACO 50 MILIGRAMOS 250 GRAGEAS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 4800 },
          caja: { label: 'Caja', precio: 18500 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'EUMOXINA AMOXICILINA  250MG / 5 ML SUSP X 100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 23900 },
          caja: { label: 'Caja', precio: 28900 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'DICLOFENACO 1% GEL 50 GR MP',
        precios: {
          tubo: { label: 'Tubo', precio: 12500 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'FENACOF DICLOFENACO SOD 0,1% 5ML GOTAS',
        precios: {
          frasco: { label: 'Frasco', precio: 24800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PERCLUSONE NAPROXENO 250MG  X 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 11900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP / Genfar',
    descripcion: 'AINE antiinflamatorio potente para artritis, esguinces y dolor postoperatorio.',
    imagen: imgMed(),
    tags: [T.oferta, T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 150   },
      { tipo: 'Blíster x10', precio: 1300 },
      { tipo: 'Caja x100', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'LP',     tipo: 'Diclofenaco 50mg x400 tab', precio: 38000 },
      { laboratorio: 'Genfar', tipo: 'Genfar 50mg x10 tab',       precio: 4000  },
    ],
  },
  {
    id: 62,
    nombre: 'Diclofenaco 75mg Ampolla',
    laboratorios: {
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'DICLOFENACO        AMPOLLA        75MG/3ML      CA',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4000 },
          caja: { label: 'Caja', precio: 120000 },
        },
      },
      bio_esteril_sas: {
        nombre: 'BIO ESTERIL SAS',
        nombreProducto: 'NORIFLAM DICLOFENACO 75MG/3ML SOL INY X 6 AMP',
        precios: {
          ampolla: { label: 'Ampolla', precio: 14900 },
          caja: { label: 'Caja', precio: 70000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'DICLOFENACO SODICO 75MG / 3ML   SOL INY X 10 AMP',
        precios: {
          caja: { label: 'Caja', precio: 28900 },
          unidad: { label: 'Unidad', precio: 5000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Noriflam / Lafrancol',
    descripcion: 'Diclofenaco inyectable para dolor agudo severo. Acción rápida intramuscular.',
    imagen: imgMed(),
    tags: [],
    presentaciones: [
      { tipo: 'Ampolla individual', precio: 800   },
      { tipo: 'Caja x6 ampollas',   precio: 4500  },
    ],
    variantes: [
      { laboratorio: 'Lafrancol', tipo: 'Diclofenaco 75mg/3ml x100 amp', precio: 68000 },
      { laboratorio: 'Noriflam',  tipo: 'Noriflam 75mg/3ml x6 amp',      precio: 14000 },
    ],
  },
  {
    id: 63,
    nombre: 'Diclofenaco Retard 100mg',
    laboratorios: {
      novartis_de_colombia: {
        nombre: 'NOVARTIS DE COLOMBIA S.A.',
        nombreProducto: 'VOLTAREN RETARD DICLOFENACO  100MG 10 UND',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 58500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 4800 },
          caja: { label: 'Caja', precio: 18500 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'DIFLENAC DICLOFENACO RETARD 100 MG CAPSULAS CAJA P',
        precios: {
          blister: { label: 'Blíster', precio: 9900 },
          caja: { label: 'Caja', precio: 20000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / AG',
    descripcion: 'Diclofenaco de liberación prolongada. Una cápsula diaria para dolor crónico.',
    imagen: imgMed(),
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Unidad',   precio: 700   },
      { tipo: 'Caja x20', precio: 13000 },
    ],
    variantes: [
      { laboratorio: 'AG', tipo: 'AG Retard 100mg x20 cáps',  precio: 12000 },
      { laboratorio: 'MK', tipo: 'MK Retard 100mg x20 cáps',  precio: 13000 },
    ],
  },
  {
    id: 64,
    nombre: 'Dormex (Diclofenaco 100mg)',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'DORMEX DICLOFENACO 100 MG MILIGRAMO(S) CAPSULA NOV',
        precios: {
          blister: { label: 'Blíster', precio: 11000 },
          caja: { label: 'Caja', precio: 22000 },
        },
      },
      novartis_de_colombia: {
        nombre: 'NOVARTIS DE COLOMBIA S.A.',
        nombreProducto: 'VOLTAREN RETARD DICLOFENACO  100MG 10 UND',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 58500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Novartis',
    descripcion: 'Diclofenaco retard 100mg para dolor crónico. Una dosis nocturna.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Novartis', tipo: 'Dormex 100mg cápsulas', precio: 14000 },
    ],
  },
  {
    id: 65,
    nombre: 'Impomel (Meloxicam 15mg)',
    laboratorios: {
      impofar_ltda: {
        nombre: 'IMPOFAR LTDA',
        nombreProducto: 'IMPOMEL (MELOXICAM 15 MG)',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 12800 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'MELOXICAM 15MG/1,5ML  SOL INY X10 AMP',
        precios: {
          ampolla: { label: 'Ampolla', precio: 5400 },
          caja: { label: 'Caja', precio: 54000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Impomel',
    descripcion: 'AINE selectivo COX-2 para artritis. Menor daño gástrico.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Impomel', tipo: 'Meloxicam 15mg tabletas', precio: 9000 },
    ],
  },

  /* ── Cardiovascular / Hipertensión ── */
  {
    id: 66,
    nombre: 'Enalapril 20mg',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'ENALAPRIL 20MG X 20 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 4000 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'TRIMEBUTINA SIMETICON.200/120MG 30TBS PC',
        precios: {
          caja: { label: 'Caja', precio: 82000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 31500 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'INVICTUS 20MG TABLETA RECUBIERTA',
        precios: {
          caja: { label: 'Caja', precio: 72000 },
          unidad: { label: 'Unidad', precio: 18000 },
        },
      },
      mk: {
        nombre: 'MK',
        nombreProducto: 'FLUOXETINA 20MG  MK',
        precios: {
          caja: { label: 'Caja', precio: 12900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TRIMEBUTINA 200MG / SIMETICONA 120MG X10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 22000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'GRAZILAN ORKISTAT 120MG',
        precios: {
          blister: { label: 'Blíster', precio: 58900 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'CELESTIN TADALAFILO 20MG X 1 TAB',
        precios: {
          caja: { label: 'Caja', precio: 23000 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'N-BUTIL BROMURO DE HIOSCINA 20MG/1ML SOL  INY',
        precios: {
          caja: { label: 'Caja', precio: 4800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP / Genfar',
    descripcion: 'Antihipertensivo inhibidor de la ECA. Control de presión arterial.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 150   },
      { tipo: 'Caja x30',  precio: 4000  },
      { tipo: 'Caja x100', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'LP',     tipo: 'Enalapril 20mg x330 tab', precio: 42000 },
      { laboratorio: 'Genfar', tipo: 'Genfar 20mg x20 tab',     precio: 8000  },
      { laboratorio: 'MK',     tipo: 'MK Enalapril 20mg x20',   precio: 7500  },
    ],
  },
  {
    id: 67,
    nombre: 'Losartán',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'LOSARTAN 50 MG+HCT 12.5 MG 15 TBS EC',
        precios: {
          caja: { label: 'Caja', precio: 26000 },
          blister: { label: 'Blíster', precio: 19800 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'LOSARTAN 50 MG 30 TABLETAS EX',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'LOSARTAN 50 MG 30 TABLETAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 5800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LOSARTAN POTASICO 5O MG 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          unidad: { label: 'Unidad', precio: 1700 },
          caja: { label: 'Caja', precio: 9000 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'LOSARTAN 50MG X 300',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'LOSARTAN 50 MG MILIGRAMO(S) TABLETA RECUBIERTA GEN',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'LOSARTAN POTASICO   100G     X  300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4800 },
          caja: { label: 'Caja', precio: 90000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Antihipertensivo ARA II. Control de presión con una sola dosis diaria.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 200   },
      { tipo: 'Caja x30',  precio: 5500  },
    ],
    variantes: [
      { laboratorio: 'LP', tipo: 'Losartán 50mg x300 tab',  precio: 52000 },
      { laboratorio: 'LP', tipo: 'Losartán 100mg x300 tab', precio: 62000 },
    ],
  },
  {
    id: 68,
    nombre: 'Amlodipino 5mg',
    laboratorios: {
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'AMLODIPINO 5 MG 10 TABLETAS MP',
        precios: {
          caja: { label: 'Caja', precio: 2200 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AMLODIPINO 10 MG X 10 TAB COASPHARMA',
        precios: {
          caja: { label: 'Caja', precio: 3200 },
          blister: { label: 'Blíster', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'AMLODIPINO 5 MG 10 TABLETAS MK',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'AMLODIPINO 5 MG 10 TABLETAS AG',
        precios: {
          caja: { label: 'Caja', precio: 2000 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'AMLODIPINO 10 MG 100 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 2700 },
          caja: { label: 'Caja', precio: 27000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'AMLODIPINO 5 MG MILIGRAMO(S) X 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 2000 },
          blister: { label: 'Blíster', precio: 1600 },
        },
      },
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'AMLODIPINO 5MG  10 UND',
        precios: {
          caja: { label: 'Caja', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Calcioantagonista para hipertensión arterial y angina de pecho.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    presentaciones: [
      { tipo: 'Unidad',    precio: 150   },
      { tipo: 'Caja x30',  precio: 4200  },
    ],
    variantes: [
      { laboratorio: 'LP', tipo: 'Amlodipino 5mg x100 tab', precio: 14000 },
    ],
  },
  {
    id: 69,
    nombre: 'Enoxaparina 40mg',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ESOMEPRAZOL 40MG 10 TAB     MK PROMO',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
          blister: { label: 'Blíster', precio: 8000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ENOXAPARINA     40 ML',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'CLENOX ENOXAPARINA 60 MG  SOL INY',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      lab_delta_s_a: {
        nombre: 'LAB DELTA S.A.',
        nombreProducto: 'ENOXAPARINA SODICA 40 MG / 0.4 ML X 10 JGS',
        precios: {
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 14000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Sanofi',
    descripcion: 'Heparina de bajo peso molecular para prevención de trombosis venosa.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    presentaciones: [
      { tipo: 'Jeringa individual', precio: 10000 },
      { tipo: 'Caja x10 jeringas', precio: 95000 },
    ],
    variantes: [
      { laboratorio: 'Sanofi', tipo: 'Enoxaparina 40mg/0.4ml x10 jeringas', precio: 95000 },
    ],
  },

  /* ── Diabetes ── */
  {
    id: 70,
    nombre: 'Metformina',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'DIGIFLUOR  METFORMINA HCL 850MG',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 17800 },
        },
      },
      diabetrics_healthcar: {
        nombre: 'DIABETRICS HEALTHCARE S.A',
        nombreProducto: 'PREDIAL LEX METFORMINA 500 MG MILIGRAMO(S) TABLETA',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'METFORMINA 850MG X 30 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 9000 },
        },
      },
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'METFORMINA 850 MG X 30 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 6800 },
          caja: { label: 'Caja', precio: 19300 },
        },
      },
      ophalac: {
        nombre: 'OPHALAC',
        nombreProducto: 'METFORMINA CLORHIDRATO 850 MG CAJA X 30 LAB OPHALA',
        precios: {
          caja: { label: 'Caja', precio: 13000 },
          unidad: { label: 'Unidad', precio: 5800 },
        },
      },
      astra_zeneca_colombi: {
        nombre: 'ASTRA ZENECA COLOMBIA S.A',
        nombreProducto: 'XIGDUO DAPAGLIFLOZINA 10 MG / METFORMINA 1000 MG X',
        precios: {
          caja: { label: 'Caja', precio: 148000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'METFORMINA 500 MG   X  30 TAB  RECUB',
        precios: {
          caja: { label: 'Caja', precio: 52000 },
        },
      },
      pisa_farmaceutical_d: {
        nombre: 'PISA FARMACEUTICAL DE COL',
        nombreProducto: 'METFORMINA  850 MG X 30 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 15500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Genfar',
    descripcion: 'Antidiabético oral de primera línea para diabetes tipo 2.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 250   },
      { tipo: 'Caja x30', precio: 7000  },
    ],
    variantes: [
      { laboratorio: 'MK',     tipo: 'MK 500mg x30 tab',  precio: 7500  },
      { laboratorio: 'MK',     tipo: 'MK 850mg x30 tab',  precio: 9200  },
      { laboratorio: 'Genfar', tipo: 'Genfar 500mg x30',  precio: 7200  },
    ],
  },

  /* ── Tiroides ── */
  {
    id: 71,
    nombre: 'Levotiroxina Sódica 50mcg',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'EUTIROX   LEVOTIROXINA SODICA   X 50MCG',
        precios: {
          caja: { label: 'Caja', precio: 38900 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'LEVOTIROXINA SODICA 100 MG X 50 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 29800 },
        },
      },
      merck_s_a: {
        nombre: 'MERCK S.A.',
        nombreProducto: 'EUTIROX LEVOTIROXINA SODICA 100 MCG',
        precios: {
          caja: { label: 'Caja', precio: 43000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LEVOTIROXINA SODICA 50 MCG X30 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 15500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Hormona tiroidea sintética para hipotiroidismo. Dosis exacta controlada.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    presentaciones: [
      { tipo: 'Unidad',   precio: 300   },
      { tipo: 'Caja x50', precio: 14000 },
    ],
    variantes: [
      { laboratorio: 'LP', tipo: 'Levotiroxina 50mg x50 tab', precio: 14000 },
    ],
  },

  /* ── Corticosteroides ── */
  {
    id: 72,
    nombre: 'Dexametasona',
    laboratorios: {
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'DEXAMETASONA 8 MG/2 ML 10 AMP VT',
        precios: {
          ampolla: { label: 'Ampolla', precio: 3500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DEXAMETASONA  8MG/2ML  SOL INY  X100 AMP',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4000 },
          caja: { label: 'Caja', precio: 344850 },
        },
      },
      farmionni: {
        nombre: 'FARMIONNI',
        nombreProducto: 'DEXAMETASONA FOSFATO  8MG/2ML',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'DEXABLAS DEXAMETASONA 8MG/2ML',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 14800 },
        },
      },
      vital_vision: {
        nombre: 'VITAL VISION',
        nombreProducto: 'VITATRIOL DEXAMETASONA 0.1 G UNGUENTO 3.5G',
        precios: {
          caja: { label: 'Caja', precio: 32500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DUO DECADRON DEXAMETASONA 16 MG MILIGRAMO(S) SUSPE',
        precios: {
          caja: { label: 'Caja', precio: 70900 },
        },
      },
      monser: {
        nombre: 'MONSER',
        nombreProducto: 'CLONODEX(CLOTRIMAZOL+DEXAMETASONA +NEOMICINA )  X',
        precios: {
          caja: { label: 'Caja', precio: 22800 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'TOBRAMICINA 0.3%+DEXAMETASONA 0.1% SOLUC OFTALMICA',
        precios: {
          caja: { label: 'Caja', precio: 36800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP / Dexablas',
    descripcion: 'Corticosteroide antiinflamatorio potente. Tabletas y ampolla inyectable.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    presentaciones: [
      { tipo: 'Ampolla individual', precio: 500   },
      { tipo: 'Caja x10 ampollas', precio: 4500  },
    ],
    variantes: [
      { laboratorio: 'LP',       tipo: 'Dexametasona 8mg/2ml x100 amp', precio: 42000 },
      { laboratorio: 'Dexablas', tipo: 'Dexablas 8mg/2ml amp',          precio: 8000  },
    ],
  },
  {
    id: 73,
    nombre: 'Prednisolona 5mg',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'PREDNISOLONA 5 MG X 30 TAB COASPHARMA',
        precios: {
          blister: { label: 'Blíster', precio: 2600 },
          caja: { label: 'Caja', precio: 4800 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'METIL PREDNISOLONA SOL INY  500MG  1 VIAL  VITALIS',
        precios: {
          caja: { label: 'Caja', precio: 18900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'METILPREDNISOLONA 4 MG MILIGRAMO(S) TABLETA RECUBI',
        precios: {
          caja: { label: 'Caja', precio: 22000 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'PREDNISOLONA ACETATO 10MG/ML SUSPENSION OFTALMICA',
        precios: {
          caja: { label: 'Caja', precio: 45000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Coaspharma',
    descripcion: 'Corticosteroide oral para procesos inflamatorios e inmunológicos.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    presentaciones: [
      { tipo: 'Unidad',   precio: 450   },
      { tipo: 'Caja x30', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'Coaspharma', tipo: 'Prednisolona 5mg x30 tab', precio: 12000 },
    ],
  },

  /* ── Neurología / Psiquiatría ── */
  {
    id: 74,
    nombre: 'Amitriptilina 25mg',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'NAPROXENO SODICO 125MG/5ML',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO  SOBRES  SURTIDOS X25MG CAJA POR 15 UND',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'AMITRIPTILINA 25 MG 400 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 60000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ACETAMINOFEN + CODEINA 325MG    MK PROMO',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 13000 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'HIDROLAN HIDROXICINA CLORHIDRATO 25MG X 20 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 12500 },
          caja: { label: 'Caja', precio: 23900 },
        },
      },
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'ESPIRONOLACTONA  25MG    *20TABLR',
        precios: {
          caja: { label: 'Caja', precio: 6400 },
        },
      },
      salus_pharma: {
        nombre: 'SALUS PHARMA',
        nombreProducto: 'NODOL SPAS ACETAM 325MG + HIOSCINA N-B 10MG X 10 T',
        precios: {
          caja: { label: 'Caja', precio: 17500 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      grunenthal_colombian: {
        nombre: 'GRUNENTHAL COLOMBIANA S.A',
        nombreProducto: 'ZALDIAR TRAMADOL 37.5 MG + ACETAM 325MG X 20 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 45000 },
          caja: { label: 'Caja', precio: 85000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'AMOKEM CV  AMOXICILINA 875 + A CLAVU 125MG X 14 TA',
        precios: {
          caja: { label: 'Caja', precio: 68000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Antidepresivo tricíclico. Requiere fórmula médica y control psiquiátrico.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'LP', tipo: 'Amitriptilina 25mg x400 tab', precio: 32000 },
    ],
  },
  {
    id: 75,
    nombre: 'Eutarpan 10mg',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'EUTARPAN 10 MG X 100 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 25000 },
        },
      },
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'BUSCAPINA NF COMPOSITUM 325/10MG 100 TBS',
        precios: {
          caja: { label: 'Caja', precio: 140000 },
          par: { label: 'Par', precio: 3700 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      gonher_farmaceutica_: {
        nombre: 'GONHER FARMACEUTICA LTDA',
        nombreProducto: 'BUPROFEN IBUPRO 10MG/5ML  SUSP  X120ML',
        precios: {
          frasco: { label: 'Frasco', precio: 22900 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'METOCLOPRAMIDA 10MG/2ML SOL  INY X 1 AMP',
        precios: {
          caja: { label: 'Caja', precio: 4400 },
          ampolla: { label: 'Ampolla', precio: 4600 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'EUTARPAN  LORATADINA 10 MG  X10',
        precios: {
          caja: { label: 'Caja', precio: 9800 },
        },
      },
      prosodent_ltda: {
        nombre: 'PROSODENT LTDA.',
        nombreProducto: 'EUTARPAN LORATADINA 1MG / 1 ML X 120ML',
        precios: {
          caja: { label: 'Caja', precio: 20500 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'KETOPROFENO  10MG / 2ML SOL INY X6 AMP',
        precios: {
          ampolla: { label: 'Ampolla', precio: 5900 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'FLUNARIZINA 10MG  X20TAB',
        precios: {
          caja: { label: 'Caja', precio: 5300 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER BENZOCAINA 10MG  CEREZA',
        precios: {
          blister: { label: 'Blíster', precio: 10500 },
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Eutarpan',
    descripcion: 'Ansiolítico. Control de ansiedad bajo supervisión médica.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Eutarpan', tipo: 'Eutarpan 10mg x100 tab', precio: 22000 },
    ],
  },
  {
    id: 76,
    nombre: 'Lamdotil',
    laboratorios: {
      lab_drofarma_s_a_s: {
        nombre: 'LAB.DROFARMA S.A.S',
        nombreProducto: 'LAMDOTIL X 16 TAB',
        precios: {
          caja: { label: 'Caja', precio: 22400 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Lamdotil',
    descripcion: 'Antiepiléptico para tratamiento de convulsiones. Requiere fórmula médica.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Lamdotil', tipo: 'Lamdotil x16 tab', precio: 14000 },
    ],
  },

  /* ── Anticoncepción / Sexualidad ── */
  {
    id: 77,
    nombre: 'Postpil (Levonorgestrel 1.5mg)',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'POSTPIL  LEVONORGESTREL  1,5 MG  X 1 TAB DKT INTER',
        precios: {
          caja: { label: 'Caja', precio: 14500 },
        },
      },
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'MINIPILSUAVE LEVONORGESTREL 100 ÂΜG MICROGRAMO(S)',
        precios: {
          caja: { label: 'Caja', precio: 6600 },
        },
      },
      bcn_medical_s_a: {
        nombre: 'BCN MEDICAl S.A',
        nombreProducto: 'ACTIVA21 SUAVE LEVONORGESTREL  0.1 MG GRAGEA',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'POSTDAY LEVONORGESTREL 1.5 MG MILIGRAMO(S) TABLETA',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'LIBELLE LEVONORGESTREL 0.75 MG X 2 TAB',
        precios: {
          caja: { label: 'Caja', precio: 13000 },
        },
      },
      gedeon_richter_colom: {
        nombre: 'GEDEON RICHTER COLOMBIA S',
        nombreProducto: 'POSTINOR 2 (  LEVONORGESTREL 075 MG )',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'DKT / Lafrancol',
    descripcion: 'Anticoncepción de emergencia. Máxima eficacia en primeras 72 horas.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad (1 tableta)', precio: 22000 },
    ],
    variantes: [
      { laboratorio: 'DKT', tipo: 'Postpil Levonorgestrel 1.5mg x1 tab', precio: 22000 },
    ],
  },
  {
    id: 78,
    nombre: 'Cyclofem',
    laboratorios: {
      profamilia: {
        nombre: 'PROFAMILIA',
        nombreProducto: 'CYCLOFEM 1 AMPOLLA',
        precios: {
          ampolla: { label: 'Ampolla', precio: 23000 },
        },
      },
      nti_new_trade_intern: {
        nombre: 'NTI NEW TRADE INTERNATION',
        nombreProducto: 'CYCLOFEMINA 1 AMPOLLA + JERINGA',
        precios: {
          ampolla: { label: 'Ampolla', precio: 24000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Cyclofem',
    descripcion: 'Anticonceptivo inyectable mensual combinado (estradiol + medroxiprogesterona).',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'Cyclofem', tipo: 'Cyclofem x1 ampolla', precio: 18000 },
    ],
  },
  {
    id: 79,
    nombre: 'Sildenafilo 50mg',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'VIGRADINA     SILDENAFILO 50MG X 2 TAB',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'EUMOXINA AMOXICILINA  250MG / 5 ML SUSP X 100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 23900 },
          caja: { label: 'Caja', precio: 28900 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'LOSARTAN 50MG X 300',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 15600 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'SILDENAFILO 50 MG MILIGRAMO(S) TABLETA RECUBIERTA',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'CLONIDINA ECAR  0.150MG  X20 TAB',
        precios: {
          caja: { label: 'Caja', precio: 17900 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'DICLOXACILINA   250MG/5ML  80ML',
        precios: {
          frasco: { label: 'Frasco', precio: 7900 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'DIGIFLUOR  METFORMINA HCL 850MG',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 17800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Coaspharma / Vyasil',
    descripcion: 'Tratamiento de disfunción eréctil. Requiere valoración médica previa.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 4500  },
      { tipo: 'Caja x2',  precio: 8500  },
    ],
    variantes: [
      { laboratorio: 'LP',         tipo: 'Sildenafil 50mg x100 tab', precio: 48000 },
      { laboratorio: 'Coaspharma', tipo: 'Sildenafil 50mg x2 tab',   precio: 8000  },
      { laboratorio: 'Vyasil',     tipo: 'Vyasil 50mg x2 tab',       precio: 9000  },
      { laboratorio: 'Vigradina',  tipo: 'Vigradina 50mg x2 tab',    precio: 8500  },
    ],
  },
  {
    id: 80,
    nombre: 'Isodine Óvulos',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ISODINE OVULOS 200MG YODOVPOVI  X24 OVUL',
        precios: {
          caja: { label: 'Caja', precio: 72000 },
          unidad: { label: 'Unidad', precio: 3100 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'ISODINE BUCOFARINGEO X 60 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 18000 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'METRONIDAZOL 500 MG 200 OVULOS PC',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 90000 },
        },
      },
      ruecam: {
        nombre: 'RUECAM',
        nombreProducto: 'LINDAZOL-2PLUS  CLOTRI+CLINDA  X 3 OVULOS',
        precios: {
          caja: { label: 'Caja', precio: 45500 },
        },
      },
      tridex_s_a: {
        nombre: 'TRIDEX S.A.',
        nombreProducto: 'CLINDABACT  CLOTRI+CLINDA  X 3 OVULOS',
        precios: {
          caja: { label: 'Caja', precio: 35500 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'METRONIST METRONIDAZOL 500 MG OVULOS CAJA X 10',
        precios: {
          blister: { label: 'Blíster', precio: 18000 },
          caja: { label: 'Caja', precio: 32000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Isodine',
    descripcion: 'Povidona yodada en óvulos para infecciones vaginales y cervicitis.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Isodine', tipo: 'Isodine Óvulos 200mg Yodopov x24', precio: 22000 },
    ],
  },
  {
    id: 81,
    nombre: 'Dosaldin',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'DOSALDIN CAJA X 20 TAB (ISOMETEPTENO MUCATO 30G/ D',
        precios: {
          blister: { label: 'Blíster', precio: 20000 },
          caja: { label: 'Caja', precio: 39900 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Dosaldin',
    descripcion: 'Isometepteno mucato para cefalea vascular y migraña. Fórmula especializada.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Dosaldin', tipo: 'Dosaldin 30mg x20 tab', precio: 14000 },
    ],
  },

  /* ── Vitaminas y suplementos ── */
  {
    id: 82,
    nombre: 'Vitamina C 500mg',
    laboratorios: {
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'VITAMINA  C 500MG + ZINC NAR 100 TABLETAS MASTICAB',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 26000 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'VITAMINA E 400 U I 100 CAPSULAS COLMED',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 38000 },
        },
      },
      hartung_y_cia_s_a: {
        nombre: 'HARTUNG Y CIA S.A.',
        nombreProducto: 'REMOVEDOR LANDER VITAMINA E 35 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'VITAMINA B12 1 ML 25 AMPOLLAS EC',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4900 },
          caja: { label: 'Caja', precio: 84000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'ACETAMICOFEN 500MG 300 TABLETAS  COASPHARMA',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'CLORURO DE MAGNESIO + VITAMINA D 50 CAP',
        precios: {
          frasco: { label: 'Frasco', precio: 25000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Vical / TQ',
    descripcion: 'Antioxidante y refuerzo inmunológico. Alta concentración de ácido ascórbico.',
    imagen: imgMed(),
    tags: [T.vendido, T.oferta],
    presentaciones: [
      { tipo: 'Unidad (efervescente)', precio: 500   },
      { tipo: 'Caja x10 tab',          precio: 4500  },
      { tipo: 'Caja x144 tab',         precio: 22000 },
    ],
    variantes: [
      { laboratorio: 'Vical', tipo: 'Vical 500mg x144 tab',          precio: 22000 },
      { laboratorio: 'TQ',    tipo: 'Vitamina C + Zinc Naranja x100', precio: 18000 },
    ],
  },
  {
    id: 83,
    nombre: 'Complejo B',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'COMPLEJO B JARABE 120 ML EC',
        precios: {
          frasco: { label: 'Frasco', precio: 14800 },
          blister: { label: 'Blíster', precio: 1900 },
          caja: { label: 'Caja', precio: 45000 },
          ampolla: { label: 'Ampolla', precio: 9700 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BEDOYECTA TRI COMPLEJO B INYECTABLE',
        precios: {
          blister: { label: 'Blíster', precio: 29800 },
          caja: { label: 'Caja', precio: 88000 },
        },
      },
      aiphex_globalpharma_: {
        nombre: 'AIPHEX GLOBALPHARMA S A S',
        nombreProducto: 'AIPHEX MULTIVIT Y MIN VIT D3 COMPLEJO B ZINC X30CA',
        precios: {
          caja: { label: 'Caja', precio: 32500 },
        },
      },
      copidrogas: {
        nombre: 'COPIDROGAS',
        nombreProducto: 'NATURAL EVO SUPLEMENTO DIETARIO COMPLEJO B',
        precios: {
          frasco: { label: 'Frasco', precio: 22000 },
        },
      },
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'COMPLEJO  B    AMPOLLA CAJA  X  3',
        precios: {
          ampolla: { label: 'Ampolla', precio: 5000 },
          caja: { label: 'Caja', precio: 14500 },
        },
      },
      icofarma: {
        nombre: 'ICOFARMA',
        nombreProducto: 'PLASVIT   AN    COMPLEJO     B12    AMPOLLA',
        precios: {
          caja: { label: 'Caja', precio: 28209 },
          unidad: { label: 'Unidad', precio: 25500 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'BEDOYECTA TRI COMPLEJO B VIT B12 B6 B1 X1 JERINGA',
        precios: {
          caja: { label: 'Caja', precio: 29800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP / EC',
    descripcion: 'Vitaminas B1, B6, B12. Sistema nervioso, energía y metabolismo celular.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 100   },
      { tipo: 'Caja x30', precio: 3000  },
    ],
    variantes: [
      { laboratorio: 'EC', tipo: 'Complejo B x250 tab',    precio: 22000 },
      { laboratorio: 'LP', tipo: 'Tiamina 300mg x250 tab', precio: 28000 },
      { laboratorio: 'LP', tipo: 'Complejo B Ampolla x3',  precio: 8000  },
    ],
  },
  {
    id: 84,
    nombre: 'Colchicina 0.5mg',
    laboratorios: {
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'COLCHICINA 0.5 MG MILIGRAMO(S) TABLETA LABORATORIO',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 9000 },
          unidad: { label: 'Unidad', precio: 2800 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'COLCHICINA 0.5MG X 40 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 10500 },
          caja: { label: 'Caja', precio: 19500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'COLCHICINA 0.5 MG CAJA X 40 TABS',
        precios: {
          blister: { label: 'Blíster', precio: 2800 },
          caja: { label: 'Caja', precio: 11000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'COLCHICINA 0.5 MG  X  40 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 11000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Tratamiento de gota y brotes articulares. Antiinflamatorio específico.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [],
    variantes: [
      { laboratorio: 'LP', tipo: 'Colchicina 0.5mg x40 tab', precio: 14000 },
    ],
  },
  {
    id: 85,
    nombre: 'Vitamina E 400 UI',
    laboratorios: {
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'VITAMINA E 400 U I 100 CAPSULAS COLMED',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 38000 },
          frasco: { label: 'Frasco', precio: 21500 },
        },
      },
      hartung_y_cia_s_a: {
        nombre: 'HARTUNG Y CIA S.A.',
        nombreProducto: 'REMOVEDOR LANDER VITAMINA E 35 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'VITAMINA B12 1 ML 25 AMPOLLAS EC',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4900 },
          caja: { label: 'Caja', precio: 84000 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'CLORURO DE MAGNESIO + VITAMINA D 50 CAP',
        precios: {
          frasco: { label: 'Frasco', precio: 25000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'VITAMINA C PEDIATRICA 30 ML CEREZA',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ENAT 400 UI VITAMINA E  X30 CAPS BLANDA',
        precios: {
          caja: { label: 'Caja', precio: 24000 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'BIOCAR E VITAMINA E 400 UI UNIDAD(ES) INTERNACIONA',
        precios: {
          blister: { label: 'Blíster', precio: 9500 },
          caja: { label: 'Caja', precio: 14429 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Colmed',
    descripcion: 'Tocoferol antioxidante para piel, fertilidad y sistema inmunológico.',
    imagen: imgMed(),
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Unidad',    precio: 200   },
      { tipo: 'Caja x100', precio: 18000 },
    ],
    variantes: [
      { laboratorio: 'Colmed', tipo: 'Vitamina E 400UI x100 cáps', precio: 18000 },
    ],
  },
  {
    id: 86,
    nombre: 'Ácido Fólico 1mg',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'ACIDO FOLICO 1 MG 300 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      productos_padel: {
        nombre: 'PRODUCTOS PADEL',
        nombreProducto: 'COLGENIS ACIDO FOLICO X400G',
        precios: {
          tarro: { label: 'Tarro', precio: 45000 },
        },
      },
      mgcpharma: {
        nombre: 'MGCPHARMA',
        nombreProducto: 'HIES-TOFER PLUS HIERRO AMINOQUELADO + ACIDO FOLICO',
        precios: {
          caja: { label: 'Caja', precio: 45000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ACIDO BORICO CAJA X 500 GR MASIVOS',
        precios: {
          caja: { label: 'Caja', precio: 11500 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'ACIDO FUSIDICO CREMA 15 GR GF',
        precios: {
          tubo: { label: 'Tubo', precio: 11500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ACIDO FUSIDICO CREMA 15 GR',
        precios: {
          tubo: { label: 'Tubo', precio: 9200 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'ACIDO FUSIDICO CREMA 15 GR AG',
        precios: {
          tubo: { label: 'Tubo', precio: 10400 },
        },
      },
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'ACIDO BORICO 50 SBS 10 GR DISANFER',
        precios: {
          paquete: { label: 'Paquete', precio: 20000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      lab_athos_s_a_s: {
        nombre: 'LAB. ATHOS S.A.S',
        nombreProducto: 'ACIDO BORICO 400 GR ATHOS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 8600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP / MK',
    descripcion: 'Esencial en embarazo para el desarrollo neural del bebé. Uso prenatal.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',    precio: 70    },
      { tipo: 'Caja x30',  precio: 2000  },
      { tipo: 'Caja x300', precio: 18000 },
    ],
    variantes: [
      { laboratorio: 'LP', tipo: 'Ácido Fólico 1mg x300 tab', precio: 18000 },
      { laboratorio: 'MK', tipo: 'MK 1mg x30 tab',            precio: 6200  },
    ],
  },
  {
    id: 87,
    nombre: 'Sulfato Ferroso 300mg',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'SULFATO FERROSO GOTAS 125 MG/ML LP',
        precios: {
          frasco: { label: 'Frasco', precio: 7800 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'SULFATO FERROSO 300 MG 250 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 17092 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'EC',
    descripcion: 'Hierro oral para tratamiento de anemia ferropénica y embarazo.',
    imagen: imgMed(),
    tags: [],
    presentaciones: [
      { tipo: 'Unidad',    precio: 80    },
      { tipo: 'Caja x30',  precio: 2200  },
    ],
    variantes: [
      { laboratorio: 'EC', tipo: 'Sulfato Ferroso 300mg x250 tab', precio: 18000 },
    ],
  },
  {
    id: 88,
    nombre: 'Metocarbamol 750mg',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'METOCARBAMOL 750 MG 300 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 105000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      labinco_s_a: {
        nombre: 'LABINCO S.A.',
        nombreProducto: 'MIOFLEX METOCARBAMOL 750 MG MILIGRAMO(S) TABLETA L',
        precios: {
          blister: { label: 'Blíster', precio: 9800 },
          caja: { label: 'Caja', precio: 19600 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'METOCARBAMOL/IBUFROFENO  500MG/200MG   X10TAB MK T',
        precios: {
          caja: { label: 'Caja', precio: 20000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'METOCARBAMOL  750   X  10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 5900 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'REFLEXAL   METOCARBAMOL  750 MG   X 20 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 11500 },
          caja: { label: 'Caja', precio: 18000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'METOCARBAMOL 750 MG CAJA X 250 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 5900 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LP',
    descripcion: 'Relajante muscular para contracturas y espasmos musculares agudos.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'LP', tipo: 'Metocarbamol 750mg x300 tab', precio: 42000 },
    ],
  },
  {
    id: 89,
    nombre: 'Nervi Serum',
    laboratorios: {
      distriphargo_ltda: {
        nombre: 'DISTRIPHARGO LTDA.',
        nombreProducto: 'NERVI SERUM  CAJA X 10 AMPOLLAS',
        precios: {
          ampolla: { label: 'Ampolla', precio: 25000 },
          caja: { label: 'Caja', precio: 200000 },
        },
      },
      babaria_colombia_sas: {
        nombre: 'BABARIA COLOMBIA SAS',
        nombreProducto: 'SERUM RETINOL BABARIA 30ML',
        precios: {
          frasco: { label: 'Frasco', precio: 34800 },
          caja: { label: 'Caja', precio: 36000 },
          unidad: { label: 'Unidad', precio: 39800 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'NIVEA CREMA CORPORAL EXPRESS HYDRATION 48H SERUM H',
        precios: {
          caja: { label: 'Caja', precio: 23700 },
        },
      },
      heel_colombia_ltda: {
        nombre: 'HEEL COLOMBIA LTDA',
        nombreProducto: 'NEUREXAN  CTRL.NERVIOS SUEÑO   X 50 TABLETAS',
        precios: {
          frasco: { label: 'Frasco', precio: 68000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Nervi',
    descripcion: 'Complejo B inyectable para neuropatías y dolor nervioso. Caja x10 ampollas.',
    imagen: imgMed(),
    tags: [],
    presentaciones: [
      { tipo: 'Ampolla individual', precio: 3000  },
      { tipo: 'Caja x10 ampollas', precio: 28000 },
    ],
    variantes: [
      { laboratorio: 'Nervi', tipo: 'Nervi Serum x10 ampollas inyectables', precio: 28000 },
    ],
  },
  {
    id: 90,
    nombre: 'Salbumed Inhalador 100mcg',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'SALBUMED INHALADOR 100 MG X 200 DOSIS',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
      ophalac: {
        nombre: 'OPHALAC',
        nombreProducto: 'ASMEPOC SALBUTAMOL  INHALADOR 100MCG X 200 DOSIS',
        precios: {
          caja: { label: 'Caja', precio: 9000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Salbumed',
    descripcion: 'Broncodilatador salbutamol para asma y EPOC. 200 dosis por inhalador.',
    imagen: imgMed(),
    requiereReceta: true,
    tags: [T.nuevo],
    variantes: [
      { laboratorio: 'Salbumed', tipo: 'Salbumed 100mg x200 dosis', precio: 18000 },
    ],
  },
  {
    id: 91,
    nombre: 'Sulfato de Magnesio',
    laboratorios: {
      lab_drofarma_s_a_s: {
        nombre: 'LAB.DROFARMA S.A.S',
        nombreProducto: 'SULFATO DE MAGNESIO 100 GR DROFARMA',
        precios: {
          caja: { label: 'Caja', precio: 2200 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      productos_drogam_s_a: {
        nombre: 'PRODUCTOS DROGAM S.A.S',
        nombreProducto: 'SULFATO DE MAGNESIO PD  500G',
        precios: {
          bolsa: { label: 'Bolsa', precio: 4900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'SULFATO DE MAGNESIO YOMA X  20G',
        precios: {
          blister: { label: 'Blíster', precio: 500 },
          paquete: { label: 'Paquete', precio: 1 },
          unidad: { label: 'Unidad', precio: 500 },
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'SULZINC SULFATO DE ZINC 80 ML',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'SULFATO FERROSO GOTAS 125 MG/ML LP',
        precios: {
          frasco: { label: 'Frasco', precio: 7800 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'SULFATO FERROSO 300 MG 250 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 17092 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Disanfer',
    descripcion: 'Suplemento de magnesio para calambres musculares, estreñimiento y eclampsia.',
    imagen: imgMed(),
    tags: [],
    presentaciones: [
      { tipo: 'Sobre individual',   precio: 250   },
      { tipo: 'Caja x50 sobres',    precio: 10000 },
    ],
    variantes: [
      { laboratorio: 'Disanfer', tipo: 'Sulfato Magnesia 20g x50 sobres', precio: 10000 },
    ],
  },

  /* ── Óticos y oftálmicos ── */
  {
    id: 92,
    nombre: 'Eye Zul Gotas Oculares',
    laboratorios: {
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'VALERIANA GOTAS 30 ML DISANFER',
        precios: {
          frasco: { label: 'Frasco', precio: 4900 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'CHIQUIDENT GOTAS 5.50 MG 10 ML',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'MUCOSINA GOTAS 30 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 26500 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'LAGRIKOV CARBOXIMETICELULOSA 0,5 GOTAS OFTAL X 15',
        precios: {
          frasco: { label: 'Frasco', precio: 26200 },
        },
      },
      lab_incobra_s_a: {
        nombre: 'LAB. INCOBRA S.A.',
        nombreProducto: 'OFTALMOTRISOL GOTAS 15 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 18500 },
        },
      },
      opharm: {
        nombre: 'OPHARM',
        nombreProducto: 'OSMOCLEAR GOTAS X 15 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 11200 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'EYE ZUL GOTAS X 7 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 10800 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'WASSERTROL GOTAS OFTAL.5 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 20700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Eye Zul',
    descripcion: 'Colirio para alivio de irritación, enrojecimiento y resequedad ocular.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Eye Zul', tipo: 'Eye Zul Gotas x7ml', precio: 10000 },
    ],
  },
  {
    id: 93,
    nombre: 'Nazil Ofteno',
    laboratorios: {
      lab_sophia_de_colomb: {
        nombre: 'LAB.SOPHIA DE COLOMBIA LT',
        nombreProducto: 'NAZIL OFTENO 15 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 18200 },
          caja: { label: 'Caja', precio: 10500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Nazil',
    descripcion: 'Descongestionante y antihistamínico oftálmico para conjuntivitis alérgica.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Nazil', tipo: 'Nazil Ofteno 15ml', precio: 12000 },
    ],
  },
  {
    id: 94,
    nombre: 'Trideviral',
    categoria: 'Medicamentos',
    marca: 'Trideviral',
    descripcion: 'Antiviral tópico para herpes labial y lesiones virales en piel.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Trideviral', tipo: 'Trideviral crema/solución', precio: 14000 },
    ],
  },

  /* ── Rehidratación ── */
  {
    id: 95,
    nombre: 'Electrolit 625ml',
    laboratorios: {
      tecnofarma_s_a: {
        nombre: 'TECNOFARMA S.A',
        nombreProducto: 'NULYTELY POLIETILENGLICOL  3350 Y ELECTROLITOS SOB',
        precios: {
          caja: { label: 'Caja', precio: 198000 },
          unidad: { label: 'Unidad', precio: 21500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ELECTROLIT HIDRATANTE SABORES SURTIDOS 625 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 8500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Pisa',
    descripcion: 'Bebida isotónica de alta absorción en formato 625ml. Múltiples sabores.',
    imagen: imgMed(),
    tags: [T.vendido, T.oferta],
    presentaciones: [
      { tipo: 'Unidad 625ml', precio: 7000 },
    ],
    variantes: [
      { laboratorio: 'Pisa', tipo: '625ml Maracuyá', precio: 7000 },
      { laboratorio: 'Pisa', tipo: '625ml Uva',      precio: 7000 },
      { laboratorio: 'Pisa', tipo: '625ml Limón',    precio: 7000 },
      { laboratorio: 'Pisa', tipo: '625ml Sandía',   precio: 7000 },
    ],
  },
  {
    id: 96,
    nombre: 'Pedialyte Max con Zinc',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PEDIALYTE MAX CON ZINC  SURTIDOS  500ML',
        precios: {
          frasco: { label: 'Frasco', precio: 10300 },
          caja: { label: 'Caja', precio: 33500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'HIDRAPLUS  75 ZINC     SURTIDO  400 ML SUERO',
        precios: {
          botella: { label: 'Botella', precio: 10600 },
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'SULZINC SULFATO DE ZINC 80 ML',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'REDOXON TOTAL VTAMINA C,D  Y ZINC 10 COMPRIMIDOS',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      profar_laborables_s_: {
        nombre: 'PROFAR LABORABLES S.A.',
        nombreProducto: 'VERAMIEL KIDS CON VIT C, A C & ZINC',
        precios: {
          caja: { label: 'Caja', precio: 15800 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'ENERZINC ZINC. SULFATO 0.55/100 G/ML GRAMO/MILILIT',
        precios: {
          frasco: { label: 'Frasco', precio: 16900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Abbott',
    descripcion: 'Suero oral con zinc para diarrea pediátrica. Fórmula recomendada OMS.',
    imagen: imgMed(),
    tags: [T.nuevo, T.vendido],
    presentaciones: [
      { tipo: 'Unidad 500ml', precio: 12000 },
    ],
    variantes: [
      { laboratorio: 'Abbott', tipo: 'Pedialyte Max 500ml surtido',  precio: 12000 },
      { laboratorio: 'Abbott', tipo: 'Hidraplus 75 Zinc 400ml surt', precio: 10000 },
    ],
  },
  {
    id: 97,
    nombre: 'Sales de Rehidratación',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'SALYDRAT SALES DE REHIDRATACION X 25 SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'RHIFISOL SUERO FISIOLOGICO GOTAS NASALES  X30ML',
        precios: {
          frasco: { label: 'Frasco', precio: 6000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Salydrat / Solhidrex',
    descripcion: 'Sobres de rehidratación oral formula OMS. Toda la familia.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Sobre individual', precio: 600   },
      { tipo: 'Caja x25 sobres', precio: 14000 },
    ],
    variantes: [
      { laboratorio: 'Salydrat',  tipo: 'Salydrat x25 sobres',    precio: 14000 },
      { laboratorio: 'Solhidrex', tipo: 'Solhidrex Surt x30 sbs', precio: 16000 },
    ],
  },
  {
    id: 98,
    nombre: 'Suero Hidraplus 75 Zinc',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'HIDRAPLUS  75 ZINC     SURTIDO  400 ML SUERO',
        precios: {
          botella: { label: 'Botella', precio: 10600 },
          frasco: { label: 'Frasco', precio: 9200 },
          caja: { label: 'Caja', precio: 15500 },
          sachet: { label: 'Sachet', precio: 4000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Hidraplus',
    descripcion: 'Suero oral con zinc para rehidratación pediátrica en diarrea.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Hidraplus', tipo: 'Hidraplus 75 Zinc 400ml surtidos', precio: 10000 },
    ],
  },
  {
    id: 99,
    nombre: 'Ácido Borico',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ACIDO BORICO CAJA X 500 GR MASIVOS',
        precios: {
          caja: { label: 'Caja', precio: 11500 },
        },
      },
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'ACIDO BORICO 50 SBS 10 GR DISANFER',
        precios: {
          paquete: { label: 'Paquete', precio: 20000 },
          unidad: { label: 'Unidad', precio: 600 },
          bolsa: { label: 'Bolsa', precio: 14500 },
          caja: { label: 'Caja', precio: 5200 },
        },
      },
      lab_athos_s_a_s: {
        nombre: 'LAB. ATHOS S.A.S',
        nombreProducto: 'ACIDO BORICO 400 GR ATHOS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 8600 },
        },
      },
      isfarmacol_ltda: {
        nombre: 'ISFARMACOL LTDA.',
        nombreProducto: 'ACIDO BORICO 100G',
        precios: {
          caja: { label: 'Caja', precio: 3500 },
        },
      },
      productos_drogam_s_a: {
        nombre: 'PRODUCTOS DROGAM S.A.S',
        nombreProducto: 'DROGAM ACIDO BORICO 250 GRAMOS',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
        },
      },
      lab_drofarma_s_a_s: {
        nombre: 'LAB.DROFARMA S.A.S',
        nombreProducto: 'ACIDO BORICO  X 10 GRAMOS',
        precios: {
          caja: { label: 'Caja', precio: 3700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Disanfer',
    descripcion: 'Antiséptico suave para higiene ótica y vaginal. Uso externo.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Disanfer', tipo: 'Ácido Bórico 10g x50 sobres', precio: 10000 },
    ],
  },
  {
    id: 100,
    nombre: 'Champiojo',
    laboratorios: {
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CHAMPIOJO  CIPERMETRINA  CAJA X 24 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 48000 },
          unidad: { label: 'Unidad', precio: 2400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Champiojo',
    descripcion: 'Cipermetrina antipiojos de uso tópico. Control eficaz de pediculosis.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { laboratorio: 'Champiojo', tipo: 'Cipermetrina x24 sobres', precio: 14000 },
    ],
  },

  /* ── Vitaminas extra (IDs 101-114) ── */
  {
    id: 101,
    nombre: 'Centrum Hombre',
    laboratorios: {
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'CENTRUM WOMEN 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 54000 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'REXONA CLINICAL CLEAN  HOMBRE SACCHET POR 20 SOBRE',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'DTE BALANCE CLINICAL PROTECTION HOMBRE 32G',
        precios: {
          unidad: { label: 'Unidad', precio: 4100 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Centrum / Pfizer',
    descripcion: 'Multivitamínico completo formulado para las necesidades específicas del hombre.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 900   },
      { tipo: 'Caja x30', precio: 26000 },
    ],
    variantes: [
      { tipo: 'Centrum Men 60 tab', precio: 48000 },
      { tipo: 'Centrum Men 30 tab', precio: 28000 },
    ],
  },
  {
    id: 102,
    nombre: 'Centrum Mujer',
    laboratorios: {
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'OFT DTE REXONA BARRA MUJER SURTIDO 50 G X2UND',
        precios: {
          frasco: { label: 'Frasco', precio: 17200 },
          par: { label: 'Par', precio: 32900 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'DTE.REXONA MINIROL MUJER BAMBOO 30 GR M',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'TOA.TENA MUJER MAXI 10 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 13500 },
        },
      },
      recamier_s_a: {
        nombre: 'RECAMIER S.A.',
        nombreProducto: 'DTE.DEOPIES MUJERES SPRAY 260 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'MAQUINA DE AFEITAR SCHICK 4 MUJER',
        precios: {
          ristra: { label: 'Ristra', precio: 39024 },
          unidad: { label: 'Unidad', precio: 4500 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'CENTRUM WOMEN 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 54000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Centrum / Pfizer',
    descripcion: 'Multivitamínico con hierro y ácido fólico extra para la mujer activa.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 900   },
      { tipo: 'Caja x30', precio: 26000 },
    ],
    variantes: [
      { tipo: 'Centrum Women 60 tab', precio: 48000 },
      { tipo: 'Centrum Women 30 tab', precio: 28000 },
    ],
  },
  {
    id: 103,
    nombre: 'Supradyn',
    categoria: 'Medicamentos',
    marca: 'Supradyn / Bayer',
    descripcion: 'Multivitamínico efervescente con 12 vitaminas y 8 minerales. Energía diaria.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad (efervescente)', precio: 2500  },
      { tipo: 'Caja x10 tab',          precio: 22000 },
    ],
    variantes: [
      { tipo: 'Supradyn x10 tab efervescentes', precio: 22000 },
      { tipo: 'Supradyn x30 tab efervescentes', precio: 55000 },
    ],
  },
  {
    id: 104,
    nombre: 'Redoxon',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'REDOXON TOTAL VTAMINA C,D  Y ZINC 10 COMPRIMIDOS',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
          unidad: { label: 'Unidad', precio: 16800 },
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Redoxon / Bayer',
    descripcion: 'Vitamina C 1000mg efervescente. Refuerzo inmunológico en sabores naranja y limón.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad (efervescente)', precio: 1900  },
      { tipo: 'Caja x10 tab',          precio: 18000 },
    ],
    variantes: [
      { tipo: 'Redoxon 1g x10 tab efervescentes',    precio: 18000 },
      { tipo: 'Redoxon Triple Acción x10 tab eferv', precio: 22000 },
    ],
  },
  {
    id: 105,
    nombre: 'Ensure Advance',
    laboratorios: {
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'ENSURE ADVANCE FRESA 400 GRAMOS',
        precios: {
          tarro: { label: 'Tarro', precio: 45900 },
          frasco: { label: 'Frasco', precio: 12000 },
          caja: { label: 'Caja', precio: 63000 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'CENTRUM ADVANCE 30 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 25900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Ensure / Abbott',
    descripcion: 'Suplemento nutricional completo con proteínas y calcio. Para adultos mayores.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad 237ml', precio: 14000 },
    ],
    variantes: [
      { tipo: 'Ensure Advance Vainilla 237ml', precio: 14000 },
      { tipo: 'Ensure Advance Fresa 237ml',    precio: 14000 },
      { tipo: 'Ensure Polvo Vainilla 900g',    precio: 95000 },
    ],
  },
  {
    id: 106,
    nombre: 'PediaSure',
    laboratorios: {
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'PEDIASURE SURT LIQUIDO ORAL FRASCO X 220 ML U',
        precios: {
          caja: { label: 'Caja', precio: 11000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'PediaSure / Abbott',
    descripcion: 'Suplemento nutricional completo para niños de 1 a 10 años. Con vitaminas y minerales.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad 237ml', precio: 14000 },
    ],
    variantes: [
      { tipo: 'PediaSure Vainilla 237ml',  precio: 14000 },
      { tipo: 'PediaSure Chocolate 237ml', precio: 14000 },
    ],
  },
  {
    id: 107,
    nombre: 'Colágeno Hidrolizado',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'COLAGENO HIDROLIZADO 500MG X30 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 32000 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'COLAGENO HIDROLIZADO 10G CAJA X 30 SBS',
        precios: {
          caja: { label: 'Caja', precio: 85000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      sanly_laboratorios_s: {
        nombre: 'Sanly laboratorios SAS',
        nombreProducto: 'COLAGYN 10 COLAGENO HIDROLIZADO  800 G',
        precios: {
          frasco: { label: 'Frasco', precio: 68000 },
        },
      },
      naturlab_sas: {
        nombre: 'NATURLAB SAS',
        nombreProducto: 'COLAGENO HIDROLIZADO NUTRIDELI MIX X 800G',
        precios: {
          frasco: { label: 'Frasco', precio: 68000 },
        },
      },
      capsuland_colombia_s: {
        nombre: 'Capsuland Colombia SAS',
        nombreProducto: 'COLAGENO SUPL DIET 500MG X 30 CAPS',
        precios: {
          frasco: { label: 'Frasco', precio: 19900 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'POWER SENSATION CREMA FACIAL CON COLAGENO Y VITAMI',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'BENET GOMA GELATINA      *COLAGENO*     SIN AZUCAR',
        precios: {
          caja: { label: 'Caja', precio: 28900 },
        },
      },
      schwarzkopf: {
        nombre: 'SCHWARZKOPF',
        nombreProducto: 'OFT  SHAMPOO KONZIL COLAGENO REPARACION PROFUNDA X',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Naturex / Colnatur',
    descripcion: 'Colágeno en polvo de alta absorción. Beneficios para articulaciones y piel.',
    imagen: imgMed(),
    tags: [T.nuevo],
    presentaciones: [
      { tipo: 'Sobre individual', precio: 1700  },
      { tipo: 'Caja x30 sobres', precio: 48000 },
    ],
    variantes: [
      { tipo: 'Colágeno Hidrolizado x30 sobres', precio: 48000 },
    ],
  },
  {
    id: 108,
    nombre: 'Omega 3 MK',
    laboratorios: {
      capsuland_colombia_s: {
        nombre: 'Capsuland Colombia SAS',
        nombreProducto: 'OMEGA 3 SUPL DIET  CH&C X30 CAPS',
        precios: {
          frasco: { label: 'Frasco', precio: 19900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'OMEGA  3  1000MG  X30',
        precios: {
          caja: { label: 'Caja', precio: 32000 },
          tarro: { label: 'Tarro', precio: 43000 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'BIOEXPERT SHAMPOO OMEGA 350 MILILITROS UNILEVER CO',
        precios: {
          frasco: { label: 'Frasco', precio: 15500 },
        },
      },
      aldriston: {
        nombre: 'ALDRISTON',
        nombreProducto: 'MEGASURE  OMEGA 3 COMPLEMENTO NUTRICIONAL 440G',
        precios: {
          caja: { label: 'Caja', precio: 43900 },
        },
      },
      botanitas: {
        nombre: 'Botanitas',
        nombreProducto: 'OMEGA 3+VITAMINA',
        precios: {
          caja: { label: 'Caja', precio: 27900 },
        },
      },
      laboratorios_medick_: {
        nombre: 'LABORATORIOS MEDICK S.A.S',
        nombreProducto: 'OMEGA 3 6 9 FRASCO  X 50 CAPSULAS BOTANITAS',
        precios: {
          caja: { label: 'Caja', precio: 34800 },
        },
      },
      b_c_n_medical_s_a: {
        nombre: 'B C N MEDICAL S.A',
        nombreProducto: 'OMEGA 3 + VITAMINA E X 100 CAPSULAS BLANDAS',
        precios: {
          frasco: { label: 'Frasco', precio: 42300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Lafrancol',
    descripcion: 'Ácidos grasos EPA y DHA para salud cardiovascular y cerebral.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 500   },
      { tipo: 'Caja x30', precio: 14000 },
      { tipo: 'Caja x60', precio: 26000 },
    ],
    variantes: [
      { tipo: 'MK Omega 3 1000mg x60 cáps', precio: 28000 },
      { tipo: 'MK Omega 3 1000mg x30 cáps', precio: 16000 },
    ],
  },
  {
    id: 109,
    nombre: 'Magnesio + Zinc',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'HIDRAPLUS  75 ZINC     SURTIDO  400 ML SUERO',
        precios: {
          botella: { label: 'Botella', precio: 10600 },
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'SULZINC SULFATO DE ZINC 80 ML',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
        },
      },
      lab_drofarma_s_a_s: {
        nombre: 'LAB.DROFARMA S.A.S',
        nombreProducto: 'SULFATO DE MAGNESIO 100 GR DROFARMA',
        precios: {
          caja: { label: 'Caja', precio: 2200 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'HIDROXIDO DE MAGNESIO 120 ML',
        precios: {
          tarro: { label: 'Tarro', precio: 5800 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'REDOXON TOTAL VTAMINA C,D  Y ZINC 10 COMPRIMIDOS',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'CLORURO DE MAGNESIO + VITAMINA D 50 CAP',
        precios: {
          frasco: { label: 'Frasco', precio: 25000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'VIT MAX COMPL B +ZINC',
        precios: {
          caja: { label: 'Caja', precio: 33500 },
        },
      },
      profar_laborables_s_: {
        nombre: 'PROFAR LABORABLES S.A.',
        nombreProducto: 'VERAMIEL KIDS CON VIT C, A C & ZINC',
        precios: {
          caja: { label: 'Caja', precio: 15800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Genfar',
    descripcion: 'Suplemento de magnesio y zinc para músculos, nervios e inmunidad.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Magnesio + Zinc x60 tab', precio: 22000 },
    ],
  },
  {
    id: 110,
    nombre: 'Calcio + Vitamina D3',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'ZIVICAL D  VITAMINA D 200 /  CALCIO  600 MG',
        precios: {
          caja: { label: 'Caja', precio: 17700 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'CALTRATE CALCIO VITAMINA D FSCO X 30 TAB',
        precios: {
          frasco: { label: 'Frasco', precio: 34900 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'VITAMINA E 400 U I 100 CAPSULAS COLMED',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 38000 },
          frasco: { label: 'Frasco', precio: 21500 },
        },
      },
      hartung_y_cia_s_a: {
        nombre: 'HARTUNG Y CIA S.A.',
        nombreProducto: 'REMOVEDOR LANDER VITAMINA E 35 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'VITAMINA B12 1 ML 25 AMPOLLAS EC',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4900 },
          caja: { label: 'Caja', precio: 84000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LIQUI- CAL CALCIO X 15 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 15500 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'CLORURO DE MAGNESIO + VITAMINA D 50 CAP',
        precios: {
          frasco: { label: 'Frasco', precio: 25000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'VITAMINA C PEDIATRICA 30 ML CEREZA',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MK / Lafrancol',
    descripcion: 'Suplemento de calcio con vitamina D3. Fortalece huesos y dientes.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad',   precio: 400   },
      { tipo: 'Caja x60', precio: 22000 },
    ],
    variantes: [
      { tipo: 'Calcio + Vit D3 600mg x60 tab', precio: 22000 },
    ],
  },
  {
    id: 111,
    nombre: 'Ginseng',
    categoria: 'Medicamentos',
    marca: 'Naturex / MK',
    descripcion: 'Extracto de ginseng panax para energía, memoria y rendimiento físico.',
    imagen: imgMed(),
    tags: [T.nuevo],
    variantes: [
      { tipo: 'Ginseng 500mg x30 cáps', precio: 28000 },
    ],
  },
  {
    id: 112,
    nombre: 'Multivitamínico Gummies',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'NATELE SUPLEMENTO MULTIVITAMINICO MRL. BAYER S.A.',
        precios: {
          caja: { label: 'Caja', precio: 55500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'PEDIAVIT MULTIVITAMINICO SOLUCION ORAL 10 MILILITR',
        precios: {
          caja: { label: 'Caja', precio: 27700 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'VITALOR ICOM MULTIVITAMINICO  JARABE X 240 ML ICOM',
        precios: {
          caja: { label: 'Caja', precio: 27900 },
        },
      },
      aiphex_globalpharma_: {
        nombre: 'AIPHEX GLOBALPHARMA S A S',
        nombreProducto: 'ACTIVAGE MULTIVITAMINICO TARRO X 1.100',
        precios: {
          tarro: { label: 'Tarro', precio: 92000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DAYA PET MULTIVITAMINICO FRASCO X 240 ML LAB VITTF',
        precios: {
          frasco: { label: 'Frasco', precio: 35000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Vitamax / Surtido',
    descripcion: 'Multivitamínico en gomitas para adultos y niños. Fácil de tomar y delicioso.',
    imagen: imgMed(),
    tags: [T.nuevo, T.vendido],
    variantes: [
      { tipo: 'Gummies Adultos Surtido x60', precio: 32000 },
      { tipo: 'Gummies Niños Surtido x60',   precio: 28000 },
    ],
  },
  {
    id: 113,
    nombre: 'Vitamina C Gummies',
    laboratorios: {
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'VITAMINA E 400 U I 100 CAPSULAS COLMED',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 38000 },
          frasco: { label: 'Frasco', precio: 21500 },
        },
      },
      hartung_y_cia_s_a: {
        nombre: 'HARTUNG Y CIA S.A.',
        nombreProducto: 'REMOVEDOR LANDER VITAMINA E 35 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'VITAMINA B12 1 ML 25 AMPOLLAS EC',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4900 },
          caja: { label: 'Caja', precio: 84000 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'CLORURO DE MAGNESIO + VITAMINA D 50 CAP',
        precios: {
          frasco: { label: 'Frasco', precio: 25000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'VITAMINA C PEDIATRICA 30 ML CEREZA',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ENAT 400 UI VITAMINA E  X30 CAPS BLANDA',
        precios: {
          caja: { label: 'Caja', precio: 24000 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'BIOCAR E VITAMINA E 400 UI UNIDAD(ES) INTERNACIONA',
        precios: {
          blister: { label: 'Blíster', precio: 9500 },
          caja: { label: 'Caja', precio: 14429 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Vitamax / Surtido',
    descripcion: 'Vitamina C 250mg en gomitas sabor fresa y naranja. Refuerzo inmune divertido.',
    imagen: imgMed(),
    tags: [T.nuevo],
    variantes: [
      { tipo: 'Vitamina C Gummies x30 unds', precio: 18000 },
    ],
  },
  {
    id: 114,
    nombre: 'Enterex Oral',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DORALIV  CAJA X  10 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TRAVAD ORAL LIMON 133 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 33000 },
          blister: { label: 'Blíster', precio: 2900 },
          caja: { label: 'Caja', precio: 60310 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'CRE.DEN.ORAL-B COMPLETE 50 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 4000 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'TUKOL-D EXPECTORANTE SOL.ORAL 125 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 38200 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'TRAMADOL 10 %GOTAS ORALES 100MG /10ML EXPOFARMA',
        precios: {
          frasco: { label: 'Frasco', precio: 8900 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'METOCLOPRAMIDA SUSPENSION ORAL 4 MG / ML',
        precios: {
          frasco: { label: 'Frasco', precio: 6800 },
        },
      },
      quibi_s_a: {
        nombre: 'QUIBI S.A.',
        nombreProducto: 'ENEMATROL ORAL SABORES SURTIDOS 133 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 22400 },
        },
      },
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'ENSURE VAINILLA LIQUIDO ORAL',
        precios: {
          frasco: { label: 'Frasco', precio: 8200 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'PEDIAVIT VITAMINA SOLUCION ORAL 10 MILILITROS PROC',
        precios: {
          frasco: { label: 'Frasco', precio: 21500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Enterex / Vitabiotics',
    descripcion: 'Suplemento nutricional de rehidratación con electrolitos y aminoácidos.',
    imagen: imgMed(),
    tags: [T.vendido],
    presentaciones: [
      { tipo: 'Unidad 237ml', precio: 12000 },
    ],
    variantes: [
      { tipo: 'Enterex 237ml Vainilla', precio: 12000 },
      { tipo: 'Enterex 237ml Fresa',    precio: 12000 },
    ],
  },
  

  /* ─────────────────────────────────────────────────────────
     2. CUIDADO PERSONAL (IDs 201+)
     SIN CAMBIOS — estas categorías no usan "presentaciones"
     ───────────────────────────────────────────────────────── */
  {
    id: 201,
    nombre: 'Toallas Húmedas Winny',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TOALLAS HUMEDAS WINNY X 20 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TOALLAS HUMEDAS PEQUEÑIN REDIEN NACIDO 80 UND',
        precios: {
          caja: { label: 'Caja', precio: 16900 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Winny',
    descripcion: 'Toallas húmedas con Aloe Vera y Vitamina E. Suaves y sin alcohol.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Aloe y Vit E x100 unds', precio: 10000 },
      { tipo: 'Aloe y Vit E x24 unds',  precio: 4000  },
    ],
  },
  {
    id: 202,
    nombre: 'Pañuelos Cuidado Gripal',
    laboratorios: {
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAÑUELOS CUIDADO GRIPAL X 18 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Kleenex',
    descripcion: 'Pañuelos desechables extra suaves con bálsamo. Para gripa y alergia.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'x18 unds paquete', precio: 4000 },
    ],
  },
  {
    id: 203,
    nombre: 'Jabón Dove Original',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'JABON DOVE BLANCO ORIGINAL 90 GR',
        precios: {
          caja: { label: 'Caja', precio: 4800 },
          frasco: { label: 'Frasco', precio: 3800 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'DOVE JABON ORIGINAL 540 GRAMOS UNILEVER COLOMBIA S',
        precios: {
          caja: { label: 'Caja', precio: 24400 },
          unidad: { label: 'Unidad', precio: 4800 },
          frasco: { label: 'Frasco', precio: 24700 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Unilever',
    descripcion: 'Barra limpiadora con ¼ crema hidratante. Cuida la piel en cada lavado.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Original 90g', precio: 4500 },
    ],
  },
  {
    id: 204,
    nombre: 'Vaselina Pura',
    laboratorios: {
      lab_lady_rose_s_a_s: {
        nombre: 'LAB. LADY ROSE S.A.S',
        nombreProducto: 'VASELINA PURA MASIVOS Y MARCAS X 400 GR',
        precios: {
          pote___lata: { label: 'Pote / Lata', precio: 16900 },
        },
      },
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'VASELINA PURA DISANFER X 240 GRS',
        precios: {
          pote___lata: { label: 'Pote / Lata', precio: 13000 },
          caja: { label: 'Caja', precio: 3600 },
          tarro: { label: 'Tarro', precio: 5800 },
        },
      },
      aproquim_ltda: {
        nombre: 'APROQUIM LTDA',
        nombreProducto: 'APROQUIM VASELINA PURA LABORATORIOS APROQUIM LTDA.',
        precios: {
          paquete: { label: 'Paquete', precio: 6000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      interbel_sas: {
        nombre: 'INTERBEL SAS',
        nombreProducto: 'VASELINA PURA SUAVIZA Y PROTEJE 60G  COLOR-1',
        precios: {
          caja: { label: 'Caja', precio: 4500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GLICERINA PURA 25 CC MASIVOS Y MARCAS',
        precios: {
          frasco: { label: 'Frasco', precio: 2000 },
          paquete: { label: 'Paquete', precio: 29000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Vaseline / Disanfer',
    descripcion: 'Vaselina 100% pura para piel seca, labios y protección de heridas.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Disanfer 60g',  precio: 4000  },
      { tipo: 'Aproquim 30g',  precio: 3000  },
      { tipo: 'Vaseline 200g', precio: 12500 },
    ],
  },
  {
    id: 205,
    nombre: "Aceite Johnson's Baby",
    categoria: 'Cuidado Personal',
    marca: "Johnson's / J&J",
    descripcion: 'Aceite mineral suave. Hidrata y protege la piel desde los primeros días.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Surtido 100ml', precio: 10000 },
    ],
  },
  {
    id: 206,
    nombre: 'Crema Nivea',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CREMA NIVEA 30 GR R.367',
        precios: {
          caja: { label: 'Caja', precio: 10500 },
          tarro: { label: 'Tarro', precio: 32000 },
          frasco: { label: 'Frasco', precio: 31000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Nivea',
    descripcion: 'Hidratación clásica intensiva para piel seca. Lata icónica.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Nivea 30g lata', precio: 6500 },
    ],
  },
  {
    id: 207,
    nombre: "Crema Pond's",
    categoria: 'Cuidado Personal',
    marca: "Pond's",
    descripcion: 'Crema facial humectante clásica. En sachet individual y pote.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Sachet Humectante Azul x10', precio: 6000 },
      { tipo: 'Ponds Rejuveness x10 sach',  precio: 8000 },
    ],
  },
  {
    id: 208,
    nombre: 'Lubriderm',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LUBRIDERM SOLAR FPS 15 X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 17000 },
          tarro: { label: 'Tarro', precio: 24500 },
          caja: { label: 'Caja', precio: 22500 },
          blister: { label: 'Blíster', precio: 3700 },
        },
      },
      s_c_johnson_colombia: {
        nombre: 'S.C. JOHNSON COLOMBIANA',
        nombreProducto: 'LUBRIDERM  REPARACION INTENSIVA 400 ML',
        precios: {
          tarro: { label: 'Tarro', precio: 36500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LUBRIDERM REP INTENSIVA X750ML',
        precios: {
          tarro: { label: 'Tarro', precio: 46000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Lubriderm',
    descripcion: 'Loción corporal hidratante médica para piel seca. Sachet individual.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Sachet 25ml', precio: 2000 },
    ],
  },
  {
    id: 209,
    nombre: 'Manteca de Cacao',
    laboratorios: {
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'MANTECA DE CACAO 5 GR 12 UDS DISANFER',
        precios: {
          caja: { label: 'Caja', precio: 30000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MANTECA DE CACAO X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
          unidad: { label: 'Unidad', precio: 500 },
          paquete: { label: 'Paquete', precio: 25000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Disanfer',
    descripcion: 'Manteca de cacao pura para labios e hidratación local.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: '5g x12 unidades', precio: 6000 },
    ],
  },
  {
    id: 210,
    nombre: 'ChapStick Medicado',
    laboratorios: {
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'CHAPSTICK  PROT.LABIAL HIDRATACION TOTAL',
        precios: {
          unidad: { label: 'Unidad', precio: 19500 },
          frasco: { label: 'Frasco', precio: 19800 },
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'CHAPSTICK ULTRA HUMECTANTE SPF15',
        precios: {
          caja: { label: 'Caja', precio: 18600 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CHAPSTICK  PIÑA COLADA',
        precios: {
          caja: { label: 'Caja', precio: 14200 },
        },
      },
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'HONGICIL SHAMPO MEDICADO KETOCONAZOL 100ML',
        precios: {
          caja: { label: 'Caja', precio: 23900 },
        },
      },
      recamier_s_a: {
        nombre: 'RECAMIER S.A.',
        nombreProducto: 'PROT LABIAL CHAPSTICK MOCKTAIL COLLECTION X 3UND',
        precios: {
          caja: { label: 'Caja', precio: 30500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ChapStick',
    descripcion: 'Bálsamo labial medicado para labios resecos, agrietados o herpes labial.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'ChapStick Medicado', precio: 8000 },
    ],
  },
  {
    id: 211,
    nombre: 'Desodorante Axe Spray',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'OFT DESODORANTE AXE SPRAY SURTIDO 150ML X 2UND',
        precios: {
          paquete: { label: 'Paquete', precio: 31500 },
          unidad: { label: 'Unidad', precio: 17000 },
          frasco: { label: 'Frasco', precio: 14900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DESODORANTE PARA PIES SUAVE YODORA SPRAY CON 240 M',
        precios: {
          caja: { label: 'Caja', precio: 34000 },
          unidad: { label: 'Unidad', precio: 44900 },
        },
      },
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'DTE  SPRAY  NIVEA ACLARADO NATURAL 150 ML  X 2 UND',
        precios: {
          par: { label: 'Par', precio: 40000 },
          unidad: { label: 'Unidad', precio: 23500 },
        },
      },
      prebel: {
        nombre: 'PREBEL',
        nombreProducto: 'REPELENTE NOPIKEX NINOS SPRAY 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 24800 },
        },
      },
      recamier_s_a: {
        nombre: 'RECAMIER S.A.',
        nombreProducto: 'DTE.DEOPIES MUJERES SPRAY 260 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Unilever',
    descripcion: 'Protección antitranspirante 48h en oferta especial de dos unidades.',
    imagen: imgCui(),
    tags: [T.oferta],
    variantes: [
      { tipo: 'OFT Axe Spray Surtido 150ml x2 unds', precio: 20000 },
    ],
  },
  {
    id: 212,
    nombre: 'Speed Stick Desodorante',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'DESODORANTE TEEN SPEED LADY SPEED STICK PINK CRUSH',
        precios: {
          unidad: { label: 'Unidad', precio: 16900 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'DESODORANTE SPEED STICK CLINICAL PRACTITUBO X 100',
        precios: {
          tubo: { label: 'Tubo', precio: 9900 },
          frasco: { label: 'Frasco', precio: 3800 },
          par: { label: 'Par', precio: 30900 },
          unidad: { label: 'Unidad', precio: 16500 },
          caja: { label: 'Caja', precio: 28900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DTE SPEED STICK CREMA 2 EN 1  SACHET',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 16200 },
          unidad: { label: 'Unidad', precio: 7500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Colgate-Palmolive',
    descripcion: 'Desodorante para hombre de larga duración en sachet y gel.',
    imagen: imgCui(),
    tags: [T.oferta],
    variantes: [
      { tipo: 'DTE Speed Stick Xtreme Night Gel x18 sbs', precio: 12000 },
      { tipo: 'DTE Speed Stick Crema Duo x18 sbs',        precio: 12000 },
    ],
  },
  {
    id: 213,
    nombre: 'Crema PODS Aclarante B3',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA PODS ACLARANT B3   SACHET',
        precios: {
          blister: { label: 'Blíster', precio: 1800 },
          caja: { label: 'Caja', precio: 16000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'PODS',
    descripcion: 'Crema aclarante con niacinamida B3. Unifica el tono de la piel.',
    imagen: imgCui(),
    tags: [T.nuevo],
    variantes: [
      { tipo: 'Sachet Crema Aclarante B3', precio: 2500 },
    ],
  },
  {
    id: 214,
    nombre: 'Rexona Clinical',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'DTE  REXONA CLINICAL WOMEN CLASICC X 20 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1200 },
          caja: { label: 'Caja', precio: 14000 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'REXONA CLINICAL CLEAN  HOMBRE SACCHET POR 20 SOBRE',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 1200 },
          par: { label: 'Par', precio: 36800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DTE REXONA CLINICAL EXPRERT 46 G',
        precios: {
          caja: { label: 'Caja', precio: 14900 },
          par: { label: 'Par', precio: 37400 },
          unidad: { label: 'Unidad', precio: 19000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Unilever',
    descripcion: 'Desodorante antitranspirante de protección clínica máxima para mujer.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'DTE Rexona Clinical Women Classic x20 sbs', precio: 14000 },
    ],
  },
  {
    id: 215,
    nombre: 'Shampoo Head & Shoulders',
    laboratorios: {
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'HYS SHAMPOO HEAD & SHOULDERS SURTIDOS  375ML',
        precios: {
          frasco: { label: 'Frasco', precio: 19800 },
          caja: { label: 'Caja', precio: 28900 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SHAMPOO HEAD Y SHOULDERS LIMPIEZA RENOVADORA X90ML',
        precios: {
          six_pack: { label: 'Six Pack', precio: 33000 },
          unidad: { label: 'Unidad', precio: 6500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'OFT SHAMPOO   HYS   HEAD & SHOULDERS  X 2 UNDS',
        precios: {
          par: { label: 'Par', precio: 32500 },
          unidad: { label: 'Unidad', precio: 19800 },
          frasco: { label: 'Frasco', precio: 41500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'P&G',
    descripcion: 'Champú anticaspa. Sachet monodosis para consumo en tienda.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'H&S Sachet Surtido x12 sbs', precio: 8000 },
    ],
  },
  {
    id: 216,
    nombre: 'Shampoo Pantene',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'SHAMPOO  PANTENE PRO-V  MINUTE MIRACLE  270ML',
        precios: {
          frasco: { label: 'Frasco', precio: 18900 },
          caja: { label: 'Caja', precio: 31000 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'PANTENE SHAMPOO SURTIDOS 200 MILILITROS',
        precios: {
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'SHAMPOO PANTENE CONTROL CAIDA BAMBU X 400ML',
        precios: {
          caja: { label: 'Caja', precio: 21400 },
          ristra: { label: 'Ristra', precio: 7000 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'FUNGISTEROL SHAMPOO X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 38000 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'MEDICASP SHAMPOO KETOCONAZOL 100ML',
        precios: {
          frasco: { label: 'Frasco', precio: 28500 },
        },
      },
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'ELVIVE DREAM LONG SHAMPOO X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 11800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'P&G',
    descripcion: 'Champú Pantene Pro-V en sachet. Repara y fortalece el cabello.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Pantene Surtido Sachet x12 sbs', precio: 8000 },
    ],
  },
  {
    id: 217,
    nombre: 'Shampoo Tío Nacho',
    laboratorios: {
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'SHAMPOO TIO NACHO SOBRES X10UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 10000 },
          unidad: { label: 'Unidad', precio: 1100 },
          caja: { label: 'Caja', precio: 32000 },
          frasco: { label: 'Frasco', precio: 32000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'FUNGISTEROL SHAMPOO X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 38000 },
        },
      },
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'ELVIVE DREAM LONG SHAMPOO X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 11800 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SEDAL SHAMPOO SURTIDO 340ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16000 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS SHAMPOO SURTIDOS X  200 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 13500 },
          frasco: { label: 'Frasco', precio: 11500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'SAVITAL SHAMPOO SURT X 2O SOBRE X 25 ML',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 18000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genomma',
    descripcion: 'Champú anticaída con miel de abeja. Sachet individual.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Tío Nacho Sobres x10 unds', precio: 6000 },
    ],
  },
  {
    id: 218,
    nombre: 'Sedal Crema de Peinar',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA P.PEINAR SEDAL CERAMIDAS SOS 300GR',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
          bolsa: { label: 'Bolsa', precio: 3400 },
          caja: { label: 'Caja', precio: 11500 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SEDAL CREMA PEINAR RZ.DEFINIDO 300 MILILITROS UNIL',
        precios: {
          caja: { label: 'Caja', precio: 13900 },
        },
      },
      schwarzkopf: {
        nombre: 'SCHWARZKOPF',
        nombreProducto: 'OFT KONZIL SEDALIQUIDA CREMA PEINAR 2X 230ML',
        precios: {
          par: { label: 'Par', precio: 17900 },
          unidad: { label: 'Unidad', precio: 9300 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSON BABY CREMA  PARA PEINAR 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'PANTENE CREMA PARA PEINAR SURTIDO SACHET X 18 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 700 },
          ristra: { label: 'Ristra', precio: 8400 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Unilever',
    descripcion: 'Crema de peinar Sedal en sachet. Define rizos y da brillo.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Sedal Rizos Def. 18ml x20 sbs', precio: 10000 },
    ],
  },
  {
    id: 219,
    nombre: 'Shampoo Naissant',
    laboratorios: {
      naissant: {
        nombre: 'Naissant',
        nombreProducto: 'SHAMPOO NAISSANT SURTIDOS CAJA X 12 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 55000 },
          unidad: { label: 'Unidad', precio: 5800 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'FUNGISTEROL SHAMPOO X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 38000 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'MEDICASP SHAMPOO KETOCONAZOL 100ML',
        precios: {
          frasco: { label: 'Frasco', precio: 28500 },
        },
      },
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'ELVIVE DREAM LONG SHAMPOO X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 11800 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SEDAL SHAMPOO SURTIDO 340ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16000 },
          blister: { label: 'Blíster', precio: 1200 },
          ristra: { label: 'Ristra', precio: 8400 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS SHAMPOO SURTIDOS X  200 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 13500 },
          frasco: { label: 'Frasco', precio: 11500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'SAVITAL SHAMPOO SURT X 2O SOBRE X 25 ML',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 18000 },
        },
      },
      s_c_johnson_colombia: {
        nombre: 'S.C. JOHNSON COLOMBIANA',
        nombreProducto: 'SHAMPOO JOHNSON BABY SURT   X 12 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1200 },
          caja: { label: 'Caja', precio: 13000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Naissant',
    descripcion: 'Shampoo nutritivo en sachet. Cuida y repara el cabello dañado.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Naissant Surtido Caja x12 sobres', precio: 8000 },
    ],
  },
  {
    id: 220,
    nombre: 'Cepillo Colgate Premier',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CEPILLO COLGATE PREMIER MEDIO X 1',
        precios: {
          unidad: { label: 'Unidad', precio: 2500 },
          caja: { label: 'Caja', precio: 17500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'OFERTA CREM MAS CEPILLO 360      COLGATE',
        precios: {
          caja: { label: 'Caja', precio: 23900 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Colgate',
    descripcion: 'Cepillo dental de cerdas medianas. Limpieza efectiva del esmalte.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Cepillo Premier Medio x1', precio: 5000 },
    ],
  },
  {
    id: 221,
    nombre: 'Crema Dental Colgate Triple Acción',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CREMA DENTAL COLGATE TRIPLE ACCION 3X125 ML',
        precios: {
          caja: { label: 'Caja', precio: 23800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA COLGATE TRIPLE ACCION  PG60LLV75ML',
        precios: {
          caja: { label: 'Caja', precio: 4000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Colgate',
    descripcion: 'Pasta dental con flúor. Sachet 22g ideal para distribución.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'CRE.DEN Triple Acc. 22g x12 unds', precio: 12000 },
    ],
  },
  {
    id: 222,
    nombre: 'Tinte Iris',
    laboratorios: {
      nabonasar_martinez_y: {
        nombre: 'NABONASAR MARTINEZ Y CIA.',
        nombreProducto: 'TINTE IRIS 24 NEGRO 9 GR 12 UDS',
        precios: {
          caja: { label: 'Caja', precio: 31000 },
          empaque: { label: 'Empaque', precio: 3700 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      schwarzkopf: {
        nombre: 'SCHWARZKOPF',
        nombreProducto: 'TINTE IGORA VITA KIT 4-0 CASTAÑO MEDIANO',
        precios: {
          caja: { label: 'Caja', precio: 38500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TINTE PALETTE 71 SENSILLO UN TUBO',
        precios: {
          caja: { label: 'Caja', precio: 9200 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'TINTE  IGORA 7 - 57  TOPACIO',
        precios: {
          caja: { label: 'Caja', precio: 30000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Iris',
    descripcion: 'Tinte para cabello instantáneo en polvo. Negro 9g por sachets.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Tinte Iris N°24 Negro 9g x12 unds', precio: 8000 },
    ],
  },
  {
    id: 223,
    nombre: 'Maquinilla Schick Titanium',
    laboratorios: {
      edgewell_personal_ca: {
        nombre: 'EDGEWELL PERSONAL CARE CO',
        nombreProducto: 'MAQUINA SCHICK  4 TITANIUM   * 10 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 38500 },
          unidad: { label: 'Unidad', precio: 4600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Schick',
    descripcion: 'Maquinilla desechable de 4 hojas titanium para afeitado preciso.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Schick 4 Titanium x10 unds', precio: 18000 },
    ],
  },
  {
    id: 224,
    nombre: 'Gillette Prestobarba',
    laboratorios: {
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'PRESTOBARBA GILLETTE VENUS SIMPLY X 1',
        precios: {
          ristra: { label: 'Ristra', precio: 32143 },
          unidad: { label: 'Unidad', precio: 4400 },
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'GILLETTE PRESTOBARBA 3 SENSITIVE X UNDADES FAB. P&',
        precios: {
          unidad: { label: 'Unidad', precio: 4200 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GILLETTE SENSITIVE PRESTOBARBA 3  X 3 UNIDADES',
        precios: {
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'PRESTOBARBA SCHICK EXACTA2 WOMEN X 1',
        precios: {
          ristra: { label: 'Ristra', precio: 24000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GILLETTE 3 X  2 UNIDADES',
        precios: {
          paquete: { label: 'Paquete', precio: 7500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Gillette / P&G',
    descripcion: 'Desechables económicos de doble hoja para afeitado diario.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Prestobarba 3 x1 und',           precio: 2500  },
      { tipo: 'Prestobarba 2 hojas x24 ristra', precio: 18000 },
      { tipo: 'Venus Simply x1',                precio: 5000  },
    ],
  },
  {
    id: 225,
    nombre: 'Gel Ego For Men',
    categoria: 'Cuidado Personal',
    marca: 'Ego',
    descripcion: 'Gel fijador de máxima duración para cabello masculino.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres Surtidos x25mg caja x15 unds', precio: 10000 },
      { tipo: 'Pote 110ml Surtido',                  precio: 8000  },
    ],
  },
  {
    id: 226,
    nombre: 'Papel Higiénico Familia Alcolchax',
    laboratorios: {
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAPEL HIGIENICO   FAMILIA ALCOLCHAX       48   UND',
        precios: {
          caja: { label: 'Caja', precio: 96000 },
          unidad: { label: 'Unidad', precio: 2600 },
          paquete: { label: 'Paquete', precio: 56000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAPEL HIGIENICO FAMILIA MEGA ROLLO 4UND',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Familia',
    descripcion: 'Papel higiénico premium Alcolchax. Suave, resistente y absorbente.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'x48 unds empaque grande', precio: 42000 },
    ],
  },
  {
    id: 227,
    nombre: 'Toallas Nosotras Natural',
    laboratorios: {
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'TOA.NOSOTRAS NATURAL INV.CLAS.TELA X 30 UNDS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 12800 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'TOALLAS NOSOTRAS MATERNIDAD ALGODON PQTE X 10UNIDA',
        precios: {
          caja: { label: 'Caja', precio: 18000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'OFT TOALLAS NOSOTRAS MULTIFORMA V X30 + PROTEC 15',
        precios: {
          caja: { label: 'Caja', precio: 15800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Nosotras',
    descripcion: 'Toallas sanitarias naturales con tela suave y malla invisible.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Natural Inv. Clás. Tela x30 unds', precio: 18000 },
    ],
  },
  {
    id: 228,
    nombre: 'Condones Kristel',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CONDONES KRISTEL COLORES',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
          unidad: { label: 'Unidad', precio: 1900 },
        },
      },
      kristel: {
        nombre: 'KRISTEL',
        nombreProducto: 'CONDONES KRISTEL CAJA X 3 UNIDADES -- PRODUCTOS KR',
        precios: {
          caja: { label: 'Caja', precio: 7000 },
        },
      },
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CONDONES DUO      SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 10500 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'CONDONES PRESSERVATIVO TODAY SURTIDO   PG.3 LL.4',
        precios: {
          caja: { label: 'Caja', precio: 15500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Kristel',
    descripcion: 'Preservativos lubricados de alta resistencia para mayor seguridad.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Kristel x3 unds surtidos', precio: 4500 },
    ],
  },
  {
    id: 229,
    nombre: 'Condones Xtrem',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'SPEED STICK PROM ANTITRANS. XTREME 182 GRAMOS COLG',
        precios: {
          par: { label: 'Par', precio: 30900 },
          unidad: { label: 'Unidad', precio: 16500 },
          frasco: { label: 'Frasco', precio: 23000 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO EXTREME MAX 500 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'PRESTOBARBA SCHICK XTREME3 X 1 HAWAI',
        precios: {
          ristra: { label: 'Ristra', precio: 39000 },
          unidad: { label: 'Unidad', precio: 2600 },
        },
      },
      bcn_medical_s_a: {
        nombre: 'BCN MEDICAl S.A',
        nombreProducto: 'XTREM CONDON 3 UNDS SURTIDOS',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
        },
      },
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CONDONES DUO      SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 10500 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'EGO GEL EXTREME MAX 240ML',
        precios: {
          tarro: { label: 'Tarro', precio: 10500 },
        },
      },
      new_health_pharmaceu: {
        nombre: 'NEW HEALTH PHARMACEUTICAL',
        nombreProducto: 'PROTECT SOLAR SUNTIME EXTREM PROT SOLAR SPF 50',
        precios: {
          caja: { label: 'Caja', precio: 33500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CONDONES KRISTEL COLORES',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Xtrem',
    descripcion: 'Preservativos en variedad de presentaciones. Pack x3 surtidos.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Xtrem Condón x3 surtidos', precio: 4500 },
    ],
  },
  {
    id: 230,
    nombre: 'Today Preservativos',
    laboratorios: {
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'TODAY PROM CONDON TRIPLE PLEASURE    *BLANCO*',
        precios: {
          caja: { label: 'Caja', precio: 11500 },
        },
      },
      mediseg: {
        nombre: 'MEDISEG',
        nombreProducto: 'PRESERVATIVOS PROTEZZIONE LUBRICACIÓN EN CAJA CON',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PRESERVATIVOS ULTRA DELGADO KRISTEL 3 UND',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
        },
      },
      haleon_colombia: {
        nombre: 'HALEON COLOMBIA',
        nombreProducto: 'PREPACK TODAY SURTIDOS PAQ 3 UND  PG25LLV30',
        precios: {
          caja: { label: 'Caja', precio: 401000 },
          unidad: { label: 'Unidad', precio: 15500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Today',
    descripcion: 'Pack promocional de condones lubricados a precio competitivo.',
    imagen: imgCui(),
    tags: [T.oferta],
    variantes: [
      { tipo: 'Prepack Today Surt. x3 unds PG25LLV30', precio: 8000 },
      { tipo: 'Prepack Duo Surt. PG20LLV24',           precio: 6000 },
    ],
  },
  {
    id: 231,
    nombre: 'Curas Hansaplast Impermeables',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CURAS HANSAPLAST IMPERMEABLES  PIEL 100 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 13000 },
          par: { label: 'Par', precio: 300 },
          unidad: { label: 'Unidad', precio: 200 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Hansaplast',
    descripcion: 'Curitas impermeables con diseño piel. Protección de heridas.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Impermeables Piel x100 unds', precio: 18000 },
      { tipo: 'Aposito Callicida x6 unds',   precio: 6000  },
    ],
  },
  {
    id: 232,
    nombre: 'Curitas Adecibas Redondas',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CURITAS ADECIBAS REDONDAS BEGUT * 10 CAJITAS',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 9000 },
          unidad: { label: 'Unidad', precio: 100 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Begut',
    descripcion: 'Curitas redondas adhesivas para puntos y pequeñas heridas.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Begut Redondas x10 cajitas', precio: 10000 },
    ],
  },
  {
    id: 233,
    nombre: 'Gasas Estériles Alfasafe',
    categoria: 'Cuidado Personal',
    marca: 'Alfasafe',
    descripcion: 'Esponjas de gasa estéril en sobre individual para heridas.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Alfasafe Gasa Estéril x50 sobres', precio: 12000 },
    ],
  },
  {
    id: 234,
    nombre: 'Micropore Cinta Quirúrgica',
    laboratorios: {
      '3m': {
        nombre: '3M',
        nombreProducto: 'NEXCARE PROM MICROPORE CINTA QUIRURGICA SIN FABRIC',
        precios: {
          caja: { label: 'Caja', precio: 7708 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'FIXOSAFE CINTA QUIRURGICA ALFA 5CM 2MTS',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: '3M / Nexcare',
    descripcion: 'Cinta microporo sin fabricante para fijación de vendajes y apósitos.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Nexcare Micropore Cinta Piel x24 x3', precio: 14000 },
    ],
  },
  {
    id: 235,
    nombre: 'Esparadrapo de Tela',
    laboratorios: {
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'ESPARADRAPO TELA 4&#34;X5Y',
        precios: {
          caja: { label: 'Caja', precio: 41700 },
          unidad: { label: 'Unidad', precio: 13900 },
        },
      },
      bsn_medical_ltda: {
        nombre: 'BSN MEDICAL LTDA.',
        nombreProducto: 'ESPARADRAPO LEUKOPLAST TELA 7.50CMT 4.57M',
        precios: {
          caja: { label: 'Caja', precio: 29800 },
          unidad: { label: 'Unidad', precio: 39800 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ESPARADRAPO CUREBAND TELA 1X5 YARDAS',
        precios: {
          unidad: { label: 'Unidad', precio: 11900 },
        },
      },
      '3m': {
        nombre: '3M',
        nombreProducto: 'NEXCARE ESPARADRAPO DE TELA 1 X 3 (25MM)',
        precios: {
          unidad: { label: 'Unidad', precio: 7900 },
        },
      },
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'ALFASAFE ESPARADRAPO TIPO TELA  4 X 5 YDS',
        precios: {
          unidad: { label: 'Unidad', precio: 19200 },
        },
      },
      alfasafe: {
        nombre: 'Alfasafe',
        nombreProducto: 'ESPARADRAPO DE TELA  1/2  X 5 YDS',
        precios: {
          unidad: { label: 'Unidad', precio: 3600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'LP',
    descripcion: 'Esparadrapo resistente de tela 1/2 pulgada x5 yardas para fijación.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: '1/2 x5 yds', precio: 3500 },
    ],
  },
  {
    id: 236,
    nombre: 'Guantes Látex Alfasafe',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'ALFASAFE GUANTE LATEX  SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 14300 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      eterna_s_a: {
        nombre: 'ETERNA S.A.',
        nombreProducto: 'GUANTES CIRUGIA ESTERIL  LATEX TALLAS SURT PRECISI',
        precios: {
          unidad: { label: 'Unidad', precio: 2000 },
          caja: { label: 'Caja', precio: 30000 },
          par: { label: 'Par', precio: 1500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Alfasafe / Kimberly',
    descripcion: 'Guantes de látex desechables surtidos para uso médico y doméstico.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Alfasafe Guante Látex Surtido x100',  precio: 18000 },
      { tipo: 'Guante Nitrilo Negro Surt. x24 unds', precio: 22000 },
    ],
  },
  {
    id: 237,
    nombre: 'Tapabocas',
    laboratorios: {
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'TAPABOCAS POR UNIDAD  BEGUT',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TAPABOCAS NIÑOS -NIÑAS',
        precios: {
          caja: { label: 'Caja', precio: 18000 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'TAPABOCAS  CON ELASTICO X 50 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 13000 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Begut',
    descripcion: 'Mascarilla de protección para adultos y niños.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Tapabocas por unidad adulto', precio: 800 },
      { tipo: 'Tapabocas negro adulto',      precio: 800 },
      { tipo: 'Tapabocas niños/niñas',       precio: 800 },
    ],
  },
  {
    id: 238,
    nombre: 'Jeringas Desechables',
    laboratorios: {
      distrisanchez_ltda: {
        nombre: 'DISTRISANCHEZ LTDA',
        nombreProducto: 'BEBEX PAÑALES DESECHABLES ETAPA 4 PAQ X 30 UN',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Begut / Alfa',
    descripcion: 'Jeringas desechables con y sin aguja de múltiples tamaños.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Jeringa 5ml c/aguja 21G x1½"',    precio: 1200  },
      { tipo: 'Jeringa 10ml Begut',               precio: 1500  },
      { tipo: 'Jeringa 10ml 21Gx1½" Alfa x100',  precio: 28000 },
      { tipo: 'Jeringa 3ml c/aguja 23G x1"',      precio: 1000  },
      { tipo: 'Jeringa 3P 20cc 21x1½" Alfa x50', precio: 22000 },
    ],
  },
  {
    id: 239,
    nombre: 'Equipo de Infusión',
    laboratorios: {
      eterna_s_a: {
        nombre: 'ETERNA S.A.',
        nombreProducto: 'PRECISION CARE EQUIPO DESECHABLE INFUSION ETERNA S',
        precios: {
          unidad: { label: 'Unidad', precio: 2200 },
          paquete: { label: 'Paquete', precio: 5700 },
        },
      },
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'EQUIPO MACROGOTEO SIN AGUJA ALFA',
        precios: {
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Precision Care',
    descripcion: 'Equipo desechable de infusión venosa para sueros y medicamentos IV.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Equipo Desechable Infusión x1', precio: 3000 },
    ],
  },
  {
    id: 240,
    nombre: 'Frasco Copro y Orina',
    laboratorios: {
      inverfarma_sas: {
        nombre: 'INVERFARMA SAS',
        nombreProducto: 'FRASCO ORINA RECOLE.24 HORAS  INVERFARMA',
        precios: {
          tarro: { label: 'Tarro', precio: 9200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'FSCO COPROLOGICO Y ORINA X50',
        precios: {
          paquete: { label: 'Paquete', precio: 25000 },
          unidad: { label: 'Unidad', precio: 600 },
          caja: { label: 'Caja', precio: 9900 },
        },
      },
      medical_nissi_sas: {
        nombre: 'MEDICAL NISSI SAS',
        nombreProducto: 'FRASCO RECOLECTOR DE ORINA 24 HORAS',
        precios: {
          unidad: { label: 'Unidad', precio: 11500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Frasco colector para muestras de orina y coproscópico en laboratorio.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Frasco Copro y Orina x50 unds', precio: 18000 },
    ],
  },
  {
    id: 241,
    nombre: 'Prueba de Embarazo',
    laboratorios: {
      mediseg: {
        nombre: 'MEDISEG',
        nombreProducto: 'PRUEBA DE EMBARAZO MEDISEG',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'PRUEBA DE EMBARAZO CLEARBLUE PLUS',
        precios: {
          caja: { label: 'Caja', precio: 22500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PRUEBA DE EMBARAZO EARLY TEST - CASSETTE',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'CLEARBLUE PRUEBA EMBARAZO DIGITAL PYG COLOMBIA LTD',
        precios: {
          caja: { label: 'Caja', precio: 42900 },
        },
      },
      isfarmacol_ltda: {
        nombre: 'ISFARMACOL LTDA.',
        nombreProducto: 'PRUEBA DE EMBARAZO CIGUEÑA FLASH',
        precios: {
          caja: { label: 'Caja', precio: 9800 },
        },
      },
      lab_vogue: {
        nombre: 'LAB VOGUE',
        nombreProducto: 'PESTAÑINA A PRUEBA DE AGUA 10ML  VOGUE DOORADO',
        precios: {
          unidad: { label: 'Unidad', precio: 7900 },
        },
      },
      prebel: {
        nombre: 'PREBEL',
        nombreProducto: 'VITU PESTANINA VOLUMEN PRUEBA AG. 13 ML',
        precios: {
          caja: { label: 'Caja', precio: 9100 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Early Test / Clearblue',
    descripcion: 'Prueba rápida de embarazo en orina. Alta sensibilidad a la hormona HCG.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Early Test - Cassette', precio: 3500 },
      { tipo: 'Esfero tipo bolígrafo', precio: 4000 },
    ],
  },
  {
    id: 242,
    nombre: 'Gotero / Pipeta de Vidrio',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'GOTERO PIPETA DE VIDRIO BOLSA X20 UNDS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 23500 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Pipeta de vidrio para dosificación de líquidos y medicamentos.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Bolsa x20 unds', precio: 6000 },
    ],
  },
  {
    id: 243,
    nombre: 'Apósitos Oculares',
    laboratorios: {
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'APOSITOS OCULARES  ADULTOS  X20UNDS',
        precios: {
          caja: { label: 'Caja', precio: 17500 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'APOSITOS OCULARES PARA NIÑOS',
        precios: {
          blister: { label: 'Blíster', precio: 900 },
          caja: { label: 'Caja', precio: 13300 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Apósitos adhesivos para cubrir y proteger el ojo después de procedimientos.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Adultos x20 unds', precio: 8000 },
    ],
  },
  {
    id: 244,
    nombre: 'Cloruro de Sodio 0.9%',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'AFRISAL SODIO, CLORURO 0.65 % SOL SALINA 30ML',
        precios: {
          caja: { label: 'Caja', precio: 35800 },
        },
      },
      pisa_farmaceutical_d: {
        nombre: 'PISA FARMACEUTICAL DE COL',
        nombreProducto: 'CLORURO DE SODIO 0.9%  X 500 ML',
        precios: {
          caja: { label: 'Caja', precio: 4200 },
          frasco: { label: 'Frasco', precio: 4900 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
      laboratorios_richmon: {
        nombre: 'LABORATORIOS RICHMOND',
        nombreProducto: 'CROMOGLICATO DE SODIO 2% OFTALM.5 ML EX',
        precios: {
          frasco: { label: 'Frasco', precio: 5600 },
        },
      },
      baxter_s_a: {
        nombre: 'BAXTER S.A.',
        nombreProducto: 'SUERO FISIOLOGICO CLOR.SODIO 500 ML 1323',
        precios: {
          bolsa: { label: 'Bolsa', precio: 4000 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'CLORURO DE MAGNESIO + VITAMINA D 50 CAP',
        precios: {
          frasco: { label: 'Frasco', precio: 25000 },
        },
      },
      productos_padel: {
        nombre: 'PRODUCTOS PADEL',
        nombreProducto: 'PADEL CALCIO + CLORURO DEMAG  400G',
        precios: {
          tarro: { label: 'Tarro', precio: 45000 },
        },
      },
      mediseg: {
        nombre: 'MEDISEG',
        nombreProducto: 'BICARBONATO DE SODIO MEDISEG 100G',
        precios: {
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'SAL FRUTAS LUA SODIO. BICARBONATO X 26 SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 2600 },
          caja: { label: 'Caja', precio: 65600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Lafrancol',
    descripcion: 'Solución salina isotónica 1000ml para uso intravenoso y lavados.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Cloruro de Sodio 0.9% x1000ml', precio: 12000 },
    ],
  },
  {
    id: 245,
    nombre: 'Piedra de Alumbre',
    laboratorios: {
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'PIEDRA  ALUMBRE PASTA 30 GRAMOS PRODUCTOS DISANFER',
        precios: {
          caja: { label: 'Caja', precio: 13000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      lab_drofarma_s_a_s: {
        nombre: 'LAB.DROFARMA S.A.S',
        nombreProducto: 'ALUMBRE EN BARRA 25 GR LAB. DROFARMA',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      promegan_ltda: {
        nombre: 'PROMEGAN LTDA',
        nombreProducto: 'PIEDRA POMEZ',
        precios: {
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Disanfer',
    descripcion: 'Antiséptico natural post-afeitado. Cierra los poros y detiene el sangrado.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Piedra Alumbre Pasta 30g', precio: 3500 },
    ],
  },
  {
    id: 246,
    nombre: 'Alcanfor en Tabletas',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Alcanfor refinado para alivio de dolores musculares y repelente de insectos.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'x40 tabletas', precio: 4000 },
    ],
  },
  {
    id: 247,
    nombre: 'Domeboro Polvo',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'DOMEBORO POLVO 25 SBS',
        precios: {
          unidad: { label: 'Unidad', precio: 1400 },
          blister: { label: 'Blíster', precio: 1800 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
      lab_smart_s_a: {
        nombre: 'LAB. SMART S.A.',
        nombreProducto: 'POLVO NAILEN FILTRO SURTIDO X 1',
        precios: {
          unidad: { label: 'Unidad', precio: 10500 },
        },
      },
      neo_ltda: {
        nombre: 'NEO LTDA',
        nombreProducto: 'NEO FUNGINA POLVO 40 GR',
        precios: {
          unidad: { label: 'Unidad', precio: 13500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER GRIPA POLVO PARA SOLUCION ORAL SABOR NARAN',
        precios: {
          blister: { label: 'Blíster', precio: 2900 },
          caja: { label: 'Caja', precio: 60310 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'CEFALEXINA 250 MG / 5 ML  POLVO PARA SUSP  X 60 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'AMPICILINA 1G + SULBACTAM 0.5G POLVO PARA SOLUCION',
        precios: {
          caja: { label: 'Caja', precio: 6400 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Domeboro',
    descripcion: 'Acetato de aluminio en polvo para dermitis por contacto y picaduras.',
    imagen: imgCui(),
    tags: [T.oferta],
    variantes: [
      { tipo: 'Oferta: Pague 25 Lleve 30 unds', precio: 22000 },
    ],
  },
  {
    id: 248,
    nombre: 'Acetato de Aluminio Body-Mantle',
    laboratorios: {
      interbel_sas: {
        nombre: 'INTERBEL SAS',
        nombreProducto: 'BODY MANTLE ACETATO DE ALUMINIO LOCION 500 ML',
        precios: {
          caja: { label: 'Caja', precio: 13500 },
          frasco: { label: 'Frasco', precio: 6000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'OFT ACID MANTLE  LOCION ACETATO ALUMINIO 400ML+120',
        precios: {
          caja: { label: 'Caja', precio: 57000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Body-Mantle',
    descripcion: 'Loción pH 4.5 de acetato de aluminio para dermatitis e irritaciones.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Loción Body-Mantle pH4.5', precio: 22000 },
    ],
  },
  {
    id: 249,
    nombre: 'Fisiomax Lubricante Íntimo',
    laboratorios: {
      zambon: {
        nombre: 'ZAMBON',
        nombreProducto: 'FISIOMAX LUBRICANTE INTIMO 30 SBS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          unidad: { label: 'Unidad', precio: 2300 },
          tubo: { label: 'Tubo', precio: 36500 },
          frasco: { label: 'Frasco', precio: 26800 },
        },
      },
      rb_health_colombia: {
        nombre: 'RB HEALTH COLOMBIA',
        nombreProducto: 'K-Y GEL LUBRICANTE INTIMO  50 GR',
        precios: {
          tubo: { label: 'Tubo', precio: 35500 },
        },
      },
      reckitt_benckiser: {
        nombre: 'RECKITT BENCKISER',
        nombreProducto: 'KY GEL LUBRICANTE INTIMO 100G',
        precios: {
          caja: { label: 'Caja', precio: 52500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Fisiomax',
    descripcion: 'Lubricante íntimo en sobres individuales. pH balanceado y sin perfume.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Fisiomax x30 sobres', precio: 18000 },
    ],
  },
  {
    id: 250,
    nombre: 'Gel Íntimo Kristel',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GEL  INTIMO  SABORES KRISTEL   CAJA POR 1250',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 1900 },
          blister: { label: 'Blíster', precio: 1200 },
        },
      },
      zambon: {
        nombre: 'ZAMBON',
        nombreProducto: 'FISIOMAX LUBRICANTE INTIMO 30 SBS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          unidad: { label: 'Unidad', precio: 2300 },
          tubo: { label: 'Tubo', precio: 36500 },
        },
      },
      rb_health_colombia: {
        nombre: 'RB HEALTH COLOMBIA',
        nombreProducto: 'K-Y GEL LUBRICANTE INTIMO  50 GR',
        precios: {
          tubo: { label: 'Tubo', precio: 35500 },
        },
      },
      belleza_express_ltda: {
        nombre: 'BELLEZA EXPRESS LTDA',
        nombreProducto: 'JAB.INTIMO INTIBON MUJER SURT   210ML',
        precios: {
          caja: { label: 'Caja', precio: 16200 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'CAREFREE PROTECTOR INTIMO SIN/CON PERF   X15',
        precios: {
          paquete: { label: 'Paquete', precio: 2000 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'JABON INTIMO NOSOTRAS SURT X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 15600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Kristel',
    descripcion: 'Gel lubricante íntimo sabores en presentación comercial.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Gel Íntimo Sabores Kristel caja x1250', precio: 8000 },
    ],
  },
  {
    id: 251,
    nombre: 'Crema No.4 Corporal',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'NIVEA CREMA CORPORAL REAFIRMANTE Q 10  X 1 L',
        precios: {
          caja: { label: 'Caja', precio: 41900 },
          unidad: { label: 'Unidad', precio: 20000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA CORPORAL NIVEA SOFT MILK 1 LITRO',
        precios: {
          tarro: { label: 'Tarro', precio: 41900 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'DIABETTX CREMA CORPORAL DIABETES 400 MILILITROS GE',
        precios: {
          frasco: { label: 'Frasco', precio: 25000 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LUBRIDERM CREMA HUMECTANTE CORPORAL PREVENCION ROS',
        precios: {
          tarro: { label: 'Tarro', precio: 46500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'OFT NIVEA CREMA CORPORAL MILK NT 48H PIEL EXTRA SE',
        precios: {
          par: { label: 'Par', precio: 37500 },
          unidad: { label: 'Unidad', precio: 19500 },
          caja: { label: 'Caja', precio: 23700 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'No.4',
    descripcion: 'Crema corporal humectante de uso diario. Fórmula suave para todo tipo de piel.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Crema No.4 200ml', precio: 12000 },
      { tipo: 'Crema No.4 400ml', precio: 22000 },
    ],
  },
  {
    id: 252,
    nombre: 'Crema Dental Sensodyne',
    laboratorios: {
      glaxo_smithkline_col: {
        nombre: 'GLAXO SMITHKLINE COLOMBIA',
        nombreProducto: 'SENSODYNE CREMA DENTAL BLANQUEADOR 100 GRAMOS GLAX',
        precios: {
          caja: { label: 'Caja', precio: 25900 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'CREMA DENTAL SENSODYNE SEN & ENCIASX100G',
        precios: {
          caja: { label: 'Caja', precio: 25900 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CREMA DENTAL COLGATE PERIOGARD 90GR',
        precios: {
          caja: { label: 'Caja', precio: 22800 },
        },
      },
      pf_farmaceutica_s_a: {
        nombre: 'PF FARMACEUTICA S.A.',
        nombreProducto: 'FITOKIDS CREMA DENTAL NINO CHICLE 75G',
        precios: {
          frasco: { label: 'Frasco', precio: 19000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Sensodyne / GSK',
    descripcion: 'Pasta dental para dientes sensibles. Protección clínicamente probada.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sensodyne Rapid Relief 100g', precio: 18000 },
      { tipo: 'Sensodyne Whitening 100g',   precio: 18000 },
    ],
  },
  {
    id: 253,
    nombre: 'Enjuague Bucal Listerine',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LISTERINE ENJUAGUE BUCAL WHITENING EXTREM BLANCO 4',
        precios: {
          frasco: { label: 'Frasco', precio: 21900 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'COLGATE ENJUAGUE BUCAL KIDS 250 MLCOLGATE',
        precios: {
          frasco: { label: 'Frasco', precio: 12500 },
        },
      },
      lab_farpag: {
        nombre: 'LAB. FARPAG',
        nombreProducto: 'K-TRIX ENJUAGUE BUCAL SOLUCION DE CANENDULA X180ML',
        precios: {
          frasco: { label: 'Frasco', precio: 40500 },
          caja: { label: 'Caja', precio: 33900 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'ENJUAGUE BUCAL   250   CUIDADO TOTAL',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ENJUAGUE BUCAL WHOLE FRESH REFRESHMINT 250 ML',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'J&J / Listerine',
    descripcion: 'Antiséptico bucal de amplio espectro. Elimina gérmenes y refresca el aliento.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Listerine Cool Mint 180ml',  precio: 14000 },
      { tipo: 'Listerine Total Care 500ml', precio: 26000 },
    ],
  },
  {
    id: 254,
    nombre: 'Cepillo Dental Oral-B',
    laboratorios: {
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'CEPILLO DENTAL ORAL-B COMPLETE 2 UND',
        precios: {
          caja: { label: 'Caja', precio: 9600 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CEPILLO DENTAL ORAL-B COMPLETE  BLACK X 4 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 16500 },
          blister: { label: 'Blíster', precio: 3800 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CEPILLO COLGATE KIDS DENTAL',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
        },
      },
      proquident_s_a: {
        nombre: 'PROQUIDENT S.A.',
        nombreProducto: 'PROQUIDENT PROM CREMA CEPILLO DENTAL 100G',
        precios: {
          unidad: { label: 'Unidad', precio: 9500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Oral-B / P&G',
    descripcion: 'Cepillo dental de cerdas suaves y medianas. Diseño ergonómico.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Oral-B Advantage Medio x1', precio: 7000 },
      { tipo: 'Oral-B 3D White Medio x1',  precio: 9000 },
    ],
  },
  {
    id: 255,
    nombre: 'Desodorante Rexona Mujer',
    laboratorios: {
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'OFT DTE REXONA BARRA MUJER SURTIDO 50 G X2UND',
        precios: {
          frasco: { label: 'Frasco', precio: 17200 },
          par: { label: 'Par', precio: 32900 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'DTE.REXONA MINIROL MUJER BAMBOO 30 GR M',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DTE REXONA CLINICAL 48H  MUJER  X 60G',
        precios: {
          caja: { label: 'Caja', precio: 6800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Rexona / Unilever',
    descripcion: 'Antitranspirante femenino 48h. Protección activa con tecnología MotionSense.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Rexona Women Fresh 150ml spray', precio: 12000 },
      { tipo: 'Rexona Women Cotton Barra 45g',  precio: 10000 },
    ],
  },
  {
    id: 256,
    nombre: 'Desodorante Rexona Hombre',
    laboratorios: {
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'REXONA CLINICAL CLEAN  HOMBRE SACCHET POR 20 SOBRE',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Rexona / Unilever',
    descripcion: 'Antitranspirante masculino 48h. Fragancias frescas y protección extrema.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Rexona Men Active 150ml spray', precio: 12000 },
      { tipo: 'Rexona Men V8 Barra 45g',       precio: 10000 },
    ],
  },
  {
    id: 257,
    nombre: 'Desodorante Dove',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'DTE.DOVE SPRAY INVISIBLE DRY 89 GR M',
        precios: {
          frasco: { label: 'Frasco', precio: 14900 },
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 14000 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'DOVE SHAMPOO SURTIDOS  X 12 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1200 },
          ristra: { label: 'Ristra', precio: 8400 },
          caja: { label: 'Caja', precio: 14400 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Dove / Unilever',
    descripcion: 'Antitranspirante con ¼ crema hidratante. Suave para axilas depiladas.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Dove Original 150ml spray', precio: 13000 },
      { tipo: 'Dove Go Fresh Barra 45g',   precio: 11000 },
    ],
  },
  {
    id: 258,
    nombre: 'Shampoo Sedal',
    laboratorios: {
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SEDAL SHAMPOO SURTIDO 340ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16000 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'SEDAL SHAMPOO DUO 24ML SURT SOBRES X 12 UNDS',
        precios: {
          blister: { label: 'Blíster', precio: 1300 },
          caja: { label: 'Caja', precio: 1 },
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'FUNGISTEROL SHAMPOO X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 38000 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'MEDICASP SHAMPOO KETOCONAZOL 100ML',
        precios: {
          frasco: { label: 'Frasco', precio: 28500 },
        },
      },
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'ELVIVE DREAM LONG SHAMPOO X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 11800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Sedal / Unilever',
    descripcion: 'Champú en sachet individual para cabello liso, rizado y dañado.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Sedal Surtido x12 sobres 18ml', precio: 8000 },
    ],
  },
  {
    id: 259,
    nombre: 'Jabón Protex',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'JABON PROTEX AVENA 120 GR',
        precios: {
          unidad: { label: 'Unidad', precio: 3500 },
          caja: { label: 'Caja', precio: 3500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'JABON PROTEX MEN SPORT 3 X 110 GRS',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'OFERTA JABON PROTEX  AVENA',
        precios: {
          par: { label: 'Par', precio: 6800 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'JABON ASEPXIA CARBON DETOX 100 GR',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: '3 JABONES ACID MANTLE 90GR ECONOPACK',
        precios: {
          caja: { label: 'Caja', precio: 21000 },
          unidad: { label: 'Unidad', precio: 8500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Colgate-Palmolive',
    descripcion: 'Jabón antibacterial con ingredientes protectores.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Protex Original 90g', precio: 4800 },
      { tipo: 'Protex Aloe 110g',    precio: 5200 },
    ],
  },
  {
    id: 260,
    nombre: 'Jabón Palmolive',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'JABON PROTEX MACADAMIA 110 GR COLGATE PALMOLIVE',
        precios: {
          caja: { label: 'Caja', precio: 3500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'JABON PALMOLIVE  SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 3500 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'JABON ASEPXIA CARBON DETOX 100 GR',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: '3 JABONES ACID MANTLE 90GR ECONOPACK',
        precios: {
          caja: { label: 'Caja', precio: 21000 },
          unidad: { label: 'Unidad', precio: 8500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'JABON DOVE BLANCO ORIGINAL 90 GR',
        precios: {
          caja: { label: 'Caja', precio: 4800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JABON NEKO AVENA 125 GR',
        precios: {
          caja: { label: 'Caja', precio: 4600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Colgate-Palmolive',
    descripcion: 'Barra de jabón con extractos naturales. Piel suave y humectada.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Palmolive Naturals Avena 90g', precio: 4200 },
      { tipo: 'Palmolive Luminous Oils 90g',  precio: 5000 },
    ],
  },
  {
    id: 261,
    nombre: 'Espuma de Afeitar Gillette',
    laboratorios: {
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'GILLETTE ESPUMA AFEITAR 150 GRAMOS PYG COLOMBIA LT',
        precios: {
          caja: { label: 'Caja', precio: 14900 },
          frasco: { label: 'Frasco', precio: 16000 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'GILLETTE EXPUMA PARA AFEITAR X300ML',
        precios: {
          frasco: { label: 'Frasco', precio: 15500 },
        },
      },
      jgb_s_a: {
        nombre: 'JGB S.A.',
        nombreProducto: 'JGB OF.ESPUMA AFEITAR PIEL NORMAL 396 GRAMOS JGB S',
        precios: {
          frasco: { label: 'Frasco', precio: 34200 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Gillette / P&G',
    descripcion: 'Espuma de afeitado para piel sensible y normal.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Gillette Sensitive 175ml', precio: 14000 },
      { tipo: 'Gillette Regular 175ml',   precio: 13000 },
    ],
  },
  {
    id: 262,
    nombre: 'Toallas Húmedas Scott',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TOALLAS HUMEDAS PEQUEÑIN REDIEN NACIDO 80 UND',
        precios: {
          caja: { label: 'Caja', precio: 16900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TOALLAS HUMEDAS WINNY X 20 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Scott / Kimberly-Clark',
    descripcion: 'Toallas húmedas para uso corporal y facial. Refrescantes sin alcohol.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Scott x25 unds', precio: 5000 },
    ],
  },
  {
    id: 263,
    nombre: 'Protectores Diarios Nosotras',
    laboratorios: {
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PROTECTORES DIARIOS NOSOTRAS MULTIESTILO X 150UND',
        precios: {
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PROT.NOSOTRAS DIARIOS LARGOS 15 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 4200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'KOTEX PROTECTORES DIARIOS  BIG PACK X150 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 21500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Nosotras / Familia',
    descripcion: 'Protectores diarios ultradelgados con malla suave.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Nosotras Diarios x40 unds', precio: 9000 },
    ],
  },
  {
    id: 264,
    nombre: 'Pañitos Húmedos Huggies',
    laboratorios: {
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PANITOS HUMEDOS PEQUENIN ALOE VER.24 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 3900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑITOS HUMEDOS PEQUEÑIN X  300 UND',
        precios: {
          caja: { label: 'Caja', precio: 33000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Huggies / Kimberly-Clark',
    descripcion: 'Toallitas húmedas para bebé con aloe vera. Suaves y sin parabenos.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Huggies Natural Care x100', precio: 16000 },
      { tipo: 'Huggies Recién Nacido x48', precio: 10000 },
    ],
  },
  {
    id: 265,
    nombre: 'Talco Mexsana',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'TALCO MEXSANA AVENA 300GR.',
        precios: {
          unidad: { label: 'Unidad', precio: 21500 },
          caja: { label: 'Caja', precio: 25500 },
          frasco: { label: 'Frasco', precio: 13900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TALCO MEXSANA LEIDY POR DOS TARROS PROMO',
        precios: {
          caja: { label: 'Caja', precio: 16200 },
          par: { label: 'Par', precio: 20500 },
          unidad: { label: 'Unidad', precio: 11500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Mexsana / J&J',
    descripcion: 'Talco medicinal antipúdico. Previene rozaduras e irritaciones.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Mexsana 100g', precio: 10000 },
    ],
  },
  {
    id: 266,
    nombre: 'Talco Yardley',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'TALCO JJ BABY ORIGINAL 200 GR',
        precios: {
          unidad: { label: 'Unidad', precio: 24000 },
          caja: { label: 'Caja', precio: 13000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TALCO YODORA 60 GR',
        precios: {
          unidad: { label: 'Unidad', precio: 9000 },
          estuche: { label: 'Estuche', precio: 26500 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'TALCO MEXSANA AVENA 300GR.',
        precios: {
          unidad: { label: 'Unidad', precio: 21500 },
          caja: { label: 'Caja', precio: 25500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TALCO MEXSANA LEIDY POR DOS TARROS PROMO',
        precios: {
          caja: { label: 'Caja', precio: 16200 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'OFT TALCO REXONA  PRECIO ESPECIAL 180G+55G',
        precios: {
          caja: { label: 'Caja', precio: 21000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Yardley',
    descripcion: 'Talco corporal perfumado para frescura y suavidad todo el día.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Yardley English Lavender 150g', precio: 10000 },
    ],
  },
  {
    id: 267,
    nombre: 'Cotonetes JGB',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'COTONETES COPITO FLEXIBLE ALGODON JOHNSON Y JOHNSO',
        precios: {
          caja: { label: 'Caja', precio: 14700 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'COPITOS COTONETES  X  75 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 9700 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'JGB',
    descripcion: 'Hisopos de algodón para higiene ótica y desmaquillado suave.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'JGB x100 unds', precio: 3500 },
    ],
  },
  {
    id: 268,
    nombre: 'Algodón JGB Premium',
    laboratorios: {
      mead_johnson_nutriti: {
        nombre: 'MEAD JOHNSON NUTRITION',
        nombreProducto: 'ENFAMIL PREMIUM 1 375 GR',
        precios: {
          tarro: { label: 'Tarro', precio: 53500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ALGODON ZIG ZAG MK 50 GR',
        precios: {
          paquete: { label: 'Paquete', precio: 41500 },
          unidad: { label: 'Unidad', precio: 4200 },
        },
      },
      medical_supplies_cor: {
        nombre: 'MEDICAL SUPPLIES CORP S.A',
        nombreProducto: 'VENDA ALGODON LAMINADO MEDICAL 5X5',
        precios: {
          paquete: { label: 'Paquete', precio: 3500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ALGODON POMOS 100 GR JGB',
        precios: {
          paquete: { label: 'Paquete', precio: 7200 },
        },
      },
      option_s_a: {
        nombre: 'OPTION S.A.',
        nombreProducto: 'COPITO  MEDICARE  ALGODON X 50 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 4800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'COTONETES COPITO FLEXIBLE ALGODON JOHNSON Y JOHNSO',
        precios: {
          caja: { label: 'Caja', precio: 14700 },
        },
      },
      copidrogas: {
        nombre: 'COPIDROGAS',
        nombreProducto: 'AMOROSITO PROM APLICADOR ALGODON COOPIDROGAS',
        precios: {
          frasco: { label: 'Frasco', precio: 4200 },
        },
      },
      jgb_s_a: {
        nombre: 'JGB S.A.',
        nombreProducto: 'ALGODON JGB  25G  X7UNDS',
        precios: {
          caja: { label: 'Caja', precio: 20000 },
          unidad: { label: 'Unidad', precio: 2900 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'JGB',
    descripcion: 'Algodón hidrófilo premium en rollo y discos. Uso médico y cosmético.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'JGB Rollo 50g',  precio: 5000 },
      { tipo: 'JGB Discos x80', precio: 7000 },
    ],
  },
  {
    id: 269,
    nombre: 'Gel Antibacterial',
    laboratorios: {
      recamier_s_a: {
        nombre: 'RECAMIER S.A.',
        nombreProducto: 'DTE.DEOPIES ANTIBACTERIAL SPRAY 260 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13500 },
          caja: { label: 'Caja', precio: 32900 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'OFT MEXSANA PROM ANTIBACTERIAL SURT 2X260ML',
        precios: {
          paquete: { label: 'Paquete', precio: 32500 },
          unidad: { label: 'Unidad', precio: 17900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DTE BARRA REXONA MOTION SENSE ANTIBACTERIAL',
        precios: {
          caja: { label: 'Caja', precio: 15900 },
          par: { label: 'Par', precio: 35000 },
          unidad: { label: 'Unidad', precio: 18500 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'TOALLITA HUMEDA. PEQUEÑIN ANTIBACTERIAL  ALOE 40 U',
        precios: {
          caja: { label: 'Caja', precio: 5400 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'DTE REXONA   SPRAY  ANTIBACTERIAL        ROJO',
        precios: {
          caja: { label: 'Caja', precio: 18900 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'JABON DOVE ANTIBACTERIAL ADULTOS CUIDA/PROTEGE BAR',
        precios: {
          caja: { label: 'Caja', precio: 4000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'OFT TALCO YODORA ANTIBACTERIAL X 120G + 90G',
        precios: {
          caja: { label: 'Caja', precio: 19600 },
          frasco: { label: 'Frasco', precio: 19000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Dermo / Protex',
    descripcion: 'Gel de alcohol 70% para desinfección de manos sin agua.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Dermo Gel 75ml',  precio: 4000 },
      { tipo: 'Dermo Gel 250ml', precio: 8000 },
    ],
  },
  {
    id: 270,
    nombre: 'Alcohol Glicerinado 70%',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ALCOHOL MK X 350 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5900 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LISTERINE CONTROL CALCULO ZERO ALCOHOL 500 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LISTERINE COOL MINT ZERO ALCOHOL X 360 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 15000 },
          caja: { label: 'Caja', precio: 3800 },
          unidad: { label: 'Unidad', precio: 12500 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'ENJ.COLGATE PERIOGARD SIN ALCOHOL 250 ML',
        precios: {
          caja: { label: 'Caja', precio: 30500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Disanfer / LP',
    descripcion: 'Alcohol antiséptico con glicerina. Desinfecta sin resecar la piel.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Alcohol Glicerinado 250ml', precio: 7000  },
      { tipo: 'Alcohol Glicerinado 500ml', precio: 12000 },
    ],
  },
  {
    id: 271,
    nombre: 'Crema Nivea Soft',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA CORPORAL NIVEA SOFT MILK 1 LITRO',
        precios: {
          tarro: { label: 'Tarro', precio: 41900 },
        },
      },
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CREMA NIVEA BODY SOFT MILK PIEL SECA 250 ML',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
          tarro: { label: 'Tarro', precio: 32000 },
          frasco: { label: 'Frasco', precio: 31000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Nivea / Beiersdorf',
    descripcion: 'Hidratación ligera con aceite de jojoba. Textura no grasa.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Nivea Soft 75ml', precio: 12000 },
    ],
  },
  {
    id: 272,
    nombre: 'Bálsamo Labial Nivea',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NIVEA LABIALBLACKBERRY SHINE',
        precios: {
          caja: { label: 'Caja', precio: 14900 },
          unidad: { label: 'Unidad', precio: 16200 },
        },
      },
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'NIVEA PROTECTOR LABIAL MED REPAIR 4.8G',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Nivea / Beiersdorf',
    descripcion: 'Bálsamo labial con manteca de karité y vitamina E. Hidratación 24h.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Nivea Essential Care 4.8g', precio: 6000 },
      { tipo: 'Nivea Strawberry 4.8g',    precio: 6000 },
    ],
  },
  {
    id: 273,
    nombre: 'Protector Solar Umbrella',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PROTECTOR SOLAR ARAWAK 10GR 60UVA-UVB X8SBS',
        precios: {
          ristra: { label: 'Ristra', precio: 16000 },
          unidad: { label: 'Unidad', precio: 2500 },
          caja: { label: 'Caja', precio: 38000 },
        },
      },
      pronabell_sas: {
        nombre: 'PRONABELL SAS',
        nombreProducto: 'SUNDARK GEL ADULTO PROTECTOR SOLAR SPF60+',
        precios: {
          caja: { label: 'Caja', precio: 25500 },
          ristra: { label: 'Ristra', precio: 1 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      meicys: {
        nombre: 'MEICYS',
        nombreProducto: 'PROTECTOR SOLAR GUAJIRO FACT 50',
        precios: {
          frasco: { label: 'Frasco', precio: 18900 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'SUNDOWN PROTECTOR SOLAR FPS 50 200 MILILITROS JOHN',
        precios: {
          caja: { label: 'Caja', precio: 56000 },
        },
      },
      edgewell_personal_ca: {
        nombre: 'EDGEWELL PERSONAL CARE CO',
        nombreProducto: 'BANANA BOAT LOCION PROTECTOR SOLAR FPS 50 180 MILI',
        precios: {
          caja: { label: 'Caja', precio: 32500 },
        },
      },
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'NIVEA PROTECTOR SOLAR PIEL DELICADA FPS60 125 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 31000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Umbrella / TQ',
    descripcion: 'Bloqueador solar SPF 50+ formulado para el clima colombiano.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Umbrella SPF50+ 120ml', precio: 22000 },
      { tipo: 'Umbrella SPF70+ 60ml',  precio: 16000 },
    ],
  },
  {
    id: 274,
    nombre: 'Protector Solar Banana Boat',
    laboratorios: {
      edgewell_personal_ca: {
        nombre: 'EDGEWELL PERSONAL CARE CO',
        nombreProducto: 'BANANA BOAT LOCION PROTECTOR SOLAR FPS 50 180 MILI',
        precios: {
          caja: { label: 'Caja', precio: 32500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PROTECTOR SOLAR BANANA BOAT   KIDS SPORT  180MG',
        precios: {
          caja: { label: 'Caja', precio: 32500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Banana Boat / Edgewell',
    descripcion: 'Protector solar resistente al agua. Protección UVA/UVB.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Banana Boat SPF50 240ml', precio: 28000 },
      { tipo: 'Banana Boat Kids SPF50+', precio: 30000 },
    ],
  },
  {
    id: 275,
    nombre: 'Protector Solar Nivea Sun',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'NIVEA PROTECTOR SOLAR PIEL DELICADA FPS60 125 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 31000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PROTECTOR SOLAR NIVEA SUN SPF 70 X 200ML',
        precios: {
          caja: { label: 'Caja', precio: 41000 },
          blister: { label: 'Blíster', precio: 35000 },
          par: { label: 'Par', precio: 65000 },
          ristra: { label: 'Ristra', precio: 16000 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      pronabell_sas: {
        nombre: 'PRONABELL SAS',
        nombreProducto: 'SUNDARK GEL ADULTO PROTECTOR SOLAR SPF60+',
        precios: {
          caja: { label: 'Caja', precio: 25500 },
        },
      },
      meicys: {
        nombre: 'MEICYS',
        nombreProducto: 'PROTECTOR SOLAR GUAJIRO FACT 50',
        precios: {
          frasco: { label: 'Frasco', precio: 18900 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'SUNDOWN PROTECTOR SOLAR FPS 50 200 MILILITROS JOHN',
        precios: {
          caja: { label: 'Caja', precio: 56000 },
        },
      },
      edgewell_personal_ca: {
        nombre: 'EDGEWELL PERSONAL CARE CO',
        nombreProducto: 'BANANA BOAT LOCION PROTECTOR SOLAR FPS 50 180 MILI',
        precios: {
          caja: { label: 'Caja', precio: 32500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Nivea / Beiersdorf',
    descripcion: 'Loción solar con tecnología UV Dry Protect. No grasa.',
    imagen: imgCui(),
    tags: [T.nuevo],
    variantes: [
      { tipo: 'Nivea Sun SPF50+ 200ml', precio: 32000 },
    ],
  },

  /* ─────────────────────────────────────────────────────────
     3. BEBÉ Y MAMÁ (IDs 301+) — SIN CAMBIOS
     ───────────────────────────────────────────────────────── */
  {
    id: 301,
    nombre: 'Pañales Winny Pants',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY PANTS ET 5 X 30 UND',
        precios: {
          caja: { label: 'Caja', precio: 46500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY PANTS ETAPA 4 X 50 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Winny',
    descripcion: 'Pañal tipo pants para bebés que ya caminan. Fácil de poner y quitar.',
    imagen: imgBeb(),
    tags: [T.vendido, T.nuevo],
    variantes: [
      { tipo: 'Winny Pants ET 5 x30 unds', precio: 24000 },
      { tipo: 'Content Medical x10 T.M.',  precio: 12000 },
      { tipo: 'Content Medical x10 T.L.',  precio: 12000 },
    ],
  },
  {
    id: 302,
    nombre: "Shampoo Johnson's Baby",
    categoria: 'Bebé y Mamá',
    marca: "Johnson's / J&J",
    descripcion: 'Fórmula No Más Lágrimas. Suave para el cabello del bebé.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Surtido x12 sobres', precio: 10000 },
    ],
  },
  {
    id: 303,
    nombre: 'Leche Nestogeno',
    laboratorios: {
      nestle_de_colombia_s: {
        nombre: 'NESTLE DE COLOMBIA S.A.',
        nombreProducto: 'LECHE NESTOGENO ESTAPA 2 POR   1.100   MAXILATA',
        precios: {
          tarro: { label: 'Tarro', precio: 75000 },
          bolsa: { label: 'Bolsa', precio: 9900 },
          caja: { label: 'Caja', precio: 70900 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'JABON DOVE LECHE DE COCO X 90 GR',
        precios: {
          caja: { label: 'Caja', precio: 3900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LECHE DE MAGNESIA 120 ML MK',
        precios: {
          frasco: { label: 'Frasco', precio: 10200 },
          caja: { label: 'Caja', precio: 26400 },
        },
      },
      aspen_colombiana_sas: {
        nombre: 'ASPEN COLOMBIANA SAS',
        nombreProducto: 'LECHE DE MAGNESIA PHILLIPS 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 15500 },
          caja: { label: 'Caja', precio: 38700 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'EXTRACTOR DE LECHE CORCHITO',
        precios: {
          caja: { label: 'Caja', precio: 10600 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Nestlé',
    descripcion: 'Fórmula con 25 vitaminas y minerales para bebés.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Nestogeno 25 Vit. y Miner. 135g', precio: 14000 },
    ],
  },
  {
    id: 304,
    nombre: 'Vitamina D3 Bebé',
    laboratorios: {
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'VITAMINA E 400 U I 100 CAPSULAS COLMED',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 38000 },
          frasco: { label: 'Frasco', precio: 21500 },
        },
      },
      hartung_y_cia_s_a: {
        nombre: 'HARTUNG Y CIA S.A.',
        nombreProducto: 'REMOVEDOR LANDER VITAMINA E 35 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX BEBES 60 ML JARABE',
        precios: {
          frasco: { label: 'Frasco', precio: 17300 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'VITAMINA B12 1 ML 25 AMPOLLAS EC',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4900 },
          caja: { label: 'Caja', precio: 84000 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'CLORURO DE MAGNESIO + VITAMINA D 50 CAP',
        precios: {
          frasco: { label: 'Frasco', precio: 25000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'VITAMINA C PEDIATRICA 30 ML CEREZA',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ENAT 400 UI VITAMINA E  X30 CAPS BLANDA',
        precios: {
          caja: { label: 'Caja', precio: 24000 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'BIOCAR E VITAMINA E 400 UI UNIDAD(ES) INTERNACIONA',
        precios: {
          blister: { label: 'Blíster', precio: 9500 },
          caja: { label: 'Caja', precio: 14429 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Trenker',
    descripcion: '400UI en gotas para lactantes. Previene el raquitismo.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Vitamina D3 bebé gotas 400UI 10ml', precio: 22000 },
    ],
  },
  {
    id: 305,
    nombre: 'Ibuprofeno Infantil 2%',
    laboratorios: {
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'IBUPROFENO SUSPENSION 120 ML AG',
        precios: {
          frasco: { label: 'Frasco', precio: 9300 },
        },
      },
      bcn_medical_s_a: {
        nombre: 'BCN MEDICAl S.A',
        nombreProducto: 'KLAFEDOL IBUPROFENO 5 % PORCENTAJE GEL 50 GRAMOS B',
        precios: {
          caja: { label: 'Caja', precio: 19800 },
        },
      },
      nestle_de_colombia_s: {
        nombre: 'NESTLE DE COLOMBIA S.A.',
        nombreProducto: 'NESTUM CEREAL INFANTIL CERELAC 360 GRAMOS NESTLE D',
        precios: {
          caja: { label: 'Caja', precio: 19200 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'IBUPROFENO 400MG X60 TAB COASPHARMA',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 12000 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'NEXT GL IBUPROFENO 200 MG MILIGRAMO(S) CAPSULA DE',
        precios: {
          caja: { label: 'Caja', precio: 12800 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'LEGRIP IBUPROFENO 200 MG MILIGRAMO(S) CAPSULA DE G',
        precios: {
          blister: { label: 'Blíster', precio: 9500 },
          caja: { label: 'Caja', precio: 90000 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'SIMILAC2 FORMULA INFANTIL PROSENSITIVE 1.4 KG',
        precios: {
          caja: { label: 'Caja', precio: 138000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'MK / Lafrancol',
    descripcion: 'Suspensión oral 2% para fiebre y dolor en niños. Sabor frutal.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'MK 2% 60ml Fresa',  precio: 9500  },
      { tipo: 'MK 2% 100ml Fresa', precio: 14000 },
      { tipo: 'Lafrancol 2% 60ml', precio: 9000  },
    ],
  },
  {
    id: 306,
    nombre: 'Acetaminofén Gotas 150mg',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'ACETAMINOFEN 100 MG GOTAS 30 ML LP',
        precios: {
          frasco: { label: 'Frasco', precio: 4200 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'LP',
    descripcion: 'Solución oral 150mg por 5ml para bebés y niños pequeños.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Acetaminofén 150mg Jarabe 120ml LP', precio: 8000 },
    ],
  },
  {
    id: 307,
    nombre: 'Antigripal Infantil',
    laboratorios: {
      nestle_de_colombia_s: {
        nombre: 'NESTLE DE COLOMBIA S.A.',
        nombreProducto: 'NESTUM CEREAL INFANTIL CERELAC 360 GRAMOS NESTLE D',
        precios: {
          caja: { label: 'Caja', precio: 19200 },
        },
      },
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'SIMILAC2 FORMULA INFANTIL PROSENSITIVE 1.4 KG',
        precios: {
          caja: { label: 'Caja', precio: 138000 },
          tarro: { label: 'Tarro', precio: 70700 },
        },
      },
      mead_johnson_nutriti: {
        nombre: 'MEAD JOHNSON NUTRITION',
        nombreProducto: 'ENFAMIL FORMULA LACTEA INFANTIL 800 G',
        precios: {
          caja: { label: 'Caja', precio: 133400 },
        },
      },
      alpina_productos_ali: {
        nombre: 'ALPINA PRODUCTOS ALIMENTI',
        nombreProducto: 'FORMULA INFANTIL ALPINA BABY BASIC ETAPA 3-12 MESE',
        precios: {
          caja: { label: 'Caja', precio: 57000 },
        },
      },
      sanulac_nutricion: {
        nombre: 'SANULAC NUTRICION',
        nombreProducto: 'FORMULA INFANTIL S-26 ALULA GOLD ETAPA 0 A 6 MESES',
        precios: {
          caja: { label: 'Caja', precio: 44300 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'MK',
    descripcion: 'Jarabe antigripal para menores de 12 años.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'MK Jarabe 60ml',  precio: 9000  },
      { tipo: 'MK Jarabe 120ml', precio: 16000 },
    ],
  },
  {
    id: 308,
    nombre: 'Hierro Pediátrico',
    laboratorios: {
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX PEDIATRICO 20 TABLETAS MASTICABLE',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'BRONCOCHEM F PEDIATRICO JARABE 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29200 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'AMBROXOL PEDIATRICO 15 MG JARABE 120 ML LP',
        precios: {
          frasco: { label: 'Frasco', precio: 9000 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'HIERRO SACAROSA 100MG/5ML  SOL INY',
        precios: {
          caja: { label: 'Caja', precio: 33000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CANULA NASAL DE OXIGENO PARA USO PEDIATRICO 7METRO',
        precios: {
          caja: { label: 'Caja', precio: 14500 },
          unidad: { label: 'Unidad', precio: 16600 },
        },
      },
      inverfarma_sas: {
        nombre: 'INVERFARMA SAS',
        nombreProducto: 'KIT DE NEBULIZACION PEDIATRICO',
        precios: {
          unidad: { label: 'Unidad', precio: 15500 },
        },
      },
      mgcpharma: {
        nombre: 'MGCPHARMA',
        nombreProducto: 'HIES-TOFER PLUS HIERRO AMINOQUELADO + ACIDO FOLICO',
        precios: {
          caja: { label: 'Caja', precio: 45000 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'LASS SUPOSITORIO PEDIATRICO GLICERINA X 50UNDS',
        precios: {
          frasco: { label: 'Frasco', precio: 1 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Fer-In-Sol / LP',
    descripcion: 'Suplemento de hierro para prevención y tratamiento de anemia en niños.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Sulfato Ferroso 300mg x250 tab (LP)', precio: 18000 },
    ],
  },
  {
    id: 309,
    nombre: 'Pañales Huggies',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TOALLAS HUM HUGGIES X16UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 2600 },
        },
      },
      colombiana_kimberly_: {
        nombre: 'COLOMBIANA KIMBERLY COLPA',
        nombreProducto: 'CALZONCITO DESECHABLE PARA PISCINA   HUGGIES LITTL',
        precios: {
          paquete: { label: 'Paquete', precio: 35000 },
          unidad: { label: 'Unidad', precio: 3200 },
        },
      },
      distrisanchez_ltda: {
        nombre: 'DISTRISANCHEZ LTDA',
        nombreProducto: 'BEBEX PAÑALES DESECHABLES ETAPA 4 PAQ X 30 UN',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      huggies: {
        nombre: 'HUGGIES',
        nombreProducto: 'PANAL HUGGIES LITTLE SWIMMERS',
        precios: {
          paquete: { label: 'Paquete', precio: 34000 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Huggies / Kimberly-Clark',
    descripcion: 'Pañales con tecnología SkinCare. Mantienen la piel del bebé sana y seca.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Huggies Active Sec T.M x30', precio: 28000 },
      { tipo: 'Huggies Active Sec T.G x26', precio: 28000 },
      { tipo: 'Huggies Recién Nacido x24',  precio: 22000 },
    ],
  },
  {
    id: 310,
    nombre: 'Pañales Pequeñín',
    laboratorios: {
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PANITOS HUMEDOS PEQUENIN ALOE VER.24 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 3900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PANITOS HUM.PEQUENIN ORIG X 24 UND',
        precios: {
          unidad: { label: 'Unidad', precio: 4200 },
          caja: { label: 'Caja', precio: 16900 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAÑITOS HUM PEQUEÑIN NARICITAS X 20 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 4500 },
          paquete: { label: 'Paquete', precio: 22400 },
        },
      },
      distrisanchez_ltda: {
        nombre: 'DISTRISANCHEZ LTDA',
        nombreProducto: 'BEBEX PAÑALES DESECHABLES ETAPA 4 PAQ X 30 UN',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Pequeñín / Familia',
    descripcion: 'Pañal colombiano con triple protección.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Pequeñín T.M x30 unds', precio: 22000 },
      { tipo: 'Pequeñín T.G x28 unds', precio: 22000 },
    ],
  },
  {
    id: 311,
    nombre: 'Toallitas Winny',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TOALL WINNY ALOE Y VIT E X 100 UND',
        precios: {
          paquete: { label: 'Paquete', precio: 13000 },
          caja: { label: 'Caja', precio: 46200 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY  ULT SEC ETAPA 5   X50',
        precios: {
          caja: { label: 'Caja', precio: 77000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Winny',
    descripcion: 'Toallitas húmedas para bebé con extracto de manzanilla.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Winny x100 unds', precio: 12000 },
    ],
  },
  {
    id: 312,
    nombre: 'Crema Antipañalitis Nuby',
    laboratorios: {
      lab_cero_s_a: {
        nombre: 'LAB. CERO S.A.',
        nombreProducto: 'CREMA CERO ANTIPAÑALITIS  X 30G',
        precios: {
          caja: { label: 'Caja', precio: 9900 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ACID MANTLE BABY ANTIPAÑALITIS CREMA X 100 GR',
        precios: {
          caja: { label: 'Caja', precio: 35600 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Nuby',
    descripcion: 'Crema de óxido de zinc para prevenir y tratar la dermatitis del pañal.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Nuby Zinc 57g', precio: 16000 },
    ],
  },
  {
    id: 313,
    nombre: 'Crema Antipañalitis Desitin',
    laboratorios: {
      lab_cero_s_a: {
        nombre: 'LAB. CERO S.A.',
        nombreProducto: 'CREMA CERO ANTIPAÑALITIS  X 30G',
        precios: {
          caja: { label: 'Caja', precio: 9900 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ACID MANTLE BABY ANTIPAÑALITIS CREMA X 100 GR',
        precios: {
          caja: { label: 'Caja', precio: 35600 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Desitin / J&J',
    descripcion: 'Crema máxima concentración de zinc 40%. Barrera protectora comprobada.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Desitin Maximum Strength 56g', precio: 22000 },
    ],
  },
  {
    id: 314,
    nombre: 'Tarrito Gerber',
    laboratorios: {
      jgb_s_a: {
        nombre: 'JGB S.A.',
        nombreProducto: 'OFERTA TARRITO ROJO BOLSA PAGUE: 1000 G LLEVE: 200',
        precios: {
          caja: { label: 'Caja', precio: 63900 },
          tarro: { label: 'Tarro', precio: 15900 },
          unidad: { label: 'Unidad', precio: 9900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TARRITO ROJO   JGB  330 TRADICIONAL',
        precios: {
          caja: { label: 'Caja', precio: 21500 },
        },
      },
      colombina_s_a: {
        nombre: 'COLOMBINA S.A.',
        nombreProducto: 'COMPOTA     GERBER     SURTIDA     113 G',
        precios: {
          caja: { label: 'Caja', precio: 4700 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Gerber / Nestlé',
    descripcion: 'Papilla de frutas y vegetales para bebés mayores de 4 meses.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Gerber Frutas Surtido 113g', precio: 5000 },
      { tipo: 'Gerber Vegetales 113g',      precio: 5000 },
    ],
  },
  {
    id: 315,
    nombre: 'Compota Alpina Baby',
    laboratorios: {
      alpina_productos_ali: {
        nombre: 'ALPINA PRODUCTOS ALIMENTI',
        nombreProducto: 'COMPOTA ALPINA BABY GU  113G  SABORES SURT',
        precios: {
          caja: { label: 'Caja', precio: 4200 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Alpina',
    descripcion: 'Papilla de frutas colombianas para bebés. Sin azúcar añadida.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Alpina Baby Mango 100g', precio: 4200 },
      { tipo: 'Alpina Baby Pera 100g',  precio: 4200 },
    ],
  },
  {
    id: 316,
    nombre: 'Fórmula NAN',
    laboratorios: {
      mead_johnson_nutriti: {
        nombre: 'MEAD JOHNSON NUTRITION',
        nombreProducto: 'ENFAMIL FORMULA LACTEA CONFORT 0 12 MES 375 GRAMOS',
        precios: {
          caja: { label: 'Caja', precio: 49000 },
        },
      },
      nestle_de_colombia_s: {
        nombre: 'NESTLE DE COLOMBIA S.A.',
        nombreProducto: 'NAN FORMULA LACTEA 2 POLVO 1.1 KILOGRAMOS NESTLE D',
        precios: {
          caja: { label: 'Caja', precio: 96500 },
        },
      },
      alpina_productos_ali: {
        nombre: 'ALPINA PRODUCTOS ALIMENTI',
        nombreProducto: 'ALPINA FORMULA LACTEA 2 BABY 900 GRAMOS ALPINA PRO',
        precios: {
          caja: { label: 'Caja', precio: 62100 },
        },
      },
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'SIMILAC1 FORMULA ETAPA 1 400GR',
        precios: {
          tarro: { label: 'Tarro', precio: 71600 },
          caja: { label: 'Caja', precio: 138000 },
        },
      },
      aspen_colombiana_sas: {
        nombre: 'ASPEN COLOMBIANA SAS',
        nombreProducto: 'S 26 FORMULA LACTEA GOLD ETAPA 1  900 GRAMOS ASPEN',
        precios: {
          caja: { label: 'Caja', precio: 90000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'NAN / Nestlé',
    descripcion: 'Fórmula maternizada con probióticos para el desarrollo óptimo del lactante.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'NAN 1 Pro 400g (0-6 meses)',  precio: 42000 },
      { tipo: 'NAN 2 Pro 400g (6-12 meses)', precio: 42000 },
    ],
  },
  {
    id: 317,
    nombre: 'Fórmula Similac',
    laboratorios: {
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'SIMILAC1 FORMULA ETAPA 1 400GR',
        precios: {
          tarro: { label: 'Tarro', precio: 71600 },
          caja: { label: 'Caja', precio: 138000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Similac / Abbott',
    descripcion: 'Fórmula de inicio con HMO (oligosacáridos de leche humana).',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Similac Eye-Q Plus 400g', precio: 48000 },
    ],
  },
  {
    id: 318,
    nombre: 'Tetero Avent',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BIBERON PHILIPS AVENT ANTI-COLICO X 9 ONZAS',
        precios: {
          caja: { label: 'Caja', precio: 48900 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Philips Avent',
    descripcion: 'Biberón anticólico natural con tetina de flujo lento.',
    imagen: imgBeb(),
    tags: [T.nuevo],
    variantes: [
      { tipo: 'Avent Natural 125ml', precio: 28000 },
      { tipo: 'Avent Natural 260ml', precio: 32000 },
    ],
  },
  {
    id: 319,
    nombre: "Tetero Dr. Brown's",
    categoria: 'Bebé y Mamá',
    marca: "Dr. Brown's",
    descripcion: "Biberón con sistema de ventilación interno. Reduce cólicos y gases.",
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: "Dr. Brown's Original 150ml", precio: 32000 },
    ],
  },
  {
    id: 320,
    nombre: 'Chupo Nuby',
    laboratorios: {
      inplasco_ltda: {
        nombre: 'INPLASCO LTDA',
        nombreProducto: 'CHUPO ENTRETENCION NINA ANIMALES PATICOS',
        precios: {
          caja: { label: 'Caja', precio: 8200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CHUPO ENTRETENCION C/TAPA PATICO S',
        precios: {
          caja: { label: 'Caja', precio: 10100 },
          unidad: { label: 'Unidad', precio: 2800 },
          paquete: { label: 'Paquete', precio: 16500 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Nuby',
    descripcion: 'Chupo de silicona flexible que imita la forma natural del pecho materno.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Nuby Silicona 0-6m', precio: 14000 },
    ],
  },
  {
    id: 321,
    nombre: 'Chupo Avent',
    laboratorios: {
      inplasco_ltda: {
        nombre: 'INPLASCO LTDA',
        nombreProducto: 'CHUPO ENTRETENCION NINA ANIMALES PATICOS',
        precios: {
          caja: { label: 'Caja', precio: 8200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CHUPO ENTRETENCION C/TAPA PATICO S',
        precios: {
          caja: { label: 'Caja', precio: 10100 },
          unidad: { label: 'Unidad', precio: 2800 },
          paquete: { label: 'Paquete', precio: 16500 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Philips Avent',
    descripcion: 'Chupete soothie de silicona. Sin BPA.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Avent Soothie 0-6m x2', precio: 20000 },
    ],
  },
  {
    id: 322,
    nombre: "Talco Johnson's Baby",
    categoria: 'Bebé y Mamá',
    marca: "Johnson's / J&J",
    descripcion: 'Talco suave para bebé con fórmula sin perfume.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: "Johnson's Baby Talco 100g", precio: 9000 },
    ],
  },
  {
    id: 323,
    nombre: "Jabón Johnson's Baby",
    categoria: 'Bebé y Mamá',
    marca: "Johnson's / J&J",
    descripcion: 'Jabón líquido en barra suave para la piel delicada del bebé.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: "Johnson's Baby Barra 75g", precio: 7500 },
    ],
  },
  {
    id: 324,
    nombre: 'Colonia Arrurrú',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'COLONIA ARRURRU FSCO X 60ML',
        precios: {
          frasco: { label: 'Frasco', precio: 9200 },
          caja: { label: 'Caja', precio: 11800 },
        },
      },
      belleza_express_ltda: {
        nombre: 'BELLEZA EXPRESS LTDA',
        nombreProducto: 'COLONIA ARRURRU ORIGINAL NIÑA X 30ML',
        precios: {
          caja: { label: 'Caja', precio: 7700 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Arrurrú',
    descripcion: 'Colonia clásica para bebé con fragancia delicada.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Arrurrú Colonia 100ml', precio: 12000 },
      { tipo: 'Arrurrú Colonia 250ml', precio: 22000 },
    ],
  },
  {
    id: 325,
    nombre: 'Crema Arrurrú',
    laboratorios: {
      belleza_express_ltda: {
        nombre: 'BELLEZA EXPRESS LTDA',
        nombreProducto: 'ARRURRU CREMA  DE AVENA 400 ML',
        precios: {
          caja: { label: 'Caja', precio: 16900 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'DES LADY TALC PRACTI CREMA X 30 GRS',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA P.PEINAR SAVITAL BIOTINA 275 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSON BABY CREMA  PARA PEINAR 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'DTE BALANCE CREMA DUOS .PRO/EX.NOR. X 16 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CREMA FORZ 24 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 48000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Arrurrú',
    descripcion: 'Crema humectante para bebé con manteca de cacao.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Arrurrú Crema 200ml', precio: 14000 },
    ],
  },
  {
    id: 326,
    nombre: 'Pañitos Pequeñín',
    laboratorios: {
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PANITOS HUMEDOS PEQUENIN ALOE VER.24 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 3900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PANITOS HUM.PEQUENIN ORIG X 24 UND',
        precios: {
          unidad: { label: 'Unidad', precio: 4200 },
          caja: { label: 'Caja', precio: 33000 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAÑITOS HUM PEQUEÑIN NARICITAS X 20 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 4500 },
          paquete: { label: 'Paquete', precio: 22400 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Pequeñín / Familia',
    descripcion: 'Toallitas húmedas colombianas con toque de manzanilla.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Pequeñín x80 unds', precio: 10000 },
    ],
  },
  {
    id: 327,
    nombre: 'Mordederas para Bebé',
    categoria: 'Bebé y Mamá',
    marca: 'Nuby / Surtido',
    descripcion: 'Morderón de silicona para aliviar la dentición del bebé.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Mordedera Silicona Surtida x1', precio: 12000 },
    ],
  },
  {
    id: 328,
    nombre: 'Vasos Entrenadores',
    categoria: 'Bebé y Mamá',
    marca: 'Nuby / Avent',
    descripcion: 'Vaso de transición con pitillo y asas para bebés mayores de 6 meses.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Vaso Entrenador 240ml', precio: 16000 },
    ],
  },
  {
    id: 329,
    nombre: 'Baberos Impermeables',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CURAS HANSAPLAST IMPERMEABLES  PIEL 100 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 13000 },
          par: { label: 'Par', precio: 300 },
          unidad: { label: 'Unidad', precio: 200 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Surtido',
    descripcion: 'Baberos impermeables de silicona con bolsillo atrapa-comida.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Babero Silicona x1',    precio: 14000 },
      { tipo: 'Set Baberos Tela x3',   precio: 16000 },
    ],
  },

  /* ─────────────────────────────────────────────────────────
     4. BELLEZA (IDs 401+) — SIN CAMBIOS
     ───────────────────────────────────────────────────────── */
  {
    id: 401,
    nombre: 'Nutribela Tratamiento Capilar',
    laboratorios: {
      quala_s_a: {
        nombre: 'QUALA S.A.',
        nombreProducto: 'NUTRIBELA10 TRATAMIENTO CAPILAR 300 MILILITROS REP',
        precios: {
          caja: { label: 'Caja', precio: 17500 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'NUTRIBELA10 TRATAMIENTO TERMOPROTECCION 300ML  PRO',
        precios: {
          caja: { label: 'Caja', precio: 17500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NUTRIBELA 15  SURTIDOS TRAT CAPILAR  27ML X 12SBS',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'MINOXIDIL FORTE 5% TRATAMIENTO CAPILAR X 60ML',
        precios: {
          caja: { label: 'Caja', precio: 50600 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Nutribela',
    descripcion: 'Tratamiento capilar intensivo en sachet.',
    imagen: imgBel(),
    tags: [T.oferta],
    variantes: [
      { tipo: 'Nutribela 15 Surtidos 27ml x12 sbs', precio: 10000 },
      { tipo: 'Shampoo Nutribela 18ml x12 sobres',  precio: 8000  },
    ],
  },
  {
    id: 402,
    nombre: 'Mascarilla Capilar Naissant',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MASCARILLA MATIZANTE NAISSANT SURTIDO 300ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29000 },
          caja: { label: 'Caja', precio: 69000 },
          unidad: { label: 'Unidad', precio: 5800 },
        },
      },
      naisant: {
        nombre: 'Naisant',
        nombreProducto: 'NAISSANT MASCARILLA REVITALIZANTE COCO 300 ML LAB',
        precios: {
          tarro: { label: 'Tarro', precio: 18200 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Naissant',
    descripcion: 'Mascarilla matizante intensiva.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Mascarilla Matizante Surt. x12 unds', precio: 12000 },
    ],
  },
  {
    id: 403,
    nombre: 'Bloqueador Solar',
    laboratorios: {
      copidrogas: {
        nombre: 'COPIDROGAS',
        nombreProducto: 'BALAO BLOQUEADOR SOLAR CREMA 12G',
        precios: {
          caja: { label: 'Caja', precio: 27000 },
        },
      },
      recamier_s_a: {
        nombre: 'RECAMIER S.A.',
        nombreProducto: 'BLOQUEADOR SOLAR TANGA EN BARRA 13G',
        precios: {
          caja: { label: 'Caja', precio: 20400 },
          blister: { label: 'Blíster', precio: 3000 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LUBRIDERM SOLAR FPS 15 X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 17000 },
          tarro: { label: 'Tarro', precio: 49800 },
          blister: { label: 'Blíster', precio: 3800 },
          caja: { label: 'Caja', precio: 38400 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PROTECTOR SOLAR ARAWAK 10GR 60UVA-UVB X8SBS',
        precios: {
          ristra: { label: 'Ristra', precio: 16000 },
          unidad: { label: 'Unidad', precio: 2500 },
          caja: { label: 'Caja', precio: 38000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Sundark / Arakuoma / Sundown',
    descripcion: 'Protector solar en sobres individuales para playa, piscina y uso diario.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sundark Adultos x12 sbs 10g',         precio: 10000 },
      { tipo: 'Arakuoma +Vit E Hydragel x12 sbs',    precio: 10000 },
      { tipo: 'Bloq. Tanga SPF100 x12 sbs',          precio: 12000 },
      { tipo: 'Sundown Playa/Piscina SPF70 x12 sbs', precio: 12000 },
    ],
  },
  {
    id: 404,
    nombre: 'Esmaltes de Uñas',
    laboratorios: {
      disanfer_y_chenier: {
        nombre: 'Disanfer y Chenier',
        nombreProducto: 'PEGANTE UÑAS ADORO 3 GRS',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
          paquete: { label: 'Paquete', precio: 1500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CORTAUÑAS GRANDE TRIM U.S.A.',
        precios: {
          caja: { label: 'Caja', precio: 24000 },
          unidad: { label: 'Unidad', precio: 2000 },
          paquete: { label: 'Paquete', precio: 2000 },
        },
      },
      laboratorio_de_cosme: {
        nombre: 'LABORATORIO DE COSMÉTICOS SHILHER S.A.S.',
        nombreProducto: 'ESMALTES COMERCIAL - ESCHARDOS SURTIDOS  SHILHER',
        precios: {
          frasco: { label: 'Frasco', precio: 4400 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Shilher / Comercial',
    descripcion: 'Esmaltes en variedad de colores y acabados.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Esmaltes Surtidos Shilher x1', precio: 2500 },
    ],
  },
  {
    id: 405,
    nombre: 'Limas de Uñas Lizmar',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LIZMAR  PLUS LIMAS  PARA UÑAS CAJA X 144',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 800 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Lizmar',
    descripcion: 'Limas desechables para uñas. Pack de 144 unidades para reventa.',
    imagen: imgBel(),
    tags: [T.oferta],
    variantes: [
      { tipo: 'Lizmar Plus Limas Caja x144 unds', precio: 18000 },
    ],
  },
  {
    id: 406,
    nombre: 'Crema Forz',
    laboratorios: {
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CREMA FORZ 24 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 48000 },
          frasco: { label: 'Frasco', precio: 32000 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'DES LADY TALC PRACTI CREMA X 30 GRS',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA P.PEINAR SAVITAL BIOTINA 275 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSON BABY CREMA  PARA PEINAR 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'DTE BALANCE CREMA DUOS .PRO/EX.NOR. X 16 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Forz',
    descripcion: 'Crema de tratamiento intensivo en sachet.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Crema Forz x24 sobres', precio: 10000 },
    ],
  },
  {
    id: 407,
    nombre: 'Nailen Polvo Tradicional',
    laboratorios: {
      lab_smart_s_a: {
        nombre: 'LAB. SMART S.A.',
        nombreProducto: 'POLVO NAILEN FILTRO SURTIDO X 1',
        precios: {
          unidad: { label: 'Unidad', precio: 10500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Nailen',
    descripcion: 'Polvo facial translúcido para el control de brillo.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Nailen Polvo Tradicional Surt. x1', precio: 5000 },
    ],
  },
  {
    id: 408,
    nombre: 'Agua Micelar Garnier',
    laboratorios: {
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'GARNIER AGUA MICELAR HIPOALERGENICO 100ML',
        precios: {
          caja: { label: 'Caja', precio: 10800 },
        },
      },
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'AGUA MICELAR NIVEA AGUA DE ROSAS 400 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 24300 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'AGUA MICELAR BASIC POMYS X250 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 10900 },
        },
      },
      babaria_colombia_sas: {
        nombre: 'BABARIA COLOMBIA SAS',
        nombreProducto: 'AGUA MICELAR BIFASICA',
        precios: {
          caja: { label: 'Caja', precio: 21000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NIVEA AGUA MICELAR ILUMINADORA 400 ML',
        precios: {
          caja: { label: 'Caja', precio: 31500 },
        },
      },
      garnier: {
        nombre: 'GARNIER',
        nombreProducto: 'AGUA MICELAR VITAMINA   C X  100 ML',
        precios: {
          caja: { label: 'Caja', precio: 13500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: "Garnier / L'Oréal",
    descripcion: 'Agua micelar todo en uno para limpieza y desmaquillaje suave.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Garnier Micelar 125ml', precio: 18000 },
      { tipo: 'Garnier Micelar 400ml', precio: 32000 },
    ],
  },
  {
    id: 409,
    nombre: 'Agua Micelar Nivea',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'AGUA MICELAR NIVEA AGUA DE ROSAS 400 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 24300 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NIVEA AGUA MICELAR ILUMINADORA 400 ML',
        precios: {
          caja: { label: 'Caja', precio: 31500 },
        },
      },
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'AGUA MICELAR DESMAQ.ORIGINAL 400 ML',
        precios: {
          caja: { label: 'Caja', precio: 28000 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'AGUA MICELAR BASIC POMYS X250 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 10900 },
        },
      },
      babaria_colombia_sas: {
        nombre: 'BABARIA COLOMBIA SAS',
        nombreProducto: 'AGUA MICELAR BIFASICA',
        precios: {
          caja: { label: 'Caja', precio: 21000 },
        },
      },
      garnier: {
        nombre: 'GARNIER',
        nombreProducto: 'AGUA MICELAR VITAMINA   C X  100 ML',
        precios: {
          caja: { label: 'Caja', precio: 13500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Nivea / Beiersdorf',
    descripcion: 'Agua micelar hidratante para piel sensible.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Nivea Micelar Sensitive 200ml', precio: 20000 },
    ],
  },
  {
    id: 410,
    nombre: 'Sérum Garnier Vitamina C',
    laboratorios: {
      babaria_colombia_sas: {
        nombre: 'BABARIA COLOMBIA SAS',
        nombreProducto: 'BABARIA SERUM VITAMINA C 30ML',
        precios: {
          caja: { label: 'Caja', precio: 36000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: "Garnier / L'Oréal",
    descripcion: 'Suero iluminador con vitamina C y niacinamida.',
    imagen: imgBel(),
    tags: [T.nuevo, T.vendido],
    variantes: [
      { tipo: 'Garnier Sérum Vit C 30ml', precio: 38000 },
    ],
  },
  {
    id: 411,
    nombre: "Sérum L'Oréal Revitalift",
    categoria: 'Belleza',
    marca: "L'Oréal",
    descripcion: 'Suero antiarrugas con ácido hialurónico puro al 1.5%.',
    imagen: imgBel(),
    tags: [T.nuevo],
    variantes: [
      { tipo: "L'Oréal Revitalift 1.5% HA 30ml", precio: 58000 },
    ],
  },
  {
    id: 412,
    nombre: 'Crema CeraVe',
    laboratorios: {
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'CERAVE CREMA MOISTURISING HIDRANTANTE PIEL SECA MU',
        precios: {
          caja: { label: 'Caja', precio: 46500 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'DES LADY TALC PRACTI CREMA X 30 GRS',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA P.PEINAR SAVITAL BIOTINA 275 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSON BABY CREMA  PARA PEINAR 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'DTE BALANCE CREMA DUOS .PRO/EX.NOR. X 16 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CREMA FORZ 24 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 48000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: "CeraVe / L'Oréal",
    descripcion: 'Crema hidratante con ceramidas y ácido hialurónico.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'CeraVe Moisturizing Cream 177ml',  precio: 62000 },
      { tipo: 'CeraVe Moisturizing Lotion 473ml', precio: 82000 },
    ],
  },
  {
    id: 413,
    nombre: 'Limpiador CeraVe',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'LIMPIADOR FACIAL DIARIO CREMA PONDS 50GR',
        precios: {
          unidad: { label: 'Unidad', precio: 14200 },
        },
      },
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'CERAVE CREMA MOISTURISING HIDRANTANTE PIEL SECA MU',
        precios: {
          caja: { label: 'Caja', precio: 46500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LIMPIADOR FACIAL VIT C  100G BIOAQUA',
        precios: {
          caja: { label: 'Caja', precio: 28000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: "CeraVe / L'Oréal",
    descripcion: 'Limpiador facial suave no comedogénico.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'CeraVe Hydrating Cleanser 236ml', precio: 55000 },
      { tipo: 'CeraVe Foaming Cleanser 236ml',   precio: 55000 },
    ],
  },
  {
    id: 414,
    nombre: 'Cetaphil Loción',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'MINOXIDIL FORTE 5% LOCION 60 ML MK',
        precios: {
          frasco: { label: 'Frasco', precio: 76900 },
        },
      },
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'ARNICA LOCION 30 MILILITROS',
        precios: {
          frasco: { label: 'Frasco', precio: 6200 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ACID MANTLE N LOCION 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 24000 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LUBRIDERM LOCION PIEL SENSIBLE 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13000 },
          tarro: { label: 'Tarro', precio: 24500 },
        },
      },
      lab_sorel_s_a: {
        nombre: 'LAB. SOREL S.A.',
        nombreProducto: 'SOREL LOCION FACIAL 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 17200 },
        },
      },
      belleza_express_ltda: {
        nombre: 'BELLEZA EXPRESS LTDA',
        nombreProducto: 'MENTICOL LOCION  AMARILLO   X  130 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 9800 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'CALADRYL LOCION 100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 18900 },
        },
      },
      quifarma: {
        nombre: 'QUIFARMA',
        nombreProducto: 'ACIDO RETINOICO 0.05 G GRAMO(S) LOCION 60 MILILITR',
        precios: {
          frasco: { label: 'Frasco', precio: 21800 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Cetaphil / Galderma',
    descripcion: 'Loción hidratante para piel seca y sensible.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Cetaphil Moisturizing Lotion 250ml', precio: 48000 },
    ],
  },
  {
    id: 415,
    nombre: 'Cetaphil Limpiador',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CETAPHIL CREMA HUMECT HIDRAT X250G',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'LIMPIADOR FACIAL DIARIO CREMA PONDS 50GR',
        precios: {
          unidad: { label: 'Unidad', precio: 14200 },
        },
      },
      galderma_de_colombia: {
        nombre: 'GALDERMA DE COLOMBIA S.A.',
        nombreProducto: 'CETAPHIL  CREMA HUMECT HIDRAT  X 453G',
        precios: {
          caja: { label: 'Caja', precio: 105000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Cetaphil / Galderma',
    descripcion: 'Limpiador suave sin jabón para rostro y cuerpo.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Cetaphil Gentle Skin Cleanser 250ml', precio: 48000 },
    ],
  },
  {
    id: 416,
    nombre: 'Eucerin Anti Pigment',
    categoria: 'Belleza',
    marca: 'Eucerin / Beiersdorf',
    descripcion: 'Crema con tiamidol y vitamina C. Reduce manchas oscuras.',
    imagen: imgBel(),
    tags: [T.nuevo],
    variantes: [
      { tipo: 'Eucerin Anti Pigment Day Cream 50ml', precio: 72000 },
    ],
  },
  {
    id: 417,
    nombre: 'Eucerin Aquaphor',
    categoria: 'Belleza',
    marca: 'Eucerin / Beiersdorf',
    descripcion: 'Ungüento reparador multi-uso para labios y piel irritada.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Eucerin Aquaphor 40ml', precio: 38000 },
    ],
  },
  {
    id: 418,
    nombre: 'Bloqueador ISDIN',
    laboratorios: {
      recamier_s_a: {
        nombre: 'RECAMIER S.A.',
        nombreProducto: 'BLOQUEADOR EN CREMA TANGA SUN ACTIVE RECAMIER',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
          unidad: { label: 'Unidad', precio: 3300 },
        },
      },
      copidrogas: {
        nombre: 'COPIDROGAS',
        nombreProducto: 'BALAO BLOQUEADOR SOLAR CREMA 12G',
        precios: {
          caja: { label: 'Caja', precio: 27000 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'BLOQUEADOR SUNDOWN FPS 70 X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 55900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TANGA BLOQUEADOR SOLA SPF 70 X 220ML',
        precios: {
          caja: { label: 'Caja', precio: 54000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'ISDIN',
    descripcion: 'Protector solar con textura fluida, invisible y antibrillo. SPF 50+.',
    imagen: imgBel(),
    tags: [T.nuevo],
    variantes: [
      { tipo: 'ISDIN Eryfotona AK-NMSC Fluid 50ml',   precio: 88000 },
      { tipo: 'ISDIN Fotoprotector Fusion Water 50ml', precio: 75000 },
    ],
  },
  {
    id: 419,
    nombre: 'Bloqueador La Roche-Posay',
    categoria: 'Belleza',
    marca: "La Roche-Posay / L'Oréal",
    descripcion: 'Protector solar ultra-ligero SPF 60.',
    imagen: imgBel(),
    tags: [T.nuevo],
    variantes: [
      { tipo: 'LRP Anthelios Fluid SPF60 50ml', precio: 80000 },
    ],
  },
  {
    id: 420,
    nombre: 'Mascarilla Facial Garnier',
    categoria: 'Belleza',
    marca: "Garnier / L'Oréal",
    descripcion: 'Mascarilla en hoja con ácido hialurónico.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Garnier Sheet Mask Hyaluronic x1', precio: 9000 },
      { tipo: 'Garnier Sheet Mask Vitamina C x1', precio: 9000 },
    ],
  },
  {
    id: 421,
    nombre: 'Mascarilla de Carbón',
    laboratorios: {
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'ASEPXIA MASCARILLA CARBON 30G',
        precios: {
          caja: { label: 'Caja', precio: 19800 },
        },
      },
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'BICARBONATO DE SODA 500 GR DISANFER',
        precios: {
          bolsa: { label: 'Bolsa', precio: 10300 },
          paquete: { label: 'Paquete', precio: 15000 },
          caja: { label: 'Caja', precio: 3200 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CREMA COLGATE  CARBON ATIVADO  X 75ML',
        precios: {
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BABARIA MASCARILLA DE ACEITE DE OLIVA',
        precios: {
          caja: { label: 'Caja', precio: 16800 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'CALFAFEM D CARBONATO DE  CALCIO 600MG+VIT D3 250',
        precios: {
          caja: { label: 'Caja', precio: 27000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Garnier / Genérico',
    descripcion: 'Mascarilla peel-off de carbón activado. Purifica y desobstruye los poros.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Mascarilla Carbón Peel-off 50ml', precio: 12000 },
    ],
  },
  {
    id: 422,
    nombre: 'Base Maybelline Fit Me',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BASE DE UÑAS FUERTES CAJA  MORADA',
        precios: {
          caja: { label: 'Caja', precio: 9600 },
          unidad: { label: 'Unidad', precio: 9200 },
        },
      },
      masglo: {
        nombre: 'MASGLO',
        nombreProducto: 'BASE MASGLO NUTRITIVA ROSADA',
        precios: {
          unidad: { label: 'Unidad', precio: 6500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: "Maybelline / L'Oréal",
    descripcion: 'Base de maquillaje de cobertura natural.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Maybelline Fit Me Matte Poreless 30ml', precio: 42000 },
    ],
  },
  {
    id: 423,
    nombre: 'Labial Maybelline Color Sensational',
    categoria: 'Belleza',
    marca: "Maybelline / L'Oréal",
    descripcion: 'Labial cremoso con color intenso y duración prolongada.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Maybelline Color Sensational x1', precio: 28000 },
    ],
  },
  {
    id: 424,
    nombre: 'Pestañina Vogue',
    laboratorios: {
      lab_vogue: {
        nombre: 'LAB VOGUE',
        nombreProducto: 'VOGUE PESTANINA ULTRA VOLUMEN NEGRO 9 GRAMOS LABOR',
        precios: {
          frasco: { label: 'Frasco', precio: 22500 },
          unidad: { label: 'Unidad', precio: 7900 },
          caja: { label: 'Caja', precio: 21000 },
        },
      },
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'VOGUE PESTAÑINA RESIST LARGA DURACION 36 H 9G',
        precios: {
          caja: { label: 'Caja', precio: 22500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: '2 PESTANINA LASH +DEL NEG',
        precios: {
          kit: { label: 'Kit', precio: 23900 },
        },
      },
      prebel: {
        nombre: 'PREBEL',
        nombreProducto: 'MAX FACTOR X PR.ESP.PESTANINA LASH MAKER MINI PREB',
        precios: {
          caja: { label: 'Caja', precio: 18500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Vogue / Cosmetics',
    descripcion: 'Máscara de pestañas colombiana. Volumen y longitud.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Vogue Volume Effect x1', precio: 22000 },
    ],
  },
  {
    id: 425,
    nombre: 'Polvo Compacto Vogue',
    laboratorios: {
      lab_vogue: {
        nombre: 'LAB VOGUE',
        nombreProducto: 'VOGUE POLVO COMPACTO SURTIDO 14G',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
      loreal_colombia_s_a: {
        nombre: 'LOREAL COLOMBIA S.A.',
        nombreProducto: 'RUBOR COMPACTO VOGUE SUPER FANTASTIC SURT 4G',
        precios: {
          caja: { label: 'Caja', precio: 5800 },
        },
      },
      productos_de_belleza: {
        nombre: 'PRODUCTOS DE BELLEZA ANA MARIA S.A',
        nombreProducto: 'POLVO COMPACTO ANA MARIA VERDE TONOS SURTIDOS',
        precios: {
          caja: { label: 'Caja', precio: 24900 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Vogue / Cosmetics',
    descripcion: 'Polvo compacto matificante para cara.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Vogue Polvo Compacto Surtido x1', precio: 20000 },
    ],
  },
  {
    id: 426,
    nombre: 'Removedor de Maquillaje',
    laboratorios: {
      hartung_y_cia_s_a: {
        nombre: 'HARTUNG Y CIA S.A.',
        nombreProducto: 'REMOVEDOR LANDER PROTEINA 35 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
      cerescos_sas: {
        nombre: 'CERESCOS SAS',
        nombreProducto: 'REMOVEDOR MAGGLO VIT E X 60 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 10200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'REMOVEDOR DE CUTICULA COSDY  X60ML',
        precios: {
          unidad: { label: 'Unidad', precio: 3900 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Nivea / Garnier',
    descripcion: 'Bifásico desmaquillante para ojos, labios y cara.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Nivea Removedor Bifásico 125ml', precio: 18000 },
    ],
  },
  {
    id: 427,
    nombre: 'Crema de Manos Nivea',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CREMA NIVEA 30 GR R.367',
        precios: {
          caja: { label: 'Caja', precio: 10500 },
          tarro: { label: 'Tarro', precio: 32000 },
          frasco: { label: 'Frasco', precio: 31000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Nivea / Beiersdorf',
    descripcion: 'Crema reparadora de manos con glicerina.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Nivea Soft Care Manos 75ml', precio: 10000 },
    ],
  },
  {
    id: 428,
    nombre: 'Exfoliante Facial St. Ives',
    laboratorios: {
      babaria_colombia_sas: {
        nombre: 'BABARIA COLOMBIA SAS',
        nombreProducto: 'GEL FACIAL EXFOLIANTE      ALOE   100 ML',
        precios: {
          caja: { label: 'Caja', precio: 25900 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'St. Ives / Unilever',
    descripcion: 'Exfoliante facial con extracto de albaricoque.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'St. Ives Fresh Skin Apricot 150ml', precio: 26000 },
    ],
  },
  {
    id: 429,
    nombre: 'Aceite Bio-Oil',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS ACEITE BABY SURT  100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
          caja: { label: 'Caja', precio: 33000 },
        },
      },
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'ACEITE MANZANILLA 25 ML 12 UDS DISANFER',
        precios: {
          frasco: { label: 'Frasco', precio: 2600 },
          paquete: { label: 'Paquete', precio: 14400 },
          unidad: { label: 'Unidad', precio: 2600 },
        },
      },
      lab_blofarma_de_colo: {
        nombre: 'LAB. BLOFARMA DE COLOMBIA',
        nombreProducto: 'ACEITE ALMENDRAS DR. SANA NATURAL 450 ML',
        precios: {
          tarro: { label: 'Tarro', precio: 14000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ACEITE DE ARGAN ISABELY  SPRAY  X  60ML',
        precios: {
          caja: { label: 'Caja', precio: 17700 },
          frasco: { label: 'Frasco', precio: 13500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Bio-Oil / Union-Swiss',
    descripcion: 'Aceite especializado para cicatrices, estrías y piel desigual.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Bio-Oil 60ml',  precio: 38000 },
      { tipo: 'Bio-Oil 125ml', precio: 65000 },
    ],
  },
  {
    id: 430,
    nombre: 'Crema Cicatricure',
    laboratorios: {
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'CICATRICURE ANTI-EDAD CREMA 60 GR',
        precios: {
          caja: { label: 'Caja', precio: 59000 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'DES LADY TALC PRACTI CREMA X 30 GRS',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA P.PEINAR SAVITAL BIOTINA 275 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSON BABY CREMA  PARA PEINAR 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'DTE BALANCE CREMA DUOS .PRO/EX.NOR. X 16 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Cicatricure / Genomma',
    descripcion: 'Crema para reducción de cicatrices y estrías.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Cicatricure Gold Lift 50g',  precio: 52000 },
      { tipo: 'Cicatricure Cicatrices 30g', precio: 38000 },
    ],
  },
  {
    id: 431,
    nombre: "Crema Pond's Clarant B3",
    categoria: 'Belleza',
    marca: "Pond's / Unilever",
    descripcion: 'Crema aclarante con niacinamida B3 y FPS 15.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: "Pond's Clarant B3 Normal/Seca 100g", precio: 22000 },
      { tipo: "Pond's Clarant B3 Grasa 100g",       precio: 22000 },
    ],
  },

  /* ─────────────────────────────────────────────────────────
     5. MERCADO Y HOGAR (IDs 501+) — SIN CAMBIOS
     ───────────────────────────────────────────────────────── */
  {
    id: 501,
    nombre: 'Agua Brisa',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'AGUA  BRISA 280 ML',
        precios: {
          canasta: { label: 'Canasta', precio: 12000 },
          unidad: { label: 'Unidad', precio: 1200 },
          botella: { label: 'Botella', precio: 1600 },
        },
      },
      coca_cola_femsa_s_a_: {
        nombre: 'COCA COLA FEMSA S.A DE.C.V',
        nombreProducto: 'BRISA AGUA PURA X1L',
        precios: {
          paca: { label: 'Paca', precio: 12000 },
          unidad: { label: 'Unidad', precio: 2400 },
          canasta: { label: 'Canasta', precio: 16200 },
          botella: { label: 'Botella', precio: 2600 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
      osa: {
        nombre: 'OSA',
        nombreProducto: 'AGUA OXIGENADA OSA X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 3900 },
        },
      },
      corpaul: {
        nombre: 'CORPAUL',
        nombreProducto: 'AGUA DESTILADA CORPAUL 500 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5200 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'PALETA ALOHA AGUA SURTIDA X 24 UND',
        precios: {
          caja: { label: 'Caja', precio: 31200 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AGUA OXIGENADA    X  120  ML',
        precios: {
          tarro: { label: 'Tarro', precio: 4800 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Brisa / Postobón',
    descripcion: 'Agua mineral natural. Con y sin gas en múltiples formatos.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Brisa 280ml',              precio: 1500 },
      { tipo: 'Brisa 600ml Natural',      precio: 2500 },
      { tipo: 'Brisa con Gas 600ml',      precio: 2800 },
      { tipo: 'Brisa Sabores 280ml Surt', precio: 2000 },
      { tipo: 'Brisa Sabores 600ml Surt', precio: 3000 },
      { tipo: 'Agua Cristal 1L',          precio: 3000 },
    ],
  },
  {
    id: 502,
    nombre: 'Gaseosa Coca-Cola',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GASEOSA COCA-COLA 400ML',
        precios: {
          canasta: { label: 'Canasta', precio: 30000 },
          unidad: { label: 'Unidad', precio: 3100 },
          caja: { label: 'Caja', precio: 65000 },
        },
      },
      coca_cola_femsa_s_a_: {
        nombre: 'COCA COLA FEMSA S.A DE.C.V',
        nombreProducto: 'GASEOSA COCA - COLA  250ML',
        precios: {
          canasta: { label: 'Canasta', precio: 21600 },
          botella: { label: 'Botella', precio: 2000 },
          paca: { label: 'Paca', precio: 56000 },
          caja: { label: 'Caja', precio: 8400 },
          six_pack: { label: 'Six Pack', precio: 18000 },
          unidad: { label: 'Unidad', precio: 3100 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Coca-Cola',
    descripcion: 'Refresco carbonatado en múltiples tamaños.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Coca-Cola 250ml', precio: 2000 },
      { tipo: 'Coca-Cola 400ml', precio: 2800 },
      { tipo: 'Coca-Cola 1.5L',  precio: 6500 },
    ],
  },
  {
    id: 503,
    nombre: 'Jugo Hit',
    laboratorios: {
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'NOXPIRIN F JUGO DIA MANDARINA GRA.24 SBS',
        precios: {
          caja: { label: 'Caja', precio: 38400 },
          unidad: { label: 'Unidad', precio: 2600 },
        },
      },
      coca_cola_femsa_s_a_: {
        nombre: 'COCA COLA FEMSA S.A DE.C.V',
        nombreProducto: 'JUGO DEL VALLE FRESH SURT 400ML',
        precios: {
          canasta: { label: 'Canasta', precio: 21600 },
          botella: { label: 'Botella', precio: 2000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'JUGO DEL VALLE  FRESH SABORES SURT  X 1.5 L',
        precios: {
          canasta: { label: 'Canasta', precio: 44400 },
          botella: { label: 'Botella', precio: 4600 },
        },
      },
      gaseosas_lux_sas: {
        nombre: 'GASEOSAS LUX SAS',
        nombreProducto: 'JUGO  HIT   SURTIDO X 500ML',
        precios: {
          caja: { label: 'Caja', precio: 3000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Hit / Postobón',
    descripcion: 'Jugo de fruta natural en variedad de sabores tropicales.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Hit Surtido 500ml', precio: 3500 },
    ],
  },
  {
    id: 504,
    nombre: 'Bebida Energizante Speed Max',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BEBIDA ENERGIZANTE SPEED MAX GRANDE 310 ML',
        precios: {
          canasta: { label: 'Canasta', precio: 45000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      quala_s_a: {
        nombre: 'QUALA S.A.',
        nombreProducto: 'VIVE100 BEBIDA ENERGIZANTE 240ML',
        precios: {
          caja: { label: 'Caja', precio: 10200 },
          unidad: { label: 'Unidad', precio: 2000 },
          six_pack: { label: 'Six Pack', precio: 17000 },
        },
      },
      gaseosas_lux_sas: {
        nombre: 'GASEOSAS LUX SAS',
        nombreProducto: 'BEBIDA ENERGIZANTE RED BULL  250ML SURT',
        precios: {
          caja: { label: 'Caja', precio: 24200 },
          unidad: { label: 'Unidad', precio: 6900 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Speed Max',
    descripcion: 'Bebida energizante 310ml con cafeína y taurina.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Speed Max Grande 310ml', precio: 3500 },
    ],
  },
  {
    id: 505,
    nombre: 'Powerade',
    laboratorios: {
      coca_cola_femsa_s_a_: {
        nombre: 'COCA COLA FEMSA S.A DE.C.V',
        nombreProducto: 'BEBIDA HIDRATANTE POWERADE SURT  X 6 UNDS',
        precios: {
          canasta: { label: 'Canasta', precio: 22000 },
          botella: { label: 'Botella', precio: 3900 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Powerade / Coca-Cola',
    descripcion: 'Bebida isotónica para hidratación deportiva.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Powerade Surtido x6 unds', precio: 18000 },
    ],
  },
  {
    id: 506,
    nombre: 'Gatorade',
    laboratorios: {
      gaseosas_lux_sas: {
        nombre: 'GASEOSAS LUX SAS',
        nombreProducto: 'BEBIDA HIDRATANTE GATORADE         SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 3900 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Gatorade / PepsiCo',
    descripcion: 'Bebida isotónica clásica para deportistas.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Bebida Hidratante Surtido', precio: 4500 },
    ],
  },
  {
    id: 507,
    nombre: 'Leche Condensada',
    laboratorios: {
      procoval_ltda: {
        nombre: 'PROCOVAL LTDA.',
        nombreProducto: 'LECHE CONDENSADA TUBITO DOYPACK X 45 GRAMOS -- PRO',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'JABON DOVE LECHE DE COCO X 90 GR',
        precios: {
          caja: { label: 'Caja', precio: 3900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LECHE DE MAGNESIA 120 ML MK',
        precios: {
          frasco: { label: 'Frasco', precio: 10200 },
          caja: { label: 'Caja', precio: 26400 },
        },
      },
      aspen_colombiana_sas: {
        nombre: 'ASPEN COLOMBIANA SAS',
        nombreProducto: 'LECHE DE MAGNESIA PHILLIPS 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 15500 },
          caja: { label: 'Caja', precio: 38700 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'EXTRACTOR DE LECHE CORCHITO',
        precios: {
          caja: { label: 'Caja', precio: 10600 },
        },
      },
      nestle_de_colombia_s: {
        nombre: 'NESTLE DE COLOMBIA S.A.',
        nombreProducto: 'LECHE NESTOGENO ESTAPA 2 POR   1.100   MAXILATA',
        precios: {
          tarro: { label: 'Tarro', precio: 75000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'LP',
    descripcion: 'Leche condensada en tubito doypack.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Leche Condensada Doypack 45g', precio: 2000 },
    ],
  },
  {
    id: 508,
    nombre: 'Galleta Noel',
    laboratorios: {
      compania_de_galletas: {
        nombre: 'COMPANIA DE GALLETAS NOEL S.A.S.',
        nombreProducto: 'GALLETA NOEL',
        precios: {
          unidad: { label: 'Unidad', precio: 500 },
          paquete: { label: 'Paquete', precio: 7500 },
        },
      },
      colombina_s_a: {
        nombre: 'COLOMBINA S.A.',
        nombreProducto: 'GALLETAS QUIMBAYA BRIDGE 51.6 GR',
        precios: {
          paquete: { label: 'Paquete', precio: 2600 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'GALLETAS JET WAFER  X10 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 1 },
          unidad: { label: 'Unidad', precio: 800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GALLETAS JET WAFER  X20UNDS',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 800 },
          paquete: { label: 'Paquete', precio: 11000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Noel',
    descripcion: 'Galletas Noel en variedad de presentaciones.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Galleta Festival Sabores Surtidos x12', precio: 8000  },
      { tipo: 'Galleta Saltinas Soda Noel',            precio: 4000  },
      { tipo: 'Galleta Jet Wáfer Surtido x20 unds',    precio: 10000 },
    ],
  },
  {
    id: 509,
    nombre: 'Chocolatinas',
    categoria: 'Mercado y Hogar',
    marca: 'Jet / Bianchi / Kinder',
    descripcion: 'Chocolatinas y barras de chocolate variadas.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Jet Choclatina Pequeña x50',          precio: 10000 },
      { tipo: 'Jumbo Maní Mediano x24 unds',          precio: 12000 },
      { tipo: 'Jumbo Maní Grande x12 unds',           precio: 12000 },
      { tipo: 'Chocolatina Jumbo Maní 35g x12',       precio: 14000 },
      { tipo: 'Kinder Barra Rellena x24 unds',        precio: 28000 },
      { tipo: 'Bianchi Surtido Caja x12',             precio: 12000 },
      { tipo: 'Mini Bianchi Surtidos x18',            precio: 10000 },
      { tipo: 'Bianchi ChocoSnack Surtido Ganchera',  precio: 12000 },
      { tipo: 'Jumbo Flow Café Choco Maní 576g',      precio: 18000 },
      { tipo: 'Crujijet Blanca x18 unds',             precio: 10000 },
      { tipo: 'Uvas Chéveres Chocolate 40g',          precio: 2000  },
      { tipo: 'Choco Jumbo Maní Pequeña x24',         precio: 10000 },
    ],
  },
  {
    id: 510,
    nombre: 'Helados y Paletas',
    categoria: 'Mercado y Hogar',
    marca: 'Aloha / Bocato / Heladino',
    descripcion: 'Helados artesanales y paletas en variedad de sabores.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Helado Casero Sabores Surt. x25 unds', precio: 18000 },
      { tipo: 'Paleta Aloha Agua Surtida x24 unds',   precio: 12000 },
      { tipo: 'Helado Cono Bocato Surt. x12 unds',    precio: 12000 },
      { tipo: 'Paleta JET x12 unds',                  precio: 10000 },
      { tipo: 'Paleta Chocolisto',                    precio: 2000  },
      { tipo: 'Paleta KIDS Nube Chispita x24',        precio: 12000 },
      { tipo: 'Chococono Chocokispis x24 unds',       precio: 18000 },
      { tipo: 'Platillo Jumbo x20 unds',              precio: 18000 },
    ],
  },
  {
    id: 511,
    nombre: 'Caramelos y Chicles',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CHICLES ADAMS SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Trident / Halls / Menta Chao',
    descripcion: 'Dulces, caramelos y chicles para distribución.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Halls Caramelo Surt. Barra 302.4g x12', precio: 12000 },
      { tipo: 'Chicle Trident 5u Surt. 8.5g x18',      precio: 10000 },
      { tipo: 'Chicle Trident 18u Surt. x12 unds',     precio: 12000 },
      { tipo: 'Menta Chao Barra Surt. x24 unds',       precio: 10000 },
      { tipo: 'Gomitas Trululu Surt. Bolsa 100g',      precio: 5000  },
      { tipo: 'Maní Kraks 25g x12 unds',               precio: 8000  },
      { tipo: 'Maní La Especial con Sal 35g x12',      precio: 10000 },
    ],
  },
  {
    id: 512,
    nombre: 'Papel Higiénico Familia',
    laboratorios: {
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAPEL HIGIENICO   FAMILIA ALCOLCHAX       48   UND',
        precios: {
          caja: { label: 'Caja', precio: 96000 },
          unidad: { label: 'Unidad', precio: 2600 },
          paquete: { label: 'Paquete', precio: 56000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAPEL HIGIENICO FAMILIA MEGA ROLLO 4UND',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Familia',
    descripcion: 'Papel higiénico suave de doble hoja.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Familia Alcolchax x48 unds', precio: 42000 },
    ],
  },
  {
    id: 513,
    nombre: 'Audífonos Samsung',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'AUDIFONOS SAMSUNG ORIGUINAL          BOLSA',
        precios: {
          caja: { label: 'Caja', precio: 9000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Samsung',
    descripcion: 'Audífonos originales Samsung en bolsa sellada.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Audífonos Samsung Original Bolsa', precio: 10000 },
    ],
  },
  {
    id: 514,
    nombre: 'Gaseosa Super Bretaña',
    laboratorios: {
      gaseosas_lux_sas: {
        nombre: 'GASEOSAS LUX SAS',
        nombreProducto: 'GASEOSA SUPER BRETAÑA  X 300 ML',
        precios: {
          caja: { label: 'Caja', precio: 23400 },
          unidad: { label: 'Unidad', precio: 2600 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Super Bretaña',
    descripcion: 'Gaseosa cremosa colombiana en 300ml.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Super Bretaña 300ml', precio: 2000 },
    ],
  },
  {
    id: 515,
    nombre: 'Detergente Ariel',
    categoria: 'Mercado y Hogar',
    marca: 'Ariel / P&G',
    descripcion: 'Detergente en polvo con tecnología de limpieza profunda.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Ariel Regular 500g',  precio: 9000  },
      { tipo: 'Ariel Regular 1kg',   precio: 17000 },
      { tipo: 'Ariel Líquido 800ml', precio: 18000 },
    ],
  },
  {
    id: 516,
    nombre: 'Detergente Fab',
    categoria: 'Mercado y Hogar',
    marca: 'Fab / Colgate-Palmolive',
    descripcion: 'Detergente en polvo de fragancia larga duración.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Fab 500g', precio: 7500  },
      { tipo: 'Fab 1kg',  precio: 14000 },
    ],
  },
  {
    id: 517,
    nombre: 'Suavizante Suavitel',
    categoria: 'Mercado y Hogar',
    marca: 'Suavitel / Colgate-Palmolive',
    descripcion: 'Suavizante de telas con fragancia duradera.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Suavitel Field Flowers 500ml', precio: 8000  },
      { tipo: 'Suavitel 1L',                  precio: 14000 },
    ],
  },
  {
    id: 518,
    nombre: 'Cloro Blancox',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'HIDROCLOROTIAZIDA 25 MG 400 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'CLOROQUINA 250 MG 20 TABLETAS HP',
        precios: {
          blister: { label: 'Blíster', precio: 5200 },
          caja: { label: 'Caja', precio: 9000 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'LOSARTAN + HIDROCLOROTIAZIDA  50MG/12,5MG X30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 15800 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'HIDROCLOROTIAZIDA 25 MG  X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 6000 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'HIDROCLOROTIAZIDA 25 MG CAJA X 30 TABS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 5000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Blancox / Familia',
    descripcion: 'Cloro multipropósito colombiano.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Blancox Original 1L', precio: 5500 },
      { tipo: 'Blancox Floral 2L',   precio: 9000 },
    ],
  },
  {
    id: 519,
    nombre: 'Jabón Rey',
    laboratorios: {
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'JABON ASEPXIA CARBON DETOX 100 GR',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: '3 JABONES ACID MANTLE 90GR ECONOPACK',
        precios: {
          caja: { label: 'Caja', precio: 21000 },
          unidad: { label: 'Unidad', precio: 8500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'JABON DOVE BLANCO ORIGINAL 90 GR',
        precios: {
          caja: { label: 'Caja', precio: 4800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JABON NEKO AVENA 125 GR',
        precios: {
          caja: { label: 'Caja', precio: 4600 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'JABON PROTEX AVENA 120 GR',
        precios: {
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'OFT JABON BABY DOVE 75G X 3 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 12000 },
          unidad: { label: 'Unidad', precio: 4200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Jabón Rey / Familia',
    descripcion: 'Jabón de lavar tradicional colombiano.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Jabón Rey 350g', precio: 4500 },
      { tipo: 'Jabón Rey 700g', precio: 8000 },
    ],
  },
  {
    id: 520,
    nombre: 'Lavaloza Axion',
    categoria: 'Mercado y Hogar',
    marca: 'Axion / Colgate-Palmolive',
    descripcion: 'Lavaloza en crema con desgrasante activo.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Axion Lima 235g',    precio: 5500 },
      { tipo: 'Axion Regular 500g', precio: 9500 },
    ],
  },
  {
    id: 521,
    nombre: 'Esponjas BonBril',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'ALFASAFE GASA ESTERIL ESPONJAS X 50 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 38000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'BonBril',
    descripcion: 'Esponjas de fibra de acero y espuma.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'BonBril Verde x8 unds',  precio: 6000 },
      { tipo: 'BonBril Doble Cara x4',  precio: 5000 },
    ],
  },
  {
    id: 522,
    nombre: 'Bolsas de Basura',
    categoria: 'Mercado y Hogar',
    marca: 'Familia / Genérico',
    descripcion: 'Bolsas resistentes para residuos domésticos.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Bolsas 55x60 x10 unds Verde', precio: 4000 },
      { tipo: 'Bolsas 75x90 x8 unds Negro',  precio: 5500 },
    ],
  },
  {
    id: 523,
    nombre: 'Ambientador Glade',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'OFT GLADE MANZANA Y CANELA X 400ML 2 UNDS',
        precios: {
          frasco: { label: 'Frasco', precio: 18000 },
          par: { label: 'Par', precio: 33000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Glade / SC Johnson',
    descripcion: 'Ambientador en aerosol con fragancias florales y frescas.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Glade Lavanda 285ml', precio: 9000 },
      { tipo: 'Glade Frutas 285ml',  precio: 9000 },
    ],
  },
  {
    id: 524,
    nombre: 'Insecticida Raid',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'RAID INSECTICIDA DOMESTICO JOHNSON Y JOHNSON DE CO',
        precios: {
          caja: { label: 'Caja', precio: 17800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'RAID INSECTICIDA LIQUIDO ELECTRICO + RESPUESTO',
        precios: {
          caja: { label: 'Caja', precio: 16500 },
          paquete: { label: 'Paquete', precio: 41000 },
          unidad: { label: 'Unidad', precio: 15800 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'RAID 45 NOCHES',
        precios: {
          caja: { label: 'Caja', precio: 16900 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Raid / SC Johnson',
    descripcion: 'Insecticida en aerosol para moscas, mosquitos y cucarachas.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Raid Voladores 235ml', precio: 12000 },
      { tipo: 'Raid Mata Todo 235ml', precio: 14000 },
    ],
  },
  {
    id: 525,
    nombre: 'Pilas Energizer',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PILAS ENERGIZER AAA   X 12 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 20000 },
          unidad: { label: 'Unidad', precio: 2800 },
          caja: { label: 'Caja', precio: 3000 },
        },
      },
      energizer_de_colombi: {
        nombre: 'ENERGIZER DE COLOMBIA S.A',
        nombreProducto: 'PILAS ENERGIZER MAX AA',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          ristra: { label: 'Ristra', precio: 24000 },
          caja: { label: 'Caja', precio: 5600 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Energizer',
    descripcion: 'Pilas alcalinas de larga duración.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Energizer AA x2',  precio: 6000 },
      { tipo: 'Energizer AAA x2', precio: 6000 },
    ],
  },
  {
    id: 526,
    nombre: 'Pilas Duracell',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PILAS ENERGIZER AAA   X 12 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 20000 },
          unidad: { label: 'Unidad', precio: 2800 },
          caja: { label: 'Caja', precio: 3000 },
        },
      },
      energizer_de_colombi: {
        nombre: 'ENERGIZER DE COLOMBIA S.A',
        nombreProducto: 'PILAS ENERGIZER MAX AA',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          ristra: { label: 'Ristra', precio: 24000 },
          caja: { label: 'Caja', precio: 5600 },
          unidad: { label: 'Unidad', precio: 5200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Duracell / P&G',
    descripcion: 'Pilas alcalinas Duracell Optimum.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Duracell AA Optimum x2',  precio: 7500 },
      { tipo: 'Duracell AAA Optimum x2', precio: 7500 },
    ],
  },
  {
    id: 527,
    nombre: 'Café Águila Roja',
    categoria: 'Mercado y Hogar',
    marca: 'Águila Roja / Café de Colombia',
    descripcion: 'Café molido colombiano 100% arábica.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Águila Roja 250g', precio: 12000 },
      { tipo: 'Águila Roja 500g', precio: 22000 },
    ],
  },
  {
    id: 528,
    nombre: 'Café Sello Rojo',
    categoria: 'Mercado y Hogar',
    marca: 'Sello Rojo / Colcafé',
    descripcion: 'Café tostado y molido colombiano.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sello Rojo 250g', precio: 13500 },
    ],
  },
  {
    id: 529,
    nombre: 'Chocolate Corona',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PALETTE D. TUBO  6-68  CHOCOLATE CLARO',
        precios: {
          caja: { label: 'Caja', precio: 30500 },
          unidad: { label: 'Unidad', precio: 6800 },
        },
      },
      schwarzkopf: {
        nombre: 'SCHWARZKOPF',
        nombreProducto: 'IGORA VITAL D. TUBO  6-68 CHOCOLATE',
        precios: {
          caja: { label: 'Caja', precio: 35500 },
        },
      },
      colombina_s_a: {
        nombre: 'COLOMBINA S.A.',
        nombreProducto: 'CHOCO BREAK  MONO CHOCOLATE RELLENO 100 GR',
        precios: {
          caja: { label: 'Caja', precio: 9700 },
        },
      },
      compania_nacional_ch: {
        nombre: 'COMPANIA NACIONAL CHOCOLATES S.A.S.',
        nombreProducto: 'MONTBLANC CHOCOLATE BLANCO SURT  800 G',
        precios: {
          blister: { label: 'Blíster', precio: 17500 },
          caja: { label: 'Caja', precio: 80000 },
          unidad: { label: 'Unidad', precio: 3600 },
        },
      },
      ferrero_latin_americ: {
        nombre: 'FERRERO LATIN AMERICA DEV',
        nombreProducto: 'KINDER CHOCOLATE X 50G',
        precios: {
          caja: { label: 'Caja', precio: 3300 },
        },
      },
      c_i_super_de_aliment: {
        nombre: 'C.I.  SUPER DE ALIMENTOS',
        nombreProducto: 'BIANCHI BARRA CHOCOLATE DE LECHE X12UNDS',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Corona / Casa Luker',
    descripcion: 'Chocolate de mesa colombiano.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Corona 500g', precio: 14000 },
    ],
  },
  {
    id: 530,
    nombre: 'Milo',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'VERAPAMILO 120 MG 30 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 12000 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'VERAPAMILO 120 MG 50 TABLETAS LS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      profar_laborables_s_: {
        nombre: 'PROFAR LABORABLES S.A.',
        nombreProducto: 'KOMILON APPETIT FRASCO X 360ML LAB. PROFAR',
        precios: {
          caja: { label: 'Caja', precio: 37000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Milo / Nestlé',
    descripcion: 'Bebida achocolatada con vitaminas y minerales.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Milo 300g',               precio: 14000 },
      { tipo: 'Milo Sachet 15g x12 unds', precio: 10000 },
    ],
  },
  {
    id: 531,
    nombre: 'Galletas Ducales',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GALLETAS DUCALES',
        precios: {
          caja: { label: 'Caja', precio: 5800 },
          unidad: { label: 'Unidad', precio: 800 },
          paquete: { label: 'Paquete', precio: 11000 },
        },
      },
      colombina_s_a: {
        nombre: 'COLOMBINA S.A.',
        nombreProducto: 'GALLETAS QUIMBAYA BRIDGE 51.6 GR',
        precios: {
          paquete: { label: 'Paquete', precio: 2600 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'GALLETAS JET WAFER  X10 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 1 },
          unidad: { label: 'Unidad', precio: 800 },
        },
      },
      compania_de_galletas: {
        nombre: 'COMPANIA DE GALLETAS NOEL S.A.S.',
        nombreProducto: 'GALLETAS TOSH CON MANZANA AVENA Y MANI X6UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 1 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Ducales / Noel',
    descripcion: 'Galletas de soda crujientes. Clásico colombiano.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Ducales x12 unds', precio: 8000 },
    ],
  },
  {
    id: 532,
    nombre: 'Aceite Premier',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS ACEITE BABY SURT  100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
          caja: { label: 'Caja', precio: 33000 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CEPILLO COLGATE PREMIER MEDIO X 1',
        precios: {
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'ACEITE MANZANILLA 25 ML 12 UDS DISANFER',
        precios: {
          frasco: { label: 'Frasco', precio: 2600 },
          paquete: { label: 'Paquete', precio: 14400 },
          unidad: { label: 'Unidad', precio: 2600 },
        },
      },
      lab_blofarma_de_colo: {
        nombre: 'LAB. BLOFARMA DE COLOMBIA',
        nombreProducto: 'ACEITE ALMENDRAS DR. SANA NATURAL 450 ML',
        precios: {
          tarro: { label: 'Tarro', precio: 14000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ACEITE DE ARGAN ISABELY  SPRAY  X  60ML',
        precios: {
          caja: { label: 'Caja', precio: 17700 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Premier / Alianza Team',
    descripcion: 'Aceite vegetal para cocina colombiana.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Premier 1L',    precio: 13000 },
      { tipo: 'Premier 500ml', precio: 8000  },
    ],
  },
  {
    id: 533,
    nombre: 'Arroz Diana',
    laboratorios: {
      comestibles_italo: {
        nombre: 'COMESTIBLES ITALO',
        nombreProducto: 'CHOCO ITALO RELLENA MEDIANA X 12 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 15000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'JABON NIXODERM AZUFRE + ARROZ',
        precios: {
          caja: { label: 'Caja', precio: 12400 },
        },
      },
      oral_b: {
        nombre: 'ORAL-B',
        nombreProducto: 'CEPILLO ORAL-B PRO CERDAS MEDIANAS',
        precios: {
          caja: { label: 'Caja', precio: 2700 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'TETARICAL CREMA FACIAL COREANA + ARROZ 100G',
        precios: {
          frasco: { label: 'Frasco', precio: 26000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Diana / Roa',
    descripcion: 'Arroz blanco de grano largo extra.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Diana 500g', precio: 4500 },
      { tipo: 'Diana 1kg',  precio: 8500 },
    ],
  },
  {
    id: 534,
    nombre: 'Azúcar Incauca',
    laboratorios: {
      eurofarma_colombia_s: {
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'DITOPAX F  SIN AZUCAR SABOR NARANJA CAJA X 25TAB',
        precios: {
          blister: { label: 'Blíster', precio: 5600 },
          caja: { label: 'Caja', precio: 27500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'BENET GOMA GELATINA      *COLAGENO*     SIN AZUCAR',
        precios: {
          caja: { label: 'Caja', precio: 28900 },
        },
      },
      copidrogas: {
        nombre: 'COPIDROGAS',
        nombreProducto: 'VITA GOMA GELATINA SIN AZUCAR 75G',
        precios: {
          unidad: { label: 'Unidad', precio: 7500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Incauca',
    descripcion: 'Azúcar blanca granulada colombiana.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Incauca 500g', precio: 4500 },
      { tipo: 'Incauca 1kg',  precio: 8000 },
    ],
  },
  {
    id: 535,
    nombre: 'Sal Refisal',
    categoria: 'Mercado y Hogar',
    marca: 'Refisal',
    descripcion: 'Sal yodada refinada colombiana.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Refisal 500g', precio: 2500 },
    ],
  },
  {
    id: 536,
    nombre: 'Servilletas Familia',
    laboratorios: {
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: '2 PAN.DESM.FAMILIA POMYS 60 UDS P.E',
        precios: {
          unidad: { label: 'Unidad', precio: 14800 },
          paquete: { label: 'Paquete', precio: 7200 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAPEL HIGIENICO   FAMILIA ALCOLCHAX       48   UND',
        precios: {
          caja: { label: 'Caja', precio: 96000 },
          unidad: { label: 'Unidad', precio: 2600 },
          paquete: { label: 'Paquete', precio: 56000 },
        },
      },
      profamilia: {
        nombre: 'PROFAMILIA',
        nombreProducto: 'PIEL CONDON ESPERMICIDA PROFAMILIA',
        precios: {
          caja: { label: 'Caja', precio: 7200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAPEL HIGIENICO FAMILIA MEGA ROLLO 4UND',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Familia / Kimberly-Clark',
    descripcion: 'Servilletas de papel suaves y absorbentes.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Familia x50 unds', precio: 3500 },
    ],
  },

  /* ─────────────────────────────────────────────────────────
     6. MARCAS PROPIAS (IDs 601+) — SIN CAMBIOS
     ───────────────────────────────────────────────────────── */
  {
    id: 601,
    nombre: 'Resfrygrip Plus',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'RESFRYGRIP PLUS X 100 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 12000 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 1400 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'HIDRAPLUS  75 ZINC     SURTIDO  400 ML SUERO',
        precios: {
          botella: { label: 'Botella', precio: 10600 },
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 102400 },
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NOXPIRIN PLUS CAPS ADLUTOS DIA NOCHE X  120 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 114000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CALADERM CLEAR PLUS 120 GR',
        precios: {
          frasco: { label: 'Frasco', precio: 19800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'STAYFREE ADAPT PLUS X 12 TOALL',
        precios: {
          paquete: { label: 'Paquete', precio: 4700 },
        },
      },
      ruecam: {
        nombre: 'RUECAM',
        nombreProducto: 'DRENOLAX PLUSS SUSP X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 24900 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PAN.TENA PANTS ULTRA MED.PLUS CARE 10UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 41100 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
    },
    categoria: 'Marcas Propias',
    marca: 'Lafrancol',
    descripcion: 'Antigripal multisíntoma de alta concentración.',
    imagen: imgMar(),
    tags: [T.nuevo, T.vendido],
    variantes: [
      { tipo: 'ResfryGrip Plus x100 cáps',  precio: 42000 },
      { tipo: 'ResfryGrip Plus x25 sobres', precio: 18000 },
    ],
  },
  {
    id: 602,
    nombre: 'Pasta Dental DE Económicas',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'PASTA DENTAL COLGATE  LUMINOUS WHITE CARBON ACTIVA',
        precios: {
          caja: { label: 'Caja', precio: 20900 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'CREMA ORAL B PASTA DENTAL ANTIC.FL. 140 G',
        precios: {
          caja: { label: 'Caja', precio: 15500 },
        },
      },
    },
    categoria: 'Marcas Propias',
    marca: 'DE Económicas',
    descripcion: 'Crema dental con flúor de marca propia.',
    imagen: imgMar(),
    tags: [T.exclusivo, T.oferta],
    variantes: [
      { tipo: 'Pasta Dental DE 75ml', precio: 3500 },
    ],
  },
  {
    id: 603,
    nombre: 'Alcohol Antiséptico DE',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ALCOHOL ANTISEPTICO MK FRASCO X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 3200 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LISTERINE CONTROL CALCULO ZERO ALCOHOL 500 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LISTERINE COOL MINT ZERO ALCOHOL X 360 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 15000 },
          caja: { label: 'Caja', precio: 3800 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'ENJ.COLGATE PERIOGARD SIN ALCOHOL 250 ML',
        precios: {
          caja: { label: 'Caja', precio: 30500 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'ALCOPI ALCOHOL 70% X 130ML SPRAY',
        precios: {
          caja: { label: 'Caja', precio: 3500 },
        },
      },
    },
    categoria: 'Marcas Propias',
    marca: 'DE Económicas',
    descripcion: 'Alcohol isopropílico 70% de marca propia.',
    imagen: imgMar(),
    tags: [T.exclusivo],
    variantes: [
      { tipo: 'DE Alcohol 250ml', precio: 5000 },
      { tipo: 'DE Alcohol 500ml', precio: 8500 },
    ],
  },
  {
    id: 604,
    nombre: 'Acetaminofén 500mg DE',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'CRONOFEN ACETAMINOFEN 500MG X100TAB',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ACETAMINOFEN FORTE    500MG  +  CAFEINA  65 MG  X',
        precios: {
          blister: { label: 'Blíster', precio: 9200 },
          caja: { label: 'Caja', precio: 17300 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'ACETAMINOFEN 500MG + CAFEINA 65MG X 48 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 33000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
          frasco: { label: 'Frasco', precio: 4100 },
        },
      },
      quimica_patric_ltda: {
        nombre: 'QUIMICA PATRIC LTDA',
        nombreProducto: 'PLURIGRAM CIPROFLOZACINA 500MG 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 23500 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'ACETAMINOFEN 150 MG JARABE 90 ML LS',
        precios: {
          frasco: { label: 'Frasco', precio: 8500 },
        },
      },
    },
    categoria: 'Marcas Propias',
    marca: 'DE Económicas / Lafrancol',
    descripcion: 'Acetaminofén de marca propia.',
    imagen: imgMar(),
    tags: [T.exclusivo, T.vendido],
    variantes: [
      { tipo: 'DE 500mg x100 tab', precio: 14000 },
    ],
  },
  {
    id: 605,
    nombre: 'Crema Antipañalitis DE',
    laboratorios: {
      lab_cero_s_a: {
        nombre: 'LAB. CERO S.A.',
        nombreProducto: 'CREMA CERO ANTIPAÑALITIS  X 30G',
        precios: {
          caja: { label: 'Caja', precio: 9900 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ACID MANTLE BABY ANTIPAÑALITIS CREMA X 100 GR',
        precios: {
          caja: { label: 'Caja', precio: 35600 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'DES LADY TALC PRACTI CREMA X 30 GRS',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA P.PEINAR SAVITAL BIOTINA 275 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSON BABY CREMA  PARA PEINAR 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'DTE BALANCE CREMA DUOS .PRO/EX.NOR. X 16 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CREMA FORZ 24 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 48000 },
        },
      },
    },
    categoria: 'Marcas Propias',
    marca: 'DE Económicas',
    descripcion: 'Crema de óxido de zinc de marca propia.',
    imagen: imgMar(),
    tags: [T.exclusivo],
    variantes: [
      { tipo: 'DE Zinc Crema 60g', precio: 9000 },
    ],
  },
  {
    id: 606,
    nombre: 'Vaselina DE Económicas',
    laboratorios: {
      lab_lady_rose_s_a_s: {
        nombre: 'LAB. LADY ROSE S.A.S',
        nombreProducto: 'VASELINA PURA MASIVOS Y MARCAS X 400 GR',
        precios: {
          pote___lata: { label: 'Pote / Lata', precio: 16900 },
        },
      },
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'VASELINA PURA DISANFER X 240 GRS',
        precios: {
          pote___lata: { label: 'Pote / Lata', precio: 13000 },
          caja: { label: 'Caja', precio: 3600 },
          tarro: { label: 'Tarro', precio: 5800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'VASELINA ATHOS X30G PAQ X12UNDS',
        precios: {
          frasco: { label: 'Frasco', precio: 2500 },
          paquete: { label: 'Paquete', precio: 29000 },
        },
      },
      lab_athos_s_a_s: {
        nombre: 'LAB. ATHOS S.A.S',
        nombreProducto: 'ATHOS VASELINA PROTECTOR CUTANEO 120 G LABORATORIO',
        precios: {
          frasco: { label: 'Frasco', precio: 4300 },
        },
      },
      aproquim_ltda: {
        nombre: 'APROQUIM LTDA',
        nombreProducto: 'APROQUIM VASELINA PURA LABORATORIOS APROQUIM LTDA.',
        precios: {
          paquete: { label: 'Paquete', precio: 6000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS VASELINA BABY 100 GRAMOS JOHNSON Y JOHNSO',
        precios: {
          frasco: { label: 'Frasco', precio: 25800 },
        },
      },
    },
    categoria: 'Marcas Propias',
    marca: 'DE Económicas',
    descripcion: 'Vaselina pura de marca propia.',
    imagen: imgMar(),
    tags: [T.exclusivo, T.oferta],
    variantes: [
      { tipo: 'DE Vaselina 60g',  precio: 2800 },
      { tipo: 'DE Vaselina 120g', precio: 4800 },
    ],
  },
  {
    id: 607,
    nombre: 'Suero Oral DE',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'HIDRAPLUS  75 ZINC     SURTIDO  400 ML SUERO',
        precios: {
          botella: { label: 'Botella', precio: 10600 },
          frasco: { label: 'Frasco', precio: 33000 },
          blister: { label: 'Blíster', precio: 2900 },
          caja: { label: 'Caja', precio: 60310 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DORALIV  CAJA X  10 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'CRE.DEN.ORAL-B COMPLETE 50 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 4000 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'TUKOL-D EXPECTORANTE SOL.ORAL 125 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 38200 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'SUERO GERCO RHIFISOL 12X14',
        precios: {
          frasco: { label: 'Frasco', precio: 5500 },
        },
      },
      quibi_s_a: {
        nombre: 'QUIBI S.A.',
        nombreProducto: 'SUERO VENOVIT 5% A/D 500 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 21500 },
          bolsa: { label: 'Bolsa', precio: 24900 },
        },
      },
    },
    categoria: 'Marcas Propias',
    marca: 'DE Económicas',
    descripcion: 'Sales de rehidratación oral de marca propia.',
    imagen: imgMar(),
    tags: [T.exclusivo, T.vendido],
    variantes: [
      { tipo: 'DE Suero Oral x10 sobres', precio: 5500 },
    ]
  },
      /* ══════════════════════════════════════════════════════════════════════
 *  Droguerías Económicas — Nuevos Productos del Inventario Real
 *  Fuente: Informe_inventarios.xlsx
 *  Generado automáticamente | 300 productos | IDs: 1001–1300
 *
 *  ╔══ INSTRUCCIONES DE INTEGRACIÓN ══════════════════════════════╗
 *  ║  1. Abre productos-data.js                                   ║
 *  ║  2. Localiza el cierre del array CATALOGO: ];                ║
 *  ║  3. Pega este bloque ANTES de ];                             ║
 *  ║  4. Asegúrate de que el producto anterior termine con ,      ║
 *  ╚═══════════════════════════════════════════════════════════════╝
 * ══════════════════════════════════════════════════════════════════════ */

  {
    id: 1001,
    nombre: 'Glucosamina Y Colageno X 30 Caps Lmv Natural',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GLUCOSAMINA Y COLAGENO X 30 CAPS  LMV NATURAL',
        precios: {
          caja: { label: 'Caja', precio: 35000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Glucosamina Y Colageno X 30 Caps Lmv Natural.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1750 },
      { tipo: 'Caja', precio: 35000 }
    ],
  },
  {
    id: 1002,
    nombre: 'Acetaminofen 500 MG 300 Tabletas',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'ACETAMINOFEN 500 MG 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'ACETAMINOFEN 500 MG X 100  TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 10000 },
        },
      },
      mediseg: {
        nombre: 'MEDISEG',
        nombreProducto: 'PUNZADOL ACETAMINOFEN 500 MG CAJA CON 100 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ACETAMINOFEN+CODEINA 325/30 MG CAJA X 30 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 10000 },
          caja: { label: 'Caja', precio: 30000 },
          par: { label: 'Par', precio: 2000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MEJORAL  ACETAMINOFEN X 10 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 8200 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Acetaminofen 500 MG 300 Tabletas.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres', precio: 1500 },
      { tipo: 'Caja', precio: 30000 }
    ],
  },
  {
    id: 1003,
    nombre: 'Diclofenalco 50 MG Caja X 400 Tab',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'DICLOFENALCO 50 MG CAJA X 400 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 1 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DORALIV  CAJA X  10 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      eurofarma_colombia_s: {
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'NEOSALDINA CAJA X 25 BLISTER X 4 GRANJEAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 150000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      health_care: {
        nombre: 'HEALTH CARE',
        nombreProducto: 'ADVIL ULTRA  CAJA X 72 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO  SOBRES  SURTIDOS X25MG CAJA POR 15 UND',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'MEBLAINEX  (MELOXICAM) AMPOLLA 15 MG /1,5ML  CAJA',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 12500 },
        },
      },
      grunenthal_colombian: {
        nombre: 'GRUNENTHAL COLOMBIANA S.A',
        nombreProducto: 'LOMOTIL 2.5 MG 12 CAJAS X 4 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Diclofenalco 50 MG Caja X 400 Tab.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 }
    ],
  },
  {
    id: 1004,
    nombre: 'Loratadina 10 MG Miligramo(s) Tableta Laboratorios',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'LORATADINA 10 MG MILIGRAMO(S) TABLETA LABORATORIOS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 380000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Loratadina 10 MG Miligramo(s) Tableta Laboratorios.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 }
    ],
  },
  {
    id: 1005,
    nombre: 'Asa 100 MG 100 Tabletas MK',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Asa 100 MG 100 Tabletas MK.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 900 },
      { tipo: 'Sobres', precio: 3000 },
      { tipo: 'Caja', precio: 36000 }
    ],
  },
  {
    id: 1006,
    nombre: 'Omeprazol 20 MG Miligramo(s) Capsula Farmacol Chin',
    laboratorios: {
      farmacol_chinoin_sas: {
        nombre: 'FARMACOL CHINOIN SAS',
        nombreProducto: 'OMEPRAZOL 20 MG MILIGRAMO(S) CAPSULA FARMACOL CHIN',
        precios: {
          blister: { label: 'Blíster', precio: 3400 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'FARMACOL CHINOIN SAS',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Omeprazol 20 MG Miligramo(s) Capsula Farmacol Chin.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 680 },
      { tipo: 'Sobres', precio: 3400 },
      { tipo: 'Caja', precio: 50000 }
    ],
  },
  {
    id: 1007,
    nombre: 'Cetirizina 10 MG 400 Tabletas Recubiertas',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'CETIRIZINA 10 MG  400  TABLETAS RECUBIERTAS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'CETIRIZINA 10 MG 400 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 80000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CETIRIZINA 10 MG 10 TABLETAS  MK PROMO',
        precios: {
          caja: { label: 'Caja', precio: 5000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'ETORICOXIB 90 MG X 14  TABLETAS RECUBIERTAS',
        precios: {
          caja: { label: 'Caja', precio: 39500 },
          unidad: { label: 'Unidad', precio: 20900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Cetirizina 10 MG 400 Tabletas Recubiertas.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 },
      { tipo: 'Caja', precio: 35000 }
    ],
  },
  {
    id: 1008,
    nombre: 'Vita C MK Surtido 500MG X 100 Tab Mastic',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'VITA C MK SURTIDO 500MG X 100 TAB MASTIC',
        precios: {
          blister: { label: 'Blíster', precio: 5900 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'VITAMINA  C 500MG + ZINC NAR 100 TABLETAS MASTICAB',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 26000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Vita C MK Surtido 500MG X 100 Tab Mastic.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1180 },
      { tipo: 'Sobres', precio: 5900 },
      { tipo: 'Caja', precio: 50000 }
    ],
  },
  {
    id: 1009,
    nombre: 'Naproxeno 250 MG 300 Tabletas LP',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'NAPROXENO 500 MG 10 TABLETAS AG',
        precios: {
          caja: { label: 'Caja', precio: 5000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Naproxeno 250 MG 300 Tabletas LP.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 760 },
      { tipo: 'Sobres', precio: 3800 },
      { tipo: 'Caja', precio: 114000 }
    ],
  },
  {
    id: 1010,
    nombre: 'Resfrygrip Plus X 100 Caps',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'RESFRYGRIP PLUS X 100 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 12000 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 1400 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NOXPIRIN PLUS CAPS ADLUTOS DIA NOCHE X  120 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 114000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'NOXPIRIN PLUS 100 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 80000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'DRENAPLUS   CAPSULA GELA.CARDO MARIANO',
        precios: {
          caja: { label: 'Caja', precio: 23900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Resfrygrip Plus X 100 Caps.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres', precio: 12000 },
      { tipo: 'Caja', precio: 100000 },
      { tipo: 'Unidad', precio: 1400 }
    ],
  },
  {
    id: 1011,
    nombre: 'Acido Folico 1 MG 300 Tabletas EC',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'ACIDO FOLICO 1 MG 300 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'ACIDO ACETILSALICILICO 100 GR 250 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
        },
      },
      productos_padel: {
        nombre: 'PRODUCTOS PADEL',
        nombreProducto: 'COLGENIS ACIDO FOLICO X400G',
        precios: {
          tarro: { label: 'Tarro', precio: 45000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA ACIDO ACETILSALICILICO  100 MG X20 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 4900 },
        },
      },
      mgcpharma: {
        nombre: 'MGCPHARMA',
        nombreProducto: 'HIES-TOFER PLUS HIERRO AMINOQUELADO + ACIDO FOLICO',
        precios: {
          caja: { label: 'Caja', precio: 45000 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'FIBRILOK ACIDO TRANEXAMICO 500 MG TABLETAS CAJA X',
        precios: {
          caja: { label: 'Caja', precio: 40000 },
          unidad: { label: 'Unidad', precio: 4500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Acido Folico 1 MG 300 Tabletas EC.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1000 },
      { tipo: 'Caja', precio: 30000 }
    ],
  },
  {
    id: 1012,
    nombre: 'Vitamina E 400UI+VITAMINA A 3500UI 150CAPSULAS IC',
    laboratorios: {
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'VITAMINA E 400UI+VITAMINA A 3500UI 150CAPSULAS  IC',
        precios: {
          blister: { label: 'Blíster', precio: 11000 },
          caja: { label: 'Caja', precio: 59000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ICOM',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Vitamina E 400UI+VITAMINA A 3500UI 150CAPSULAS IC.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 1320 },
      { tipo: 'Sobres', precio: 11000 },
      { tipo: 'Caja', precio: 59000 }
    ],
  },
  {
    id: 1013,
    nombre: 'Hidroclorotiazida 25 MG 400 Tabletas LP',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'HIDROCLOROTIAZIDA 25 MG 400 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Hidroclorotiazida 25 MG 400 Tabletas LP.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 },
      { tipo: 'Caja', precio: 40000 }
    ],
  },
  {
    id: 1014,
    nombre: 'Metoclopramida 10 MG 400 Tabletas LP',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'METOCLOPRAMIDA 10 MG 400 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Metoclopramida 10 MG 400 Tabletas LP.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 },
      { tipo: 'Caja', precio: 40000 }
    ],
  },
  {
    id: 1015,
    nombre: 'Dexametasona Fosfato 8MG/2ML',
    laboratorios: {
      farmionni: {
        nombre: 'FARMIONNI',
        nombreProducto: 'DEXAMETASONA FOSFATO  8MG/2ML',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'DEXAMETASONA 8 MG/2 ML 10 AMP VT',
        precios: {
          ampolla: { label: 'Ampolla', precio: 3500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      quibi_s_a: {
        nombre: 'QUIBI S.A.',
        nombreProducto: 'ENEMATROL FOSFATO 133 ML',
        precios: {
          bolsa: { label: 'Bolsa', precio: 16100 },
        },
      },
      corpaul: {
        nombre: 'CORPAUL',
        nombreProducto: 'ENEMA RECTAL FOSFATO 133 ML CORPAUL',
        precios: {
          bolsa: { label: 'Bolsa', precio: 15800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DEXAMETASONA  8MG/2ML  SOL INY  X100 AMP',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4000 },
          caja: { label: 'Caja', precio: 344850 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'DEXABLAS DEXAMETASONA 8MG/2ML',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 14800 },
        },
      },
      vital_vision: {
        nombre: 'VITAL VISION',
        nombreProducto: 'VITATRIOL DEXAMETASONA 0.1 G UNGUENTO 3.5G',
        precios: {
          caja: { label: 'Caja', precio: 32500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DUO DECADRON DEXAMETASONA 16 MG MILIGRAMO(S) SUSPE',
        precios: {
          caja: { label: 'Caja', precio: 70900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'FARMIONNI',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dexametasona Fosfato 8MG/2ML.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 3500 }
    ],
  },
  {
    id: 1016,
    nombre: 'Carbamazepina 200 MG X 300 Tbs',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'CARBAMAZEPINA 200 MG  X 300 TBS',
        precios: {
          blister: { label: 'Blíster', precio: 5400 },
          caja: { label: 'Caja', precio: 108000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Carbamazepina 200 MG X 300 Tbs.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1080 },
      { tipo: 'Sobres', precio: 5400 },
      { tipo: 'Caja', precio: 108000 }
    ],
  },
  {
    id: 1017,
    nombre: 'Cefalexina 500 MG X 250 Caps Recipe',
    laboratorios: {
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'CEFALEXINA 500 MG X 250 CAPS RECIPE',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 150000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 10 CAPSULAS MK PROMO',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'CEPRAX CEFALEXINA 500 MG X 50 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 12000 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 10 CAPSULAS GF',
        precios: {
          caja: { label: 'Caja', precio: 6900 },
        },
      },
      aldriston: {
        nombre: 'ALDRISTON',
        nombreProducto: 'CEXGRAM-T CEFALEXINA 500 MG CAJA X 60 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 15900 },
          caja: { label: 'Caja', precio: 55000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'CEFALEXINA 500 MG X 100 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 7200 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BUSSIE S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Cefalexina 500 MG X 250 Caps Recipe.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1500 },
      { tipo: 'Sobres', precio: 7500 },
      { tipo: 'Caja', precio: 150000 }
    ],
  },
  {
    id: 1018,
    nombre: 'Bisacodilo 5 MG 100 Tabletas RC',
    laboratorios: {
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'BISACODILO 5 MG 100 TABLETAS RC',
        precios: {
          blister: { label: 'Blíster', precio: 4900 },
          caja: { label: 'Caja', precio: 20400 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BUSSIE S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Bisacodilo 5 MG 100 Tabletas RC.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 980 },
      { tipo: 'Sobres', precio: 4900 },
      { tipo: 'Caja', precio: 20400 }
    ],
  },
  {
    id: 1019,
    nombre: 'Furosemida 40 MG X300TAB',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'FUROSEMIDA 40 MG X300TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 37000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'FUROSEMIDA 40 MG 100 TABLETAS GF',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'FUROSEMIDA 20 MG/2 ML SOLUCION INYECTABLE VITALIS',
        precios: {
          caja: { label: 'Caja', precio: 4500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Furosemida 40 MG X300TAB.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 },
      { tipo: 'Caja', precio: 37000 }
    ],
  },
  {
    id: 1020,
    nombre: 'Solomoxy Amoxicilina 500MG X60CAP',
    laboratorios: {
      bcn_medical_s_a: {
        nombre: 'BCN MEDICAl S.A',
        nombreProducto: 'SOLOMOXY AMOXICILINA 500MG  X60CAP',
        precios: {
          blister: { label: 'Blíster', precio: 10000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BCN MEDICAl S.A',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Solomoxy Amoxicilina 500MG X60CAP.',
    imagen: imgMed(),
    tags: [T.vendido],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1200 },
      { tipo: 'Sobres', precio: 10000 },
      { tipo: 'Caja', precio: 30000 }
    ],
  },
  {
    id: 1021,
    nombre: 'Ibuprofeno 800 MG Caja X 50 Tab',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ADVIL MAX IBUPROFENO CAJA X 40CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 3400 },
          caja: { label: 'Caja', precio: 68000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'IBUPROFENO 800 MG CAJA  X 50  TAB',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 11500 },
          frasco: { label: 'Frasco', precio: 9300 },
        },
      },
      eurofarma_colombia_s: {
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'NEOSALDINA CAJA X 25 BLISTER X 4 GRANJEAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 150000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      health_care: {
        nombre: 'HEALTH CARE',
        nombreProducto: 'ADVIL ULTRA  CAJA X 72 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO  SOBRES  SURTIDOS X25MG CAJA POR 15 UND',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'MEBLAINEX  (MELOXICAM) AMPOLLA 15 MG /1,5ML  CAJA',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 12500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAFRANCOL S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ibuprofeno 800 MG Caja X 50 Tab.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 900 },
      { tipo: 'Sobres', precio: 3000 },
      { tipo: 'Caja', precio: 11500 }
    ],
  },
  {
    id: 1022,
    nombre: 'Loperamida Clorhidrato 2 MG X 240 Tabletas',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'LOPERAMIDA CLORHIDRATO  2 MG  X 240 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2900 },
          caja: { label: 'Caja', precio: 116000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LOPERAMIDA 2 MG X 6 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'IMIPRAMINA CLORHIDRATO 10 MG X 20 TABLETAS RECUBIE',
        precios: {
          blister: { label: 'Blíster', precio: 16000 },
          caja: { label: 'Caja', precio: 29800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Loperamida Clorhidrato 2 MG X 240 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 870 },
      { tipo: 'Sobres', precio: 2900 },
      { tipo: 'Caja', precio: 116000 }
    ],
  },
  {
    id: 1023,
    nombre: 'Amitriptilina 25 MG 400 Tabletas LP',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'AMITRIPTILINA 25 MG 400 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 60000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Amitriptilina 25 MG 400 Tabletas LP.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 },
      { tipo: 'Caja', precio: 60000 }
    ],
  },
  {
    id: 1024,
    nombre: 'Complejo B X 250 Tabletas EC',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'COMPLEJO B  X  250 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 1900 },
          caja: { label: 'Caja', precio: 45000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Complejo B X 250 Tabletas EC.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres', precio: 1900 },
      { tipo: 'Caja', precio: 45000 }
    ],
  },
  {
    id: 1025,
    nombre: 'Tripleviral Proomo',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TRIPLEVIRAL PROOMO',
        precios: {
          caja: { label: 'Caja', precio: 1000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Tripleviral Proomo.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 1000 }
    ],
  },
  {
    id: 1026,
    nombre: 'Tiamina 300 MG X 250 Tabletas',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'TIAMINA 300 MG X 250 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'TIAMINA 300 MG 250 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 2200 },
          caja: { label: 'Caja', precio: 55000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Tiamina 300 MG X 250 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 },
      { tipo: 'Caja', precio: 50000 }
    ],
  },
  {
    id: 1027,
    nombre: 'Iseptic Benzocaina 10MG +cetilpiridina 1.4MG X 96',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'ISEPTIC  BENZOCAINA 10MG +CETILPIRIDINA 1.4MG X 96',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 107000 },
          par: { label: 'Par', precio: 3500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABORATORIOS COASPHARMA S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Iseptic Benzocaina 10MG +cetilpiridina 1.4MG X 96.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1200 },
      { tipo: 'Sobres', precio: 6000 },
      { tipo: 'Caja', precio: 107000 },
      { tipo: 'Par', precio: 3500 }
    ],
  },
  {
    id: 1028,
    nombre: 'Diclofenaco Retard 100 MG 20 Capsulas AG',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 4800 },
          caja: { label: 'Caja', precio: 18500 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'DIFLENAC DICLOFENACO RETARD 100 MG CAPSULAS CAJA P',
        precios: {
          blister: { label: 'Blíster', precio: 9900 },
          caja: { label: 'Caja', precio: 20000 },
        },
      },
      novartis_de_colombia: {
        nombre: 'NOVARTIS DE COLOMBIA S.A.',
        nombreProducto: 'VOLTAREN RETARD DICLOFENACO  100MG 10 UND',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 58500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAFRANCOL S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Diclofenaco Retard 100 MG 20 Capsulas AG.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 1400 },
      { tipo: 'Sobres', precio: 7000 },
      { tipo: 'Caja', precio: 13500 }
    ],
  },
  {
    id: 1029,
    nombre: 'Pasedol Dimenhidrinato 50 MG X 100 Tab',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'PASEDOL DIMENHIDRINATO 50 MG X 100  TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 48000 },
          unidad: { label: 'Unidad', precio: 800 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'MARE-OFF DIMENHIDRINATO  50 MG X 12 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 12000 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'MAREOL DIMENHIDRINATO 50 MG X 72 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 9000 },
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Pasedol Dimenhidrinato 50 MG X 100 Tab.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 2000 },
      { tipo: 'Caja', precio: 48000 },
      { tipo: 'Unidad', precio: 800 }
    ],
  },
  {
    id: 1030,
    nombre: 'Metformina 850 MG X 30 Caps',
    laboratorios: {
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'METFORMINA 850 MG X 30 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 6800 },
          caja: { label: 'Caja', precio: 19300 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NOXPIRIN PLUS CAPS ADLUTOS DIA NOCHE X  120 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 114000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'APRONAX LIQUID GEL 275 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 18500 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 2000 },
          par: { label: 'Par', precio: 2600 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX ACTIVEGEL 20 CAPSULAS LIQUIDAS',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'RETIBLAN 50 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'NIFEDIPINO 30 MG 30 CAPSULAS EX',
        precios: {
          blister: { label: 'Blíster', precio: 15500 },
          caja: { label: 'Caja', precio: 45200 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'COLMED',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Metformina 850 MG X 30 Caps.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1360 },
      { tipo: 'Sobres', precio: 6800 },
      { tipo: 'Caja', precio: 19300 }
    ],
  },
  {
    id: 1031,
    nombre: 'Sulfato Ferroso 300 MG 250 Tabletas EC',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'SULFATO FERROSO 300 MG 250 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 17092 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'SULFATO FERROSO GOTAS 125 MG/ML LP',
        precios: {
          frasco: { label: 'Frasco', precio: 7800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Sulfato Ferroso 300 MG 250 Tabletas EC.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1500 },
      { tipo: 'Caja', precio: 17092 }
    ],
  },
  {
    id: 1032,
    nombre: 'Activa 21 21 Grageas',
    laboratorios: {
      b_c_n_medical_s_a: {
        nombre: 'B C N MEDICAL S.A',
        nombreProducto: 'ACTIVA 21 21 GRAGEAS',
        precios: {
          caja: { label: 'Caja', precio: 7800 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'NORVETAL 21 GRAGEAS',
        precios: {
          caja: { label: 'Caja', precio: 9300 },
        },
      },
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'CALMIDOL MAX 48 GRAGEAS',
        precios: {
          caja: { label: 'Caja', precio: 94000 },
          par: { label: 'Par', precio: 4300 },
          unidad: { label: 'Unidad', precio: 2200 },
          blister: { label: 'Blíster', precio: 24000 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'DICLOFENACO 50 MILIGRAMOS 250 GRAGEAS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      tecnofarma_s_a: {
        nombre: 'TECNOFARMA S.A',
        nombreProducto: 'MICROGYNON SUAVE 21 GRAGEAS',
        precios: {
          caja: { label: 'Caja', precio: 7600 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'PASTA DENTAL COLGATE  LUMINOUS WHITE CARBON ACTIVA',
        precios: {
          caja: { label: 'Caja', precio: 20900 },
        },
      },
      bcn_medical_s_a: {
        nombre: 'BCN MEDICAl S.A',
        nombreProducto: 'ACTIVA21 SUAVE LEVONORGESTREL  0.1 MG GRAGEA',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA COLGATE TOTAL 12 CARBON ACTIVADO X75ML',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      aiphex_globalpharma_: {
        nombre: 'AIPHEX GLOBALPHARMA S A S',
        nombreProducto: 'ACTIVAGE 100 CALOSTRO BOVINO SURT X 500MG',
        precios: {
          caja: { label: 'Caja', precio: 48000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'B C N MEDICAL S.A',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Activa 21 21 Grageas.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1560 },
      { tipo: 'Caja', precio: 7800 }
    ],
  },
  {
    id: 1033,
    nombre: 'Diclofenaco 75 ML X 10 Amp',
    laboratorios: {
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'DICLOFENACO 1% GEL 50 GR VT',
        precios: {
          tubo: { label: 'Tubo', precio: 8100 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'DICLOFENACO 50 MILIGRAMOS 250 GRAGEAS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 4800 },
          caja: { label: 'Caja', precio: 18500 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'DICLOFENACO 1% GEL 50 GR MP',
        precios: {
          tubo: { label: 'Tubo', precio: 12500 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'FENACOF DICLOFENACO SOD 0,1% 5ML GOTAS',
        precios: {
          frasco: { label: 'Frasco', precio: 24800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DICLOREN  GEL  DICLOFENACO GEL  50GR',
        precios: {
          caja: { label: 'Caja', precio: 20500 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'DICLOFENACO 1 G GRAMO(S) GEL 50 GRAMOS LABORATORIO',
        precios: {
          caja: { label: 'Caja', precio: 12000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'FARMIONNI',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Diclofenaco 75 ML X 10 Amp.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Ampolla', precio: 2000 }
    ],
  },
  {
    id: 1034,
    nombre: 'Diclofenaco Retard 100 MG 20 Capsulas MK',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 4800 },
          caja: { label: 'Caja', precio: 18500 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'DICLOFENACO RETARD 100 MG 20 CAPSULAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'DIFLENAC DICLOFENACO RETARD 100 MG CAPSULAS CAJA P',
        precios: {
          blister: { label: 'Blíster', precio: 9900 },
          caja: { label: 'Caja', precio: 20000 },
        },
      },
      novartis_de_colombia: {
        nombre: 'NOVARTIS DE COLOMBIA S.A.',
        nombreProducto: 'VOLTAREN RETARD DICLOFENACO  100MG 10 UND',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 58500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Diclofenaco Retard 100 MG 20 Capsulas MK.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 960 },
      { tipo: 'Sobres', precio: 4800 },
      { tipo: 'Caja', precio: 18500 }
    ],
  },
  {
    id: 1035,
    nombre: 'Levotiroxina 100MG X30 Tab MK',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LEVOTIROXINA 100MG  X30 TAB MK',
        precios: {
          blister: { label: 'Blíster', precio: 9000 },
          caja: { label: 'Caja', precio: 24800 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'TRAMADOL 10 %GOTAS ORALES 100MG /10ML EXPOFARMA',
        precios: {
          frasco: { label: 'Frasco', precio: 8900 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'LEVOTIROXINA 50 MG 100 TABLETAS PC',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'NITOXIPAR NITAZOXANIDA 100MG/5ML  SUSP X 30 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29800 },
        },
      },
      ophalac: {
        nombre: 'OPHALAC',
        nombreProducto: 'ACIDO ACETILSALICILICO 100MG',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'TIAMINA 100MG/ML  X10 ML SOL INY  CJX12UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 6700 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'LEVOTIROXINA SODICA 100 MG X 50 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 29800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MICOTRAZOL  ITRACONAZOL  100MG   X4 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 22500 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'HIERRO SACAROSA 100MG/5ML  SOL INY',
        precios: {
          caja: { label: 'Caja', precio: 33000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Levotiroxina 100MG X30 Tab MK.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1080 },
      { tipo: 'Sobres', precio: 9000 },
      { tipo: 'Caja', precio: 24800 }
    ],
  },
  {
    id: 1036,
    nombre: 'Prazed 20 MG Capsula Dura',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'PRAZED 20 MG CAPSULA DURA',
        precios: {
          blister: { label: 'Blíster', precio: 10500 },
          caja: { label: 'Caja', precio: 21000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DURAFEX NAPROXENO 500 MG  CAPSULA',
        precios: {
          caja: { label: 'Caja', precio: 56000 },
          par: { label: 'Par', precio: 6300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'NOVAMED S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Prazed 20 MG Capsula Dura.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1260 },
      { tipo: 'Sobres', precio: 10500 },
      { tipo: 'Caja', precio: 21000 }
    ],
  },
  {
    id: 1037,
    nombre: 'Dosaldin Caja X 20 Tab (isometepteno Mucato 30g/ D',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'DOSALDIN CAJA X 20 TAB (ISOMETEPTENO MUCATO 30G/ D',
        precios: {
          blister: { label: 'Blíster', precio: 20000 },
          caja: { label: 'Caja', precio: 39900 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BIOQUIFAR PHARMACEUTICA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dosaldin Caja X 20 Tab (isometepteno Mucato 30g/ D.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 20000 },
      { tipo: 'Caja', precio: 39900 },
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1038,
    nombre: 'Electrolit Hidratante Sabores Surtidos 625 ML',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ELECTROLIT HIDRATANTE SABORES SURTIDOS 625 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 8500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Electrolit Hidratante Sabores Surtidos 625 ML.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 1020 },
      { tipo: 'Frasco', precio: 8500 }
    ],
  },
  {
    id: 1039,
    nombre: 'Metroxazide Comp X 18 Tabletas',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'METROXAZIDE COMP X 18 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 12500 },
          caja: { label: 'Caja', precio: 36900 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'COMPLEJO B  X  250 TABLETAS EC',
        precios: {
          blister: { label: 'Blíster', precio: 1900 },
          caja: { label: 'Caja', precio: 45000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BIOQUIFAR PHARMACEUTICA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Metroxazide Comp X 18 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 12500 },
      { tipo: 'Caja', precio: 36900 },
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1040,
    nombre: 'Sinovul 21 Tabletas',
    laboratorios: {
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SINOVUL 21 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAFRANCOL S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Sinovul 21 Tabletas.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1300 },
      { tipo: 'Caja', precio: 6500 }
    ],
  },
  {
    id: 1041,
    nombre: 'Ceprax Cefalexina 500 MG X 50 Caps',
    laboratorios: {
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'CEPRAX CEFALEXINA 500 MG X 50 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 12000 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 10 CAPSULAS MK PROMO',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 100 CAPSULAS RC',
        precios: {
          blister: { label: 'Blíster', precio: 5900 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 10 CAPSULAS GF',
        precios: {
          caja: { label: 'Caja', precio: 6900 },
        },
      },
      aldriston: {
        nombre: 'ALDRISTON',
        nombreProducto: 'CEXGRAM-T CEFALEXINA 500 MG CAJA X 60 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 15900 },
          caja: { label: 'Caja', precio: 55000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'CEFALEXINA 500 MG X 100 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 7200 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ANGLOPHARMA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ceprax Cefalexina 500 MG X 50 Caps.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1440 },
      { tipo: 'Sobres', precio: 12000 },
      { tipo: 'Caja', precio: 35000 }
    ],
  },
  {
    id: 1042,
    nombre: 'Levotiroxina Sodica 50 MG X 50 Tab',
    laboratorios: {
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'LEVOTIROXINA SODICA 100 MG X 50 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 29800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'EUTIROX   LEVOTIROXINA SODICA   X 50MCG',
        precios: {
          caja: { label: 'Caja', precio: 38900 },
        },
      },
      merck_s_a: {
        nombre: 'MERCK S.A.',
        nombreProducto: 'EUTIROX LEVOTIROXINA SODICA 100 MCG',
        precios: {
          caja: { label: 'Caja', precio: 43000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LEVOTIROXINA SODICA 50 MCG X30 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 15500 },
        },
      },
      vital_vision: {
        nombre: 'VITAL VISION',
        nombreProducto: 'LAGRIMAS ARTIFICIALES CARBOXIMETIULOSA SODICA 5MG/',
        precios: {
          frasco: { label: 'Frasco', precio: 20500 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'WARFAR WARFARINA SODICA 5 MG X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 9000 },
          caja: { label: 'Caja', precio: 27000 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'LEVOTIROXINA 50 MG 100 TABLETAS PC',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAB.SIEGFRIED S.A',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Levotiroxina Sodica 50 MG X 50 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 920 },
      { tipo: 'Sobres', precio: 4600 },
      { tipo: 'Caja', precio: 21800 }
    ],
  },
  {
    id: 1043,
    nombre: 'Metoprolol 50 MG Caja X 30 Tab',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'METOPROLOL 50 MG LAPROFF CAJA X 30 TABS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 10500 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'METOPROLOL 50 MG CAJA X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DORALIV  CAJA X  10 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      eurofarma_colombia_s: {
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'NEOSALDINA CAJA X 25 BLISTER X 4 GRANJEAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 150000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'METOPROLOL 100 MG 30 TBS MK',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      health_care: {
        nombre: 'HEALTH CARE',
        nombreProducto: 'ADVIL ULTRA  CAJA X 72 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO  SOBRES  SURTIDOS X25MG CAJA POR 15 UND',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'MEBLAINEX  (MELOXICAM) AMPOLLA 15 MG /1,5ML  CAJA',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 12500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MEMPHIS PRODUCTS',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Metoprolol 50 MG Caja X 30 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 740 },
      { tipo: 'Sobres', precio: 3700 },
      { tipo: 'Caja', precio: 12500 }
    ],
  },
  {
    id: 1044,
    nombre: 'Cronofen Acetaminofen 500 MG 400 Tab',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'CRONOFEN ACETAMINOFEN 500 MG 400 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 80000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'ACETAMINOFEN 500 MG 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 30000 },
          frasco: { label: 'Frasco', precio: 4100 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'ACETAMINOFEN 150 MG JARABE 90 ML LS',
        precios: {
          frasco: { label: 'Frasco', precio: 8500 },
        },
      },
      gsk: {
        nombre: 'GSK',
        nombreProducto: 'DOLEX ACETAMINOFEN 500 MG MILIGRAMO(S) TABLETA REC',
        precios: {
          blister: { label: 'Blíster', precio: 8200 },
          caja: { label: 'Caja', precio: 140000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ACETAMINOFEN 160/5 MG/ML MILIGRAMO(S)/MILILITRO SO',
        precios: {
          caja: { label: 'Caja', precio: 13000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'NOVAMED S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Cronofen Acetaminofen 500 MG 400 Tab.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 800 },
      { tipo: 'Sobres', precio: 4000 },
      { tipo: 'Caja', precio: 80000 }
    ],
  },
  {
    id: 1045,
    nombre: 'Losartan 50 Mg+hct 12.5 MG 30 Tbs EC',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'LOSARTAN 50 MG+HCT 12.5 MG 15 TBS EC',
        precios: {
          caja: { label: 'Caja', precio: 26000 },
          blister: { label: 'Blíster', precio: 19800 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'LOSARTAN 50 MG 30 TABLETAS EX',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'LOSARTAN 50 MG 30 TABLETAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 5800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LOSARTAN POTASICO 5O MG 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          unidad: { label: 'Unidad', precio: 1700 },
          caja: { label: 'Caja', precio: 9000 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'LOSARTAN 50MG X 300',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'LOSARTAN 50 MG MILIGRAMO(S) TABLETA RECUBIERTA GEN',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'LOSARTAN POTASICO   100G     X  300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4800 },
          caja: { label: 'Caja', precio: 90000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Losartan 50 Mg+hct 12.5 MG 30 Tbs EC.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1584 },
      { tipo: 'Sobres', precio: 19800 },
      { tipo: 'Caja', precio: 38500 }
    ],
  },
  {
    id: 1046,
    nombre: 'Dolex Forte Caja 100 Und',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DOLEX FORTE CAJA 100 UND',
        precios: {
          blister: { label: 'Blíster', precio: 9500 },
          caja: { label: 'Caja', precio: 193523 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX FORTE NF 48 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 57600 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'CAFIASPIRINA FORTE 650/65MG TABLETAS CAJA X 12  BA',
        precios: {
          caja: { label: 'Caja', precio: 14200 },
          par: { label: 'Par', precio: 2400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dolex Forte Caja 100 Und.',
    imagen: 'img/productos/Dolex Forte caja x100 tab.jpg',
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres', precio: 9500 },
      { tipo: 'Caja', precio: 193523 },
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1047,
    nombre: 'Pastillas Vick Drops X 125 Pastillas',
    laboratorios: {
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'PASTILLAS VICK DROPS MENTOL',
        precios: {
          caja: { label: 'Caja', precio: 48276 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PASTILLAS VICK DROPS X 125 PASTILLAS',
        precios: {
          blister: { label: 'Blíster', precio: 2600 },
          frasco: { label: 'Frasco', precio: 64000 },
          unidad: { label: 'Unidad', precio: 600 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Pastillas Vick Drops X 125 Pastillas.',
    imagen: 'img/productos/Vick Drops x125 pastillas.jpg',
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 2600 },
      { tipo: 'Frasco', precio: 64000 },
      { tipo: 'Unidad', precio: 600 }
    ],
  },
  {
    id: 1048,
    nombre: 'Levotiroxina Sodica 50 Mcg X30 Tabletas MK',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LEVOTIROXINA SODICA 50 MCG X30 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 15500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'LEVOTIROXINA 50 MG 100 TABLETAS PC',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'LEVOTIROXINA SODICA 100 MG X 50 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 29800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'EUTIROX   LEVOTIROXINA SODICA   X 50MCG',
        precios: {
          caja: { label: 'Caja', precio: 38900 },
        },
      },
      merck_s_a: {
        nombre: 'MERCK S.A.',
        nombreProducto: 'EUTIROX LEVOTIROXINA SODICA 100 MCG',
        precios: {
          caja: { label: 'Caja', precio: 43000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Levotiroxina Sodica 50 Mcg X30 Tabletas MK.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1300 },
      { tipo: 'Sobres', precio: 6500 },
      { tipo: 'Caja', precio: 15500 }
    ],
  },
  {
    id: 1049,
    nombre: 'Advil Max X 72 Capsulas',
    laboratorios: {
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ADVIL GRIPA 10 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1800 },
          par: { label: 'Par', precio: 4000 },
        },
      },
      glaxo_smithkline_col: {
        nombre: 'GLAXO SMITHKLINE COLOMBIA',
        nombreProducto: 'ADVIL MAX X 72 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'APRONAX LIQUID GEL 275 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 18500 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 2000 },
          par: { label: 'Par', precio: 2600 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX ACTIVEGEL 20 CAPSULAS LIQUIDAS',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'RETIBLAN 50 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'NIFEDIPINO 30 MG 30 CAPSULAS EX',
        precios: {
          blister: { label: 'Blíster', precio: 15500 },
          caja: { label: 'Caja', precio: 45200 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'GLAXO SMITHKLINE COLOMBIA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Advil Max X 72 Capsulas.',
    imagen: 'img/productos/Advil Max x72 cáps.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 121690 },
      { tipo: 'Par', precio: 4000 },
      { tipo: 'Unidad', precio: 2200 }
    ],
  },
  {
    id: 1050,
    nombre: 'Nervi Serum Caja X 10 Ampollas',
    laboratorios: {
      distriphargo_ltda: {
        nombre: 'DISTRIPHARGO LTDA.',
        nombreProducto: 'NERVI SERUM  CAJA X 10 AMPOLLAS',
        precios: {
          ampolla: { label: 'Ampolla', precio: 25000 },
          caja: { label: 'Caja', precio: 200000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'DISTRIPHARGO LTDA.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Nervi Serum Caja X 10 Ampollas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 2000 },
      { tipo: 'Ampolla', precio: 25000 },
      { tipo: 'Caja', precio: 200000 }
    ],
  },
  {
    id: 1051,
    nombre: 'Fsco Coprologico Y Orina X50',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'FSCO COPROLOGICO Y ORINA X50',
        precios: {
          paquete: { label: 'Paquete', precio: 25000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Fsco Coprologico Y Orina X50.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 25000 },
      { tipo: 'Unidad', precio: 600 }
    ],
  },
  {
    id: 1052,
    nombre: 'Amoxicilina 500 MG X 300 Capsulas',
    laboratorios: {
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'AMOXICILINA 500 MG 50 CAPSULAS LS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'AMOXICILINA 500 MG 60 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 5500 },
          caja: { label: 'Caja', precio: 25000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'AMOXICILINA 500 MG 50 CAPSULAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'AMOXICILINA  500 MG  X  300 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 80000 },
          unidad: { label: 'Unidad', precio: 6000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'APRONAX LIQUID GEL 275 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 18500 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 2000 },
          par: { label: 'Par', precio: 2600 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX ACTIVEGEL 20 CAPSULAS LIQUIDAS',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'RETIBLAN 50 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'NIFEDIPINO 30 MG 30 CAPSULAS EX',
        precios: {
          blister: { label: 'Blíster', precio: 15500 },
          caja: { label: 'Caja', precio: 45200 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Amoxicilina 500 MG X 300 Capsulas.',
    imagen: imgMed(),
    tags: [T.vendido],
    requiereReceta: true,
    variantes: [
      { tipo: 'Caja', precio: 80000 },
      { tipo: 'Unidad', precio: 6000 }
    ],
  },
  {
    id: 1053,
    nombre: 'Buscapina Fem X 90 Tab',
    laboratorios: {
      boehringer_ingelheim: {
        nombre: 'BOEHRINGER INGELHEIM',
        nombreProducto: 'BUSCAPINA FEM X 90 TAB',
        precios: {
          caja: { label: 'Caja', precio: 152440 },
          par: { label: 'Par', precio: 3600 },
          unidad: { label: 'Unidad', precio: 1900 },
        },
      },
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'BUSCAPINA NF COMPOSITUM 325/10MG 100 TBS',
        precios: {
          caja: { label: 'Caja', precio: 140000 },
          par: { label: 'Par', precio: 3700 },
          unidad: { label: 'Unidad', precio: 2000 },
          blister: { label: 'Blíster', precio: 16000 },
          ampolla: { label: 'Ampolla', precio: 15800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BOEHRINGER INGELHEIM',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Buscapina Fem X 90 Tab.',
    imagen: 'img/productos/Buscapina Fem x90 tab.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 152440 },
      { tipo: 'Par', precio: 3600 },
      { tipo: 'Unidad', precio: 1900 }
    ],
  },
  {
    id: 1054,
    nombre: 'Dixapidin Cap Caja X 50',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'DIXAPIDIN CAP CAJA X 50',
        precios: {
          blister: { label: 'Blíster', precio: 17500 },
          caja: { label: 'Caja', precio: 87500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DORALIV  CAJA X  10 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      eurofarma_colombia_s: {
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'NEOSALDINA CAJA X 25 BLISTER X 4 GRANJEAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 150000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      health_care: {
        nombre: 'HEALTH CARE',
        nombreProducto: 'ADVIL ULTRA  CAJA X 72 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO  SOBRES  SURTIDOS X25MG CAJA POR 15 UND',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'MEBLAINEX  (MELOXICAM) AMPOLLA 15 MG /1,5ML  CAJA',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 12500 },
        },
      },
      grunenthal_colombian: {
        nombre: 'GRUNENTHAL COLOMBIANA S.A',
        nombreProducto: 'LOMOTIL 2.5 MG 12 CAJAS X 4 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABORATORIOS COASPHARMA S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dixapidin Cap Caja X 50.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1400 },
      { tipo: 'Sobres', precio: 17500 },
      { tipo: 'Caja', precio: 87500 }
    ],
  },
  {
    id: 1055,
    nombre: 'Prednisona 50 MG MK',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PREDNISONA 50 MG MK',
        precios: {
          blister: { label: 'Blíster', precio: 35800 },
          caja: { label: 'Caja', precio: 267434 },
          unidad: { label: 'Unidad', precio: 3800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Prednisona 50 MG MK.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Sobres', precio: 35800 },
      { tipo: 'Caja', precio: 267434 },
      { tipo: 'Unidad', precio: 3800 }
    ],
  },
  {
    id: 1056,
    nombre: 'Pepsamar 100 Tabletas',
    laboratorios: {
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'PEPSAMAR 100 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3200 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SANOFI AVENTIS DE COLOMBI',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Pepsamar 100 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 640 },
      { tipo: 'Sobres', precio: 3200 },
      { tipo: 'Caja', precio: 30000 }
    ],
  },
  {
    id: 1057,
    nombre: 'Alka- Seltzer 60 Tabl',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ALKA- SELTZER  60 TABL',
        precios: {
          blister: { label: 'Blíster', precio: 2400 },
          caja: { label: 'Caja', precio: 59748 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ALKA SELTZER EXTREME  CAJA X 4  SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
          unidad: { label: 'Unidad', precio: 2700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Alka- Seltzer 60 Tabl.',
    imagen: 'img/productos/Alka-Seltzer x60 tab efervescentes.jpg',
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 2400 },
      { tipo: 'Caja', precio: 59748 },
      { tipo: 'Unidad', precio: 1500 }
    ],
  },
  {
    id: 1058,
    nombre: 'Migradol (ergotamina-cafeina) Tabletas X 30 Tab',
    laboratorios: {
      salus_pharma: {
        nombre: 'SALUS PHARMA',
        nombreProducto: 'MIGRADOL (ERGOTAMINA-CAFEINA) TABLETAS X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 22000 },
          caja: { label: 'Caja', precio: 60000 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SALUS PHARMA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Migradol (ergotamina-cafeina) Tabletas X 30 Tab.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 22000 },
      { tipo: 'Caja', precio: 60000 },
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1059,
    nombre: 'Descongel Gripa 100 Cap.blanda Gelat.',
    laboratorios: {
      chalver_de_colombia: {
        nombre: 'CHALVER DE COLOMBIA',
        nombreProducto: 'DESCONGEL GRIPA 100 CAP.BLANDA GELAT.',
        precios: {
          caja: { label: 'Caja', precio: 120000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 1300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'CHALVER DE COLOMBIA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Descongel Gripa 100 Cap.blanda Gelat..',
    imagen: 'img/productos/Descongel Gripa x100 cáps blandas gelat.jpg',
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 6000 },
      { tipo: 'Caja', precio: 120000 },
      { tipo: 'Capsulas', precio: 1300 }
    ],
  },
  {
    id: 1060,
    nombre: 'Espasmydol Meto/ibup X 20 Tab',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'ESPASMYDOL METO/IBUP X 20 TAB',
        precios: {
          caja: { label: 'Caja', precio: 38000 },
          par: { label: 'Par', precio: 4000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Espasmydol Meto/ibup X 20 Tab.',
    imagen: 'img/productos/Espasmydol Metrolbup x20 tab.jpg',
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1800 },
      { tipo: 'Caja', precio: 36000 },
      { tipo: 'Par', precio: 3800 }
    ],
  },
  {
    id: 1061,
    nombre: 'Neosaldina Caja X 25 Blister X 4 Granjeas',
    laboratorios: {
      eurofarma_colombia_s: {
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'NEOSALDINA CAJA X 25 BLISTER X 4 GRANJEAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 150000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'EUROFARMA COLOMBIA S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Neosaldina Caja X 25 Blister X 4 Granjeas.',
    imagen: 'img/productos/Neosaldina x25 blister x4 grageas.jpg',
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 6000 },
      { tipo: 'Caja', precio: 150000 },
      { tipo: 'Unidad', precio: 1500 }
    ],
  },
  {
    id: 1062,
    nombre: 'Vit Max Compl B +zinc',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'VIT MAX COMPL B +ZINC',
        precios: {
          caja: { label: 'Caja', precio: 33500 },
        },
      },
      aiphex_globalpharma_: {
        nombre: 'AIPHEX GLOBALPHARMA S A S',
        nombreProducto: 'AIPHEX MULTIVIT Y MIN VIT D3 COMPLEJO B ZINC X30CA',
        precios: {
          caja: { label: 'Caja', precio: 32500 },
        },
      },
      profar_laborables_s_: {
        nombre: 'PROFAR LABORABLES S.A.',
        nombreProducto: 'COMPLEJO B CON ZINC CAJA X 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 33900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'HIDRAPLUS  75 ZINC     SURTIDO  400 ML SUERO',
        precios: {
          botella: { label: 'Botella', precio: 10600 },
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'FYBOFORT FIBRA LIQ.COMPLEX PYRUX 360 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 25900 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'ACOND.DOVE RECONSTRUCCION COMPLETA 20SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 14000 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'CRE.DEN.ORAL-B COMPLETE 50 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 4000 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'SULZINC SULFATO DE ZINC 80 ML',
        precios: {
          caja: { label: 'Caja', precio: 19900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Vit Max Compl B +zinc.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1675 },
      { tipo: 'Caja', precio: 33500 }
    ],
  },
  {
    id: 1063,
    nombre: 'Vitamina C 500 MG Ampolla',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'VITAMINA B12 1 ML 25 AMPOLLAS EC',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4900 },
          caja: { label: 'Caja', precio: 84000 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'VITAMINA E 400 U I 100 CAPSULAS COLMED',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 38000 },
        },
      },
      hartung_y_cia_s_a: {
        nombre: 'HARTUNG Y CIA S.A.',
        nombreProducto: 'REMOVEDOR LANDER VITAMINA E 35 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
      profamilia: {
        nombre: 'PROFAMILIA',
        nombreProducto: 'CYCLOFEM 1 AMPOLLA',
        precios: {
          ampolla: { label: 'Ampolla', precio: 23000 },
        },
      },
      nti_new_trade_intern: {
        nombre: 'NTI NEW TRADE INTERNATION',
        nombreProducto: 'CYCLOFEMINA 1 AMPOLLA + JERINGA',
        precios: {
          ampolla: { label: 'Ampolla', precio: 24000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'FEMELIN 0.5 ML 1 AMPOLLA',
        precios: {
          caja: { label: 'Caja', precio: 22900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Vitamina C 500 MG Ampolla.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 1776 },
      { tipo: 'Caja', precio: 14800 }
    ],
  },
  {
    id: 1064,
    nombre: 'Cefaflex Cefalexina DE 500 PR',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CEFAFLEX CEFALEXINA DE 500 PR',
        precios: {
          blister: { label: 'Blíster', precio: 12900 },
          caja: { label: 'Caja', precio: 129000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'CEFAFLEX   CEFALEXINA SUSPENSION',
        precios: {
          caja: { label: 'Caja', precio: 29900 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 10 CAPSULAS MK PROMO',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'CEPRAX CEFALEXINA 500 MG X 50 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 12000 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 100 CAPSULAS RC',
        precios: {
          blister: { label: 'Blíster', precio: 5900 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'CEFALEXINA 250 MG / 5 ML  POLVO PARA SUSP  X 60 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'CEFALEXINA 500 MG 10 CAPSULAS GF',
        precios: {
          caja: { label: 'Caja', precio: 6900 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'CEFALEXINA 250/5 MG/ML MILIGRAMO(S)/MILILITRO POLV',
        precios: {
          caja: { label: 'Caja', precio: 9000 },
        },
      },
      aldriston: {
        nombre: 'ALDRISTON',
        nombreProducto: 'CEXGRAM-T CEFALEXINA 500 MG CAJA X 60 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 15900 },
          caja: { label: 'Caja', precio: 55000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Cefaflex Cefalexina DE 500 PR.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1548 },
      { tipo: 'Sobres', precio: 12900 },
      { tipo: 'Caja', precio: 129000 }
    ],
  },
  {
    id: 1065,
    nombre: 'Verapamilo Clorhidrato 80 MG X 50 Tab Recb',
    laboratorios: {
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'VERAPAMILO CLORHIDRATO 80 MG  X 50 TAB RECB',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LA SANTE',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Verapamilo Clorhidrato 80 MG X 50 Tab Recb.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 900 },
      { tipo: 'Sobres', precio: 3000 },
      { tipo: 'Caja', precio: 15000 }
    ],
  },
  {
    id: 1066,
    nombre: 'Prednisolona 5 MG X 30 Tab Coaspharma',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'PREDNISOLONA 5 MG X 30 TAB COASPHARMA',
        precios: {
          blister: { label: 'Blíster', precio: 2600 },
          caja: { label: 'Caja', precio: 4800 },
          frasco: { label: 'Frasco', precio: 13800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABORATORIOS COASPHARMA S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Prednisolona 5 MG X 30 Tab Coaspharma.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 780 },
      { tipo: 'Sobres', precio: 2600 },
      { tipo: 'Caja', precio: 4800 }
    ],
  },
  {
    id: 1067,
    nombre: 'Pax Caliente Noche Limon / Panela 24 Sbs',
    laboratorios: {
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'PAX CALIENTE NOCHE LIMON /  PANELA  24 SBS',
        precios: {
          caja: { label: 'Caja', precio: 38400 },
          unidad: { label: 'Unidad', precio: 2800 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'NOXPIRIN F ADUL.NOCHE PANELA LIMON 24SBS',
        precios: {
          caja: { label: 'Caja', precio: 38800 },
          unidad: { label: 'Unidad', precio: 2600 },
        },
      },
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'MIELTERTOS NOCHE PANELA LIMON 6 SBSMIE N',
        precios: {
          caja: { label: 'Caja', precio: 10800 },
          unidad: { label: 'Unidad', precio: 2400 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER GRIPA NOCHE PANELA-LIMON',
        precios: {
          caja: { label: 'Caja', precio: 60310 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SANOFI AVENTIS DE COLOMBI',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Pax Caliente Noche Limon / Panela 24 Sbs.',
    imagen: 'img/productos/PAX Caliente Noche Limón-Panela x24 sbs.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 38400 },
      { tipo: 'Unidad', precio: 2800 }
    ],
  },
  {
    id: 1068,
    nombre: 'Dolicox Grip (ACETAM/CETIRI7/FENILEF/CAFEIN X 100',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'DOLICOX GRIP (ACETAM/CETIRI7/FENILEF/CAFEIN X 100',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 119000 },
          unidad: { label: 'Unidad', precio: 1400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABORATORIOS COASPHARMA S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dolicox Grip (ACETAM/CETIRI7/FENILEF/CAFEIN X 100.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 5000 },
      { tipo: 'Caja', precio: 119000 },
      { tipo: 'Unidad', precio: 1400 }
    ],
  },
  {
    id: 1069,
    nombre: 'Aspirina Ultra 500 MG 100 Tabletas',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA ULTRA 500 MG 100 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 1000 },
          par: { label: 'Par', precio: 2400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BAYER S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Aspirina Ultra 500 MG 100 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 3000 },
      { tipo: 'Caja', precio: 50000 },
      { tipo: 'Unidad', precio: 1000 }
    ],
  },
  {
    id: 1070,
    nombre: 'Ligaril-d Dipirona Sod 500MG X30 Tab',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LIGARIL-D DIPIRONA SOD  500MG  X30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 9000 },
          caja: { label: 'Caja', precio: 27000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'LIGARIL D DIPIRONA 500 MG CAJA X 10 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 9000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ligaril-d Dipirona Sod 500MG X30 Tab.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1080 },
      { tipo: 'Sobres', precio: 9000 },
      { tipo: 'Caja', precio: 27000 }
    ],
  },
  {
    id: 1071,
    nombre: 'Mareol Dimenhidrinato 50 MG X 72 Tabletas',
    laboratorios: {
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'MAREOL DIMENHIDRINATO 50 MG X 72 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 9000 },
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'PFIZER S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Mareol Dimenhidrinato 50 MG X 72 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 9000 },
      { tipo: 'Unidad', precio: 800 }
    ],
  },
  {
    id: 1072,
    nombre: 'Metocarbamol 750 MG 300 Tabletas LP',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'METOCARBAMOL 750 MG 300 TABLETAS LP',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 105000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Metocarbamol 750 MG 300 Tabletas LP.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 6500 },
      { tipo: 'Caja', precio: 105000 },
      { tipo: 'Unidad', precio: 600 }
    ],
  },
  {
    id: 1073,
    nombre: 'Dolivium Forte Ibuprofeno + Cafeina X 48 Caps',
    laboratorios: {
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'DOLIVIUM FORTE  IBUPROFENO + CAFEINA X 48 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 61900 },
          unidad: { label: 'Unidad', precio: 2100 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ICOM',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dolivium Forte Ibuprofeno + Cafeina X 48 Caps.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres', precio: 5800 },
      { tipo: 'Caja', precio: 61900 },
      { tipo: 'Unidad', precio: 2100 }
    ],
  },
  {
    id: 1074,
    nombre: 'Dexametasona 8MG/2ML Sol Iny X100 Amp',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DEXAMETASONA  8MG/2ML  SOL INY  X100 AMP',
        precios: {
          ampolla: { label: 'Ampolla', precio: 4000 },
          caja: { label: 'Caja', precio: 344850 },
          blister: { label: 'Blíster', precio: 5000 },
          unidad: { label: 'Unidad', precio: 1000 },
          frasco: { label: 'Frasco', precio: 62500 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'DEXAMETASONA 8 MG/2 ML 10 AMP VT',
        precios: {
          ampolla: { label: 'Ampolla', precio: 3500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      keops_farmaceutica: {
        nombre: 'KEOPS FARMACEUTICA',
        nombreProducto: 'VITAMINA C SURTIDO CAJA X100 KEOPS',
        precios: {
          blister: { label: 'Blíster', precio: 4600 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'SHAMPOO JOHNSONS BABY CABELLO OSCURO X100ML',
        precios: {
          unidad: { label: 'Unidad', precio: 11000 },
          frasco: { label: 'Frasco', precio: 13500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AMOXILINA POLVO SUSP 250MG/5ML   X100ML COASPHARMA',
        precios: {
          caja: { label: 'Caja', precio: 8900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dexametasona 8MG/2ML Sol Iny X100 Amp.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 800 },
      { tipo: 'Ampolla', precio: 4000 }
    ],
  },
  {
    id: 1075,
    nombre: 'Nodol Forte X 30 Tab',
    laboratorios: {
      salus_pharma: {
        nombre: 'SALUS PHARMA',
        nombreProducto: 'NODOL FORTE X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 17000 },
          caja: { label: 'Caja', precio: 38700 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'MINOXIDIL FORTE 5% LOCION 60 ML MK',
        precios: {
          frasco: { label: 'Frasco', precio: 76900 },
          caja: { label: 'Caja', precio: 59000 },
          par: { label: 'Par', precio: 6700 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX FORTE NF 48 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 57600 },
          unidad: { label: 'Unidad', precio: 1600 },
          blister: { label: 'Blíster', precio: 6500 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'CAFI ASPIRINA FORTE X 36 TAB',
        precios: {
          caja: { label: 'Caja', precio: 37500 },
          par: { label: 'Par', precio: 2200 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'LUMBAL FORTE 36 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 14000 },
          caja: { label: 'Caja', precio: 80744 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'NAPROFLASH FORTE 500 MG 80 TBS',
        precios: {
          caja: { label: 'Caja', precio: 160000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      boehringer_ingelheim: {
        nombre: 'BOEHRINGER INGELHEIM',
        nombreProducto: 'NIFLAMIN PL FORTE 15 MG 5 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 42500 },
          unidad: { label: 'Unidad', precio: 9200 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ROBITUSSIN TOS FORTE JBE 150 ML',
        precios: {
          caja: { label: 'Caja', precio: 22900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SALUS PHARMA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Nodol Forte X 30 Tab.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 17000 },
      { tipo: 'Caja', precio: 38700 },
      { tipo: 'Unidad', precio: 1300 }
    ],
  },
  {
    id: 1076,
    nombre: 'Dolex Gripa 100 Tabletas',
    laboratorios: {
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX GRIPA 100 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5300 },
          caja: { label: 'Caja', precio: 89574 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'GLAXO SMITHKLINE CONSUMER',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dolex Gripa 100 Tabletas.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 1060 },
      { tipo: 'Sobres', precio: 5300 },
      { tipo: 'Caja', precio: 89574 }
    ],
  },
  {
    id: 1077,
    nombre: 'Lincomicina Ampolla Caja X 100 U',
    laboratorios: {
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'LINCOMICINA          AMPOLLA     CAJA   X  100   U',
        precios: {
          caja: { label: 'Caja', precio: 400000 },
          unidad: { label: 'Unidad', precio: 4900 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'MEBLAINEX  (MELOXICAM) AMPOLLA 15 MG /1,5ML  CAJA',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 12500 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'DIPIRONA 2.5GR /5ML CAJA X 5 AMPOLLAS  ECAR',
        precios: {
          ampolla: { label: 'Ampolla', precio: 7500 },
          caja: { label: 'Caja', precio: 31000 },
        },
      },
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'COMPLEJO  B    AMPOLLA CAJA  X  3',
        precios: {
          ampolla: { label: 'Ampolla', precio: 5000 },
          caja: { label: 'Caja', precio: 14500 },
        },
      },
      distriphargo_ltda: {
        nombre: 'DISTRIPHARGO LTDA.',
        nombreProducto: 'NERVI SERUM  CAJA X 10 AMPOLLAS',
        precios: {
          ampolla: { label: 'Ampolla', precio: 25000 },
          caja: { label: 'Caja', precio: 200000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'VITALIS S.A C.I.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Lincomicina Ampolla Caja X 100 U.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 4900 }
    ],
  },
  {
    id: 1078,
    nombre: 'Fencafen 100 MG 50 Tabletas',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'FENCAFEN 100 MG 50 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 100000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 2000 },
          blister: { label: 'Blíster', precio: 3000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Fencafen 100 MG 50 Tabletas.',
    imagen: 'img/productos/Fencafen 100mg x50 tab.jpg',
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 5000 },
      { tipo: 'Caja', precio: 100000 },
      { tipo: 'Capsulas', precio: 2000 }
    ],
  },
  {
    id: 1079,
    nombre: 'Advil Ultra Caja X 72 Caps',
    laboratorios: {
      health_care: {
        nombre: 'HEALTH CARE',
        nombreProducto: 'ADVIL ULTRA  CAJA X 72 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ADVIL ULTRA X 40 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 69000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 2300 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ADVIL MAX IBUPROFENO CAJA X 40CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 3400 },
          caja: { label: 'Caja', precio: 68000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'HEALTH CARE',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Advil Ultra Caja X 72 Caps.',
    imagen: 'img/productos/Advil Ultra x72 cáps.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 121690 },
      { tipo: 'Par', precio: 4200 },
      { tipo: 'Unidad', precio: 2300 }
    ],
  },
  {
    id: 1080,
    nombre: 'Mieltertos Gripa Noche Pane.limon 24 Sbs',
    laboratorios: {
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'MIELTERTOS GRIPA NOCHE PANE.LIMON 24 SBS',
        precios: {
          caja: { label: 'Caja', precio: 43200 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER GRIPA NOCHE PANELA-LIMON',
        precios: {
          caja: { label: 'Caja', precio: 60310 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAB. NATURAL FRESHLY INFA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Mieltertos Gripa Noche Pane.limon 24 Sbs.',
    imagen: 'img/productos/Mieltertos Gripa Noche Panela-Limón.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 43200 },
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1081,
    nombre: 'Oferta Domeboro Polvo Pague: 25 Und Lleve: 30 Und',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'OFERTA DOMEBORO POLVO PAGUE: 25 UND LLEVE: 30 UND',
        precios: {
          blister: { label: 'Blíster', precio: 1800 },
          caja: { label: 'Caja', precio: 40000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BAYER S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Oferta Domeboro Polvo Pague: 25 Und Lleve: 30 Und.',
    imagen: imgMed(),
    tags: [T.oferta],
    variantes: [
      { tipo: 'Sobres', precio: 1800 },
      { tipo: 'Caja', precio: 40000 }
    ],
  },
  {
    id: 1082,
    nombre: 'Viceralgina (butilbromuro DE Hioscina 10 MG + Acet',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'VICERALGINA (BUTILBROMURO DE HIOSCINA 10 MG + ACET',
        precios: {
          caja: { label: 'Caja', precio: 34000 },
          par: { label: 'Par', precio: 4000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Viceralgina (butilbromuro DE Hioscina 10 MG + Acet.',
    imagen: 'img/productos/Viceralgina 10-500mg tab.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 34000 },
      { tipo: 'Par', precio: 4000 },
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1083,
    nombre: 'Sal DE Frutas 50 Sbs',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'SAL DE FRUTAS 50 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 3200 },
          caja: { label: 'Caja', precio: 85000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      levapan_s_a: {
        nombre: 'LEVAPAN S.A.',
        nombreProducto: 'COMPOTA SAN JORGE FRUTAS MIXTAS 113G',
        precios: {
          frasco: { label: 'Frasco', precio: 2400 },
        },
      },
      corchito: {
        nombre: 'CORCHITO',
        nombreProducto: 'LLAMA DIENTES FRUTAS AROMATIZADAS CORCHITO',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
      tecnofarma_s_a: {
        nombre: 'TECNOFARMA S.A',
        nombreProducto: 'SAL DE FRUTAS LUA PLUS SABOR CITRUS 22 SOBRES X 6',
        precios: {
          caja: { label: 'Caja', precio: 69619 },
          unidad: { label: 'Unidad', precio: 3400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Sal DE Frutas 50 Sbs.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 640 },
      { tipo: 'Sobres', precio: 3200 },
      { tipo: 'Caja', precio: 85000 }
    ],
  },
  {
    id: 1084,
    nombre: 'Mieltertos Gripa Dia Panela NARAN.24 Sbs',
    laboratorios: {
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'MIELTERTOS GRIPA DIA PANELA NARAN.24 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 43200 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAB. NATURAL FRESHLY INFA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Mieltertos Gripa Dia Panela NARAN.24 Sbs.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 750 },
      { tipo: 'Sobres', precio: 2500 },
      { tipo: 'Caja', precio: 43200 }
    ],
  },
  {
    id: 1085,
    nombre: 'Trimebutina SIMETICON.200/120MG 30TBS PC',
    laboratorios: {
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'TRIMEBUTINA SIMETICON.200/120MG 30TBS PC',
        precios: {
          caja: { label: 'Caja', precio: 82000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 31500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TRIMEBUTINA 200MG / SIMETICONA 120MG X10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 22000 },
          unidad: { label: 'Unidad', precio: 33000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'PROCAPS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Trimebutina SIMETICON.200/120MG 30TBS PC.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 4100 },
      { tipo: 'Caja', precio: 82000 },
      { tipo: 'Capsulas', precio: 31500 }
    ],
  },
  {
    id: 1086,
    nombre: 'Cloxidin Dicloxacilina 500MG X 30 Caps',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CLOXIDIN   DICLOXACILINA 500MG X 30 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 22900 },
          caja: { label: 'Caja', precio: 65000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'CLOXIDIN DICLOXACILINA 500MG X 20 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 17900 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Cloxidin Dicloxacilina 500MG X 30 Caps.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1832 },
      { tipo: 'Sobres', precio: 22900 },
      { tipo: 'Caja', precio: 65000 }
    ],
  },
  {
    id: 1087,
    nombre: 'Quetiapina 100 MG Genfar S.a.',
    laboratorios: {
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'QUETIAPINA 100 MG GENFAR S.A.',
        precios: {
          blister: { label: 'Blíster', precio: 19500 },
          caja: { label: 'Caja', precio: 56300 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'QUETIAPINA 25 MG 30 TBS MK',
        precios: {
          caja: { label: 'Caja', precio: 14900 },
          blister: { label: 'Blíster', precio: 8300 },
        },
      },
      humax_pharmaceutical: {
        nombre: 'HUMAX PHARMACEUTICAL',
        nombreProducto: 'QUEPINA QUETIAPINA 100 MG X 30 TABLETA RECUB',
        precios: {
          blister: { label: 'Blíster', precio: 9173 },
          caja: { label: 'Caja', precio: 33500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'GENFAR S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Quetiapina 100 MG Genfar S.a..',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1560 },
      { tipo: 'Sobres', precio: 19500 },
      { tipo: 'Caja', precio: 56300 }
    ],
  },
  {
    id: 1088,
    nombre: 'Newtarpan Desloratadina 5 MG Caja X 30 Tabletas',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'NEWTARPAN DESLORATADINA 5 MG CAJA X 30 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 15000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BIOQUIFAR PHARMACEUTICA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Newtarpan Desloratadina 5 MG Caja X 30 Tabletas.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 1800 },
      { tipo: 'Sobres', precio: 15000 },
      { tipo: 'Caja', precio: 30000 }
    ],
  },
  {
    id: 1089,
    nombre: 'Ampicilina 1G X 100 Tab',
    laboratorios: {
      la_sante: {
        nombre: 'LA SANTE',
        nombreProducto: 'AMPICILINA 250 MG SUSPENSION 60 ML LS',
        precios: {
          frasco: { label: 'Frasco', precio: 13200 },
          blister: { label: 'Blíster', precio: 6800 },
          caja: { label: 'Caja', precio: 55000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'AMPICILINA 500 MG 100 CAPSULAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 43000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'AMPICILINA   1G  X   100 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 10000 },
          caja: { label: 'Caja', precio: 100000 },
        },
      },
      vitalis_s_a_c_i: {
        nombre: 'VITALIS S.A C.I.',
        nombreProducto: 'AMPICILINA 1G POLV EST SOL INY 1 VIAL VITALIS',
        precios: {
          caja: { label: 'Caja', precio: 5000 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'AMPICILINA 500 MG X100CAPS  GENFAR S.A.',
        precios: {
          blister: { label: 'Blíster', precio: 8100 },
          caja: { label: 'Caja', precio: 60000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AMPICILINA 500MG CAJA X50CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 17500 },
        },
      },
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'AMPICILINA 500 MG CAJA X 100CAP',
        precios: {
          blister: { label: 'Blíster', precio: 5500 },
          caja: { label: 'Caja', precio: 52000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'Genérico',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ampicilina 1G X 100 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1200 },
      { tipo: 'Sobres', precio: 10000 },
      { tipo: 'Caja', precio: 100000 }
    ],
  },
  {
    id: 1090,
    nombre: 'Levotiroxina Sodica 100 MG X 50 Tab',
    laboratorios: {
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'LEVOTIROXINA SODICA 100 MG X 50 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 29800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'EUTIROX   LEVOTIROXINA SODICA   X 50MCG',
        precios: {
          caja: { label: 'Caja', precio: 38900 },
        },
      },
      merck_s_a: {
        nombre: 'MERCK S.A.',
        nombreProducto: 'EUTIROX LEVOTIROXINA SODICA 100 MCG',
        precios: {
          caja: { label: 'Caja', precio: 43000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'LEVOTIROXINA SODICA 50 MCG X30 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 15500 },
        },
      },
      vital_vision: {
        nombre: 'VITAL VISION',
        nombreProducto: 'LAGRIMAS ARTIFICIALES CARBOXIMETIULOSA SODICA 5MG/',
        precios: {
          frasco: { label: 'Frasco', precio: 20500 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'WARFAR WARFARINA SODICA 5 MG X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 9000 },
          caja: { label: 'Caja', precio: 27000 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'LEVOTIROXINA 50 MG 100 TABLETAS PC',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAB.SIEGFRIED S.A',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Levotiroxina Sodica 100 MG X 50 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1300 },
      { tipo: 'Sobres', precio: 6500 },
      { tipo: 'Caja', precio: 29800 }
    ],
  },
  {
    id: 1091,
    nombre: 'Captopril 50 MG 30 Tabletas RC',
    laboratorios: {
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'CAPTOPRIL 25 MG 30 TABLETAS RC',
        precios: {
          caja: { label: 'Caja', precio: 5200 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BUSSIE S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Captopril 50 MG 30 Tabletas RC.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1240 },
      { tipo: 'Caja', precio: 6200 }
    ],
  },
  {
    id: 1092,
    nombre: 'Captopril 25 MG 30 Tabletas RC',
    laboratorios: {
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'CAPTOPRIL 25 MG 30 TABLETAS RC',
        precios: {
          caja: { label: 'Caja', precio: 5200 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BUSSIE S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Captopril 25 MG 30 Tabletas RC.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1040 },
      { tipo: 'Caja', precio: 5200 }
    ],
  },
  {
    id: 1093,
    nombre: 'Fluoxetina 20 MG',
    laboratorios: {
      mk: {
        nombre: 'MK',
        nombreProducto: 'FLUOXETINA 20MG  MK',
        precios: {
          caja: { label: 'Caja', precio: 12900 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'FLUOXETINA 20 MG',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 12000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAFRANCOL S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Fluoxetina 20 MG.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 800 },
      { tipo: 'Sobres', precio: 4000 },
      { tipo: 'Caja', precio: 12000 }
    ],
  },
  {
    id: 1094,
    nombre: 'Apronax 550 MG 60 Tabletas',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'APRONAX 550 MG 20 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 43000 },
          unidad: { label: 'Unidad', precio: 2500 },
          blister: { label: 'Blíster', precio: 2500 },
          par: { label: 'Par', precio: 2600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BAYER S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Apronax 550 MG 60 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 195000 },
      { tipo: 'Unidad', precio: 3300 }
    ],
  },
  {
    id: 1095,
    nombre: 'Flunarizina 1OMG Caja X 20 Tab',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'FLUNARIZINA 1OMG CAJA X 20 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2400 },
          caja: { label: 'Caja', precio: 4000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABORATORIOS COASPHARMA S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Flunarizina 1OMG Caja X 20 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 720 },
      { tipo: 'Sobres', precio: 2400 },
      { tipo: 'Caja', precio: 4000 }
    ],
  },
  {
    id: 1096,
    nombre: 'Dolorsin Fem 36 Capsulas',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'DOLORSIN FEM 36 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 8500 },
          caja: { label: 'Caja', precio: 71706 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'APRONAX LIQUID GEL 275 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 18500 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 2000 },
          par: { label: 'Par', precio: 2600 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX ACTIVEGEL 20 CAPSULAS LIQUIDAS',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'RETIBLAN 50 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'NIFEDIPINO 30 MG 30 CAPSULAS EX',
        precios: {
          blister: { label: 'Blíster', precio: 15500 },
          caja: { label: 'Caja', precio: 45200 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'NOVAMED S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Dolorsin Fem 36 Capsulas.',
    imagen: 'img/productos/Dolorsin Fem x36 cápsulas.jpg',
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 8500 },
      { tipo: 'Caja', precio: 71706 },
      { tipo: 'Unidad', precio: 2200 }
    ],
  },
  {
    id: 1097,
    nombre: 'Ciruelax Minitabs 60 Comprimidos',
    laboratorios: {
      scandinavia_pharma_l: {
        nombre: 'SCANDINAVIA PHARMA  LTDA',
        nombreProducto: 'CIRUELAX MINITABS 60 COMPRIMIDOS',
        precios: {
          blister: { label: 'Blíster', precio: 1800 },
          caja: { label: 'Caja', precio: 45000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SCANDINAVIA PHARMA LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ciruelax Minitabs 60 Comprimidos.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1800 },
      { tipo: 'Caja', precio: 45000 }
    ],
  },
  {
    id: 1098,
    nombre: 'Sulfato DE Magnesia 50 Sbs 20 GR Disanfe',
    laboratorios: {
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'SULFATO DE MAGNESIA 50 SBS 20 GR DISANFE',
        precios: {
          bolsa: { label: 'Bolsa', precio: 600 },
          paquete: { label: 'Paquete', precio: 25000 },
          caja: { label: 'Caja', precio: 3500 },
        },
      },
      promegan_ltda: {
        nombre: 'PROMEGAN LTDA',
        nombreProducto: 'SULFATO DE MAGNESIA 500G',
        precios: {
          bolsa: { label: 'Bolsa', precio: 3700 },
          caja: { label: 'Caja', precio: 1800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'DIST. DISANFER LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Sulfato DE Magnesia 50 Sbs 20 GR Disanfe.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Bolsa', precio: 600 },
      { tipo: 'Paquete', precio: 25000 }
    ],
  },
  {
    id: 1099,
    nombre: 'Advil Gripa 72 Capsulas',
    laboratorios: {
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ADVIL GRIPA 10 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1800 },
          par: { label: 'Par', precio: 4000 },
        },
      },
      glaxo_smithkline_col: {
        nombre: 'GLAXO SMITHKLINE COLOMBIA',
        nombreProducto: 'ADVIL MAX X 72 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ADVIL GRIPA MULTISINTOMAS CAJA X 20 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 36900 },
          unidad: { label: 'Unidad', precio: 1900 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'ADVIL GRIPA MAX X 40 CAPS LIQUIDA',
        precios: {
          caja: { label: 'Caja', precio: 88000 },
          par: { label: 'Par', precio: 4500 },
          unidad: { label: 'Unidad', precio: 2400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'PFIZER S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Advil Gripa 72 Capsulas.',
    imagen: 'img/productos/Advil Gripa x72 cáps.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 122400 },
      { tipo: 'Par', precio: 4000 },
      { tipo: 'Unidad', precio: 2200 }
    ],
  },
  {
    id: 1100,
    nombre: 'Acido Borico 50 Sbs 10 GR Disanfer',
    laboratorios: {
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'ACIDO BORICO 50 SBS 10 GR DISANFER',
        precios: {
          paquete: { label: 'Paquete', precio: 20000 },
          unidad: { label: 'Unidad', precio: 600 },
          bolsa: { label: 'Bolsa', precio: 14500 },
          caja: { label: 'Caja', precio: 5200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ACIDO BORICO CAJA X 500 GR MASIVOS',
        precios: {
          caja: { label: 'Caja', precio: 11500 },
        },
      },
      lab_athos_s_a_s: {
        nombre: 'LAB. ATHOS S.A.S',
        nombreProducto: 'ACIDO BORICO 400 GR ATHOS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 8600 },
        },
      },
      isfarmacol_ltda: {
        nombre: 'ISFARMACOL LTDA.',
        nombreProducto: 'ACIDO BORICO 100G',
        precios: {
          caja: { label: 'Caja', precio: 3500 },
        },
      },
      productos_drogam_s_a: {
        nombre: 'PRODUCTOS DROGAM S.A.S',
        nombreProducto: 'DROGAM ACIDO BORICO 250 GRAMOS',
        precios: {
          caja: { label: 'Caja', precio: 6500 },
        },
      },
      lab_drofarma_s_a_s: {
        nombre: 'LAB.DROFARMA S.A.S',
        nombreProducto: 'ACIDO BORICO  X 10 GRAMOS',
        precios: {
          caja: { label: 'Caja', precio: 3700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'DIST. DISANFER LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Acido Borico 50 Sbs 10 GR Disanfer.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 20000 },
      { tipo: 'Unidad', precio: 600 }
    ],
  },
  {
    id: 1101,
    nombre: 'Prot.sol.sundays Kar.alo.fps 50 LC.24 SB',
    laboratorios: {
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'PROT.SOL.SUNDAYS KAR.ALO.FPS 50 LC.24 SB',
        precios: {
          blister: { label: 'Blíster', precio: 2800 },
          caja: { label: 'Caja', precio: 48000 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'SHAMPO H&S PROTECCION CAIDA 180 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 10900 },
        },
      },
      colombiana_kimberly_: {
        nombre: 'COLOMBIANA KIMBERLY COLPA',
        nombreProducto: 'PROT.KOTEX PH DUO AJUSTABLE 15 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 2200 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PROT.NOSOTRAS DIARIOS LARGOS 15 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 4200 },
          caja: { label: 'Caja', precio: 19500 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JABON NEKO EXTRAPROTECCION 125 GR',
        precios: {
          caja: { label: 'Caja', precio: 4600 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'JABON PROTEX AVENA 120 GR',
        precios: {
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      hartung_y_cia_s_a: {
        nombre: 'HARTUNG Y CIA S.A.',
        nombreProducto: 'REMOVEDOR LANDER PROTEINA 35 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAB.SIEGFRIED S.A',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Prot.sol.sundays Kar.alo.fps 50 LC.24 SB.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 840 },
      { tipo: 'Sobres', precio: 2800 },
      { tipo: 'Caja', precio: 48000 }
    ],
  },
  {
    id: 1102,
    nombre: 'Ferbin Acido Valproico 250M Cap DE Cubierta Dura N',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'FERBIN ACIDO VALPROICO 250M CAP DE CUBIERTA DURA N',
        precios: {
          blister: { label: 'Blíster', precio: 12800 },
          caja: { label: 'Caja', precio: 55000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'NOVAMED S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ferbin Acido Valproico 250M Cap DE Cubierta Dura N.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1536 },
      { tipo: 'Sobres', precio: 12800 },
      { tipo: 'Caja', precio: 55000 }
    ],
  },
  {
    id: 1103,
    nombre: 'Metronidazol 500 MG 200 Ovulos PC',
    laboratorios: {
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'METRONIDAZOL 500 MG 200 OVULOS PC',
        precios: {
          blister: { label: 'Blíster', precio: 7000 },
          caja: { label: 'Caja', precio: 90000 },
          unidad: { label: 'Unidad', precio: 7000 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'METRONIST METRONIDAZOL 500 MG OVULOS CAJA X 10',
        precios: {
          blister: { label: 'Blíster', precio: 18000 },
          caja: { label: 'Caja', precio: 32000 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'MEBICITROF METRONIDAZOL SUSP 250 MG X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 22900 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'METRONIDAZOL SUSPENSION 250 MG / 5 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 7600 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ISODINE OVULOS 200MG YODOVPOVI  X24 OVUL',
        precios: {
          caja: { label: 'Caja', precio: 72000 },
          unidad: { label: 'Unidad', precio: 3100 },
        },
      },
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'MIKIUM METRONIDAZOL 10 % PORCENTAJE CREMA 40 GRAMO',
        precios: {
          caja: { label: 'Caja', precio: 45000 },
        },
      },
      ruecam: {
        nombre: 'RUECAM',
        nombreProducto: 'LINDAZOL-2PLUS  CLOTRI+CLINDA  X 3 OVULOS',
        precios: {
          caja: { label: 'Caja', precio: 45500 },
        },
      },
      tridex_s_a: {
        nombre: 'TRIDEX S.A.',
        nombreProducto: 'CLINDABACT  CLOTRI+CLINDA  X 3 OVULOS',
        precios: {
          caja: { label: 'Caja', precio: 35500 },
        },
      },
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'FEMDUO METRONIDAZOL 500 MG MILIGRAMO(S) OVULO COLM',
        precios: {
          blister: { label: 'Blíster', precio: 25000 },
          caja: { label: 'Caja', precio: 45000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'PROCAPS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Metronidazol 500 MG 200 Ovulos PC.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1400 },
      { tipo: 'Sobres', precio: 7000 },
      { tipo: 'Caja', precio: 90000 }
    ],
  },
  {
    id: 1104,
    nombre: 'Sildenafil 50 MG 100 Tab',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'SILDENAFIL 50 MG X 2 TAB COASPHARMA',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'SILDENAFILO 50 MG MILIGRAMO(S) TABLETA RECUBIERTA',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
          blister: { label: 'Blíster', precio: 6000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'VIGRADINA     SILDENAFILO 50MG X 2 TAB',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'BIFLACE SILDENAFILO 50 MG  TAB MASTICABLE',
        precios: {
          caja: { label: 'Caja', precio: 14000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'EROXIM SILDENAFILO 50 MG',
        precios: {
          caja: { label: 'Caja', precio: 21300 },
        },
      },
      colmed: {
        nombre: 'COLMED',
        nombreProducto: 'GELPIN SILDENAFILO 50 MG MILIGRAMO(S) CAPSULA DE G',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
        },
      },
      altea_farmaceutica_s: {
        nombre: 'ALTEA FARMACEUTICA S.A.',
        nombreProducto: 'VYASIL SILDENAFIL 50 MG X 2 TAB',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BUSSIE S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Sildenafil 50 MG 100 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1200 },
      { tipo: 'Sobres', precio: 6000 },
      { tipo: 'Caja', precio: 280000 }
    ],
  },
  {
    id: 1105,
    nombre: 'Ampicilina 500MG Caja X50CAPS',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AMPICILINA 500MG CAJA X50CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 17500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABORATORIOS COASPHARMA S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ampicilina 500MG Caja X50CAPS.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1160 },
      { tipo: 'Sobres', precio: 5800 },
      { tipo: 'Caja', precio: 17500 }
    ],
  },
  {
    id: 1106,
    nombre: 'Ditopax F Sin Azucar Sabor Naranja Caja X 25TAB',
    laboratorios: {
      eurofarma_colombia_s: {
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'DITOPAX F  SIN AZUCAR SABOR NARANJA CAJA X 25TAB',
        precios: {
          blister: { label: 'Blíster', precio: 5600 },
          caja: { label: 'Caja', precio: 27500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'EUROFARMA COLOMBIA S.A.S',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ditopax F Sin Azucar Sabor Naranja Caja X 25TAB.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1120 },
      { tipo: 'Sobres', precio: 5600 },
      { tipo: 'Caja', precio: 27500 }
    ],
  },
  {
    id: 1107,
    nombre: 'Enalapril 5MG X 50 Tabletas',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ENALAPRIL  5MG  X 50  TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 16000 },
        },
      },
      medicbrand: {
        nombre: 'MEDICBRAND',
        nombreProducto: 'ENALAPRIL MALEATO 20 MG X 330 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 42000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Enalapril 5MG X 50 Tabletas.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 800 },
      { tipo: 'Sobres', precio: 4000 },
      { tipo: 'Caja', precio: 16000 }
    ],
  },
  {
    id: 1108,
    nombre: 'Metronidazol 500 MG Caja X 100 Tabs Lab Ecar',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'METRONIDAZOL 500 MG CAJA X 100 TABS  LAB ECAR',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 17000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Metronidazol 500 MG Caja X 100 Tabs Lab Ecar.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 900 },
      { tipo: 'Sobres', precio: 3000 },
      { tipo: 'Caja', precio: 17000 }
    ],
  },
  {
    id: 1109,
    nombre: 'Clinbac 300 MG X 24 Caps',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'CLINBAC 300 MG X 24 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 27900 },
          caja: { label: 'Caja', precio: 49000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NOXPIRIN PLUS CAPS ADLUTOS DIA NOCHE X  120 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 114000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'APRONAX LIQUID GEL 275 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 18500 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 2000 },
          par: { label: 'Par', precio: 2600 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX ACTIVEGEL 20 CAPSULAS LIQUIDAS',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'RETIBLAN 50 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'NIFEDIPINO 30 MG 30 CAPSULAS EX',
        precios: {
          blister: { label: 'Blíster', precio: 15500 },
          caja: { label: 'Caja', precio: 45200 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Clinbac 300 MG X 24 Caps.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 2232 },
      { tipo: 'Sobres', precio: 27900 },
      { tipo: 'Caja', precio: 49000 }
    ],
  },
  {
    id: 1110,
    nombre: 'Zifluvis 200 MG X 30 Sobres',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'ZIFLUVIS 200 MG X 30 SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 1600 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      labinco_s_a: {
        nombre: 'LABINCO S.A.',
        nombreProducto: 'SOLHIDREX SABORES SURT   X  30 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 42000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PEG POLIETILENGLICOL 3350 12 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 82821 },
          unidad: { label: 'Unidad', precio: 6900 },
          blister: { label: 'Blíster', precio: 1000 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'ARAWAK DESPIGMENTADOR X 12 SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 24000 },
        },
      },
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'SALYDRAT SALES DE REHIDRATACION X 25 SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO  SOBRES  SURTIDOS X25MG CAJA POR 15 UND',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DTE BALANCE CLINICAL PROTEC POR 18 SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 800 },
          caja: { label: 'Caja', precio: 14400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BIOQUIFAR PHARMACEUTICA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Zifluvis 200 MG X 30 Sobres.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1600 },
      { tipo: 'Caja', precio: 36000 }
    ],
  },
  {
    id: 1111,
    nombre: 'Losartan Potasico 100G X 300 Tabletas',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'LOSARTAN POTASICO   100G     X  300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4800 },
          caja: { label: 'Caja', precio: 90000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LOSARTAN POTASICO 5O MG 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          unidad: { label: 'Unidad', precio: 1700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Losartan Potasico 100G X 300 Tabletas.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 960 },
      { tipo: 'Sobres', precio: 4800 },
      { tipo: 'Caja', precio: 90000 }
    ],
  },
  {
    id: 1112,
    nombre: 'Movidol 48 Tabletas',
    laboratorios: {
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'MOVIDOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 8700 },
          caja: { label: 'Caja', precio: 62400 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAFRANCOL S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Movidol 48 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1044 },
      { tipo: 'Sobres', precio: 8700 },
      { tipo: 'Caja', precio: 62400 },
      { tipo: 'Par', precio: 3000 }
    ],
  },
  {
    id: 1113,
    nombre: 'Novalgina Metamizol Sodico Dipirona 500 MG 50 Tbs',
    laboratorios: {
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'NOVALGINA METAMIZOL SODICO DIPIRONA 500 MG 50 TBS',
        precios: {
          blister: { label: 'Blíster', precio: 22000 },
          caja: { label: 'Caja', precio: 103000 },
          unidad: { label: 'Unidad', precio: 2600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SANOFI AVENTIS DE COLOMBI',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Novalgina Metamizol Sodico Dipirona 500 MG 50 Tbs.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 22000 },
      { tipo: 'Caja', precio: 103000 },
      { tipo: 'Unidad', precio: 2600 }
    ],
  },
  {
    id: 1114,
    nombre: 'Vigradina 50 MG X 4 Tab',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'VIGRADINA 50 MG X 4 TAB',
        precios: {
          caja: { label: 'Caja', precio: 19800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'VIGRADINA     SILDENAFILO 50MG X 2 TAB',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Vigradina 50 MG X 4 Tab.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1584 },
      { tipo: 'Caja', precio: 19800 }
    ],
  },
  {
    id: 1115,
    nombre: 'Bonfiest Plus X 32 Unds',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'BONFIEST PLUS  X 32 UNDS',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 102400 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'PRO PLUS OF.CEPILLO DENTAL  2 UNDS MEDIANO',
        precios: {
          caja: { label: 'Caja', precio: 17600 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'TAMPON NOSOTRAS APLICADOR SUPER PLUS 8UNDS',
        precios: {
          caja: { label: 'Caja', precio: 14800 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Bonfiest Plus X 32 Unds.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 800 },
      { tipo: 'Sobres', precio: 4000 },
      { tipo: 'Caja', precio: 102400 }
    ],
  },
  {
    id: 1116,
    nombre: 'Resfrygrip Plus X 25 Sobvres',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'RESFRYGRIP PLUS X 25 SOBVRES',
        precios: {
          caja: { label: 'Caja', precio: 37500 },
          unidad: { label: 'Unidad', precio: 2600 },
          blister: { label: 'Blíster', precio: 12000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Resfrygrip Plus X 25 Sobvres.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 37500 },
      { tipo: 'Unidad', precio: 2600 }
    ],
  },
  {
    id: 1117,
    nombre: 'Ibuflash Migran X30 Caps',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'IBUFLASH  MIGRAN  X30 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 62674 },
          par: { label: 'Par', precio: 4700 },
          blister: { label: 'Blíster', precio: 9200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ibuflash Migran X30 Caps.',
    imagen: 'img/productos/Ibuflash Migrán x30 cáps.jpg',
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 3134 },
      { tipo: 'Caja', precio: 62674 },
      { tipo: 'Par', precio: 4700 }
    ],
  },
  {
    id: 1118,
    nombre: 'Sedatif PC 40 Tabletas',
    laboratorios: {
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEDATIF PC 40 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 57500 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 1800 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAFRANCOL S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Sedatif PC 40 Tabletas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 2875 },
      { tipo: 'Caja', precio: 57500 },
      { tipo: 'Capsulas', precio: 1800 }
    ],
  },
  {
    id: 1119,
    nombre: 'Eucarbon Laxante Herbal Tableta Ropsohn Therapeuti',
    laboratorios: {
      ropsohn_therapeutics: {
        nombre: 'ROPSOHN THERAPEUTICS S.A.S.',
        nombreProducto: 'EUCARBON LAXANTE HERBAL TABLETA ROPSOHN THERAPEUTI',
        precios: {
          blister: { label: 'Blíster', precio: 21500 },
          caja: { label: 'Caja', precio: 62300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ROPSOHN THERAPEUTICS S.A.S.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Eucarbon Laxante Herbal Tableta Ropsohn Therapeuti.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1720 },
      { tipo: 'Sobres', precio: 21500 },
      { tipo: 'Caja', precio: 62300 }
    ],
  },
  {
    id: 1120,
    nombre: 'Eutarpan 10 MG X 100 Tab',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'EUTARPAN 10 MG X 100 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 25000 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'EUTARPAN  LORATADINA 10 MG  X10',
        precios: {
          caja: { label: 'Caja', precio: 9800 },
        },
      },
      prosodent_ltda: {
        nombre: 'PROSODENT LTDA.',
        nombreProducto: 'EUTARPAN LORATADINA 1MG / 1 ML X 120ML',
        precios: {
          caja: { label: 'Caja', precio: 20500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Eutarpan 10 MG X 100 Tab.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1500 },
      { tipo: 'Sobres', precio: 7500 },
      { tipo: 'Caja', precio: 25000 }
    ],
  },
  {
    id: 1121,
    nombre: 'Clorfeniramina 4 MG X 20 Tab',
    laboratorios: {
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'CLORFENIRAMINA JARABE 120 ML EC',
        precios: {
          frasco: { label: 'Frasco', precio: 5900 },
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 4000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'CLORFENIRAMINA MALEATO 4 MG X 20 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 3500 },
        },
      },
      labinco_s_a: {
        nombre: 'LABINCO S.A.',
        nombreProducto: 'CLORFENIRAMINA 2/5 MG/ML  SOL JARABE 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5600 },
        },
      },
      lab_licol_ltda: {
        nombre: 'LAB. LICOL LTDA',
        nombreProducto: 'CLORFENIRAMINA 2/5 MG/ML  SOLUCION JARABE 120 MILI',
        precios: {
          frasco: { label: 'Frasco', precio: 5500 },
        },
      },
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'CLORFENIRAMINA MALEATO 2MG/5ML 120ML',
        precios: {
          caja: { label: 'Caja', precio: 5900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ECAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Clorfeniramina 4 MG X 20 Tab.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 750 },
      { tipo: 'Sobres', precio: 2500 },
      { tipo: 'Caja', precio: 4000 }
    ],
  },
  {
    id: 1122,
    nombre: 'Gaviscon Doble Accion SUSP.10 ML X 12UDS',
    laboratorios: {
      rb_health_colombia: {
        nombre: 'RB HEALTH COLOMBIA',
        nombreProducto: 'GAVISCON DOBLE ACCION SUSP.10 ML X 12UDS',
        precios: {
          caja: { label: 'Caja', precio: 36000 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'RB HEALTH COLOMBIA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Gaviscon Doble Accion SUSP.10 ML X 12UDS.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 36000 },
      { tipo: 'Unidad', precio: 3500 }
    ],
  },
  {
    id: 1123,
    nombre: 'Calmidol Compuesto 48 Grageas',
    laboratorios: {
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'CALMIDOL COMPUESTO 48 GRAGEAS',
        precios: {
          blister: { label: 'Blíster', precio: 24000 },
          caja: { label: 'Caja', precio: 57600 },
          par: { label: 'Par', precio: 4000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SANOFI AVENTIS DE COLOMBI',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Calmidol Compuesto 48 Grageas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1920 },
      { tipo: 'Sobres', precio: 24000 },
      { tipo: 'Caja', precio: 57600 },
      { tipo: 'Par', precio: 4000 }
    ],
  },
  {
    id: 1124,
    nombre: 'Mieltertos Pastillas Masticables 12 Sbs',
    laboratorios: {
      lab_natural_freshly_: {
        nombre: 'LAB. NATURAL FRESHLY INFA',
        nombreProducto: 'MIELTERTOS PASTILLAS MASTICABLES 12 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 24000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAB. NATURAL FRESHLY INFA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Mieltertos Pastillas Masticables 12 Sbs.',
    imagen: 'img/productos/Mieltertos Pastillas Masticables x12 sbs.jpg',
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 750 },
      { tipo: 'Sobres', precio: 2500 },
      { tipo: 'Caja', precio: 24000 }
    ],
  },
  {
    id: 1125,
    nombre: 'Apositos Oculares Adultos X20UNDS',
    laboratorios: {
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'APOSITOS OCULARES  ADULTOS  X20UNDS',
        precios: {
          caja: { label: 'Caja', precio: 17500 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BEGUT',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Apositos Oculares Adultos X20UNDS.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 17500 },
      { tipo: 'Unidad', precio: 1000 }
    ],
  },
  {
    id: 1126,
    nombre: 'Apotox Silimarina 150 MG X 20 Capsulas',
    laboratorios: {
      lab_incobra_s_a: {
        nombre: 'LAB. INCOBRA S.A.',
        nombreProducto: 'APOTOX SILIMARINA 150 MG X 20 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 22000 },
          caja: { label: 'Caja', precio: 38000 },
          par: { label: 'Par', precio: 5500 },
        },
      },
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'SILIMARINA 150 MG 20 CAPSULAS GF',
        precios: {
          blister: { label: 'Blíster', precio: 11500 },
          caja: { label: 'Caja', precio: 21000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAB. INCOBRA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Apotox Silimarina 150 MG X 20 Capsulas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1760 },
      { tipo: 'Sobres', precio: 22000 },
      { tipo: 'Caja', precio: 38000 },
      { tipo: 'Par', precio: 5500 }
    ],
  },
  {
    id: 1127,
    nombre: 'Enalapril Maleato 20 MG X 330 Tabletas',
    laboratorios: {
      medicbrand: {
        nombre: 'MEDICBRAND',
        nombreProducto: 'ENALAPRIL MALEATO 20 MG X 330 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 42000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ENALAPRIL  5MG  X 50  TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 16000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MEDICBRAND',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Enalapril Maleato 20 MG X 330 Tabletas.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 750 },
      { tipo: 'Sobres', precio: 2500 },
      { tipo: 'Caja', precio: 42000 }
    ],
  },
  {
    id: 1128,
    nombre: 'Fluimucil 200 MG 30 Sbs',
    laboratorios: {
      zambon: {
        nombre: 'ZAMBON',
        nombreProducto: 'FLUIMUCIL 200 MG 30 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 39000 },
          frasco: { label: 'Frasco', precio: 37800 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'ZAMBON',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Fluimucil 200 MG 30 Sbs.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 600 },
      { tipo: 'Sobres', precio: 2000 },
      { tipo: 'Caja', precio: 39000 }
    ],
  },
  {
    id: 1129,
    nombre: 'Ibuprofeno 800 MG 30 Capsulas Blandas MK Tecnoquim',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'IBUPROFENO 800 MG 30 CAPSULAS BLANDAS MK TECNOQUIM',
        precios: {
          blister: { label: 'Blíster', precio: 6400 },
          caja: { label: 'Caja', precio: 37000 },
          unidad: { label: 'Unidad', precio: 1400 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ibuprofeno 800 MG 30 Capsulas Blandas MK Tecnoquim.',
    imagen: 'img/productos/MK 800mg 30 cáps blandas.jpg',
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres', precio: 6400 },
      { tipo: 'Caja', precio: 37000 },
      { tipo: 'Unidad', precio: 1400 }
    ],
  },
  {
    id: 1130,
    nombre: 'Naproflash Forte 500 MG 80 Tbs',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'NAPROFLASH FORTE 500 MG 80 TBS',
        precios: {
          caja: { label: 'Caja', precio: 160000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'MINOXIDIL FORTE 5% LOCION 60 ML MK',
        precios: {
          frasco: { label: 'Frasco', precio: 76900 },
          caja: { label: 'Caja', precio: 59000 },
          par: { label: 'Par', precio: 6700 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX FORTE NF 48 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 57600 },
          unidad: { label: 'Unidad', precio: 1600 },
          blister: { label: 'Blíster', precio: 6500 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'CAFI ASPIRINA FORTE X 36 TAB',
        precios: {
          caja: { label: 'Caja', precio: 37500 },
          par: { label: 'Par', precio: 2200 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'LUMBAL FORTE 36 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 14000 },
          caja: { label: 'Caja', precio: 80744 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      salus_pharma: {
        nombre: 'SALUS PHARMA',
        nombreProducto: 'NODOL FORTE X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 17000 },
          caja: { label: 'Caja', precio: 38700 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      boehringer_ingelheim: {
        nombre: 'BOEHRINGER INGELHEIM',
        nombreProducto: 'NIFLAMIN PL FORTE 15 MG 5 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 42500 },
          unidad: { label: 'Unidad', precio: 9200 },
        },
      },
      pfizer_s_a_s: {
        nombre: 'PFIZER S.A.S',
        nombreProducto: 'ROBITUSSIN TOS FORTE JBE 150 ML',
        precios: {
          caja: { label: 'Caja', precio: 22900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'NOVAMED S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Naproflash Forte 500 MG 80 Tbs.',
    imagen: 'img/productos/Naproflash Forte 500mg x80 tab.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 160000 },
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1131,
    nombre: 'Buscapina NF Compositum 325/10MG 100 Tbs',
    laboratorios: {
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'BUSCAPINA NF COMPOSITUM 325/10MG 100 TBS',
        precios: {
          caja: { label: 'Caja', precio: 140000 },
          par: { label: 'Par', precio: 3700 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SANOFI AVENTIS DE COLOMBI',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Buscapina NF Compositum 325/10MG 100 Tbs.',
    imagen: 'img/productos/Buscapina NF Comp. 325-10mg x100 tab.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 140000 },
      { tipo: 'Par', precio: 3700 },
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1132,
    nombre: 'Lass Adultos 50 Supositorios',
    laboratorios: {
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'LASS ADULTOS 50 SUPOSITORIOS',
        precios: {
          frasco: { label: 'Frasco', precio: 50000 },
          unidad: { label: 'Unidad', precio: 1900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BUSSIE S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Lass Adultos 50 Supositorios.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Frasco', precio: 50000 },
      { tipo: 'Unidad', precio: 1900 }
    ],
  },
  {
    id: 1133,
    nombre: 'Congestex 60 Capsulas',
    laboratorios: {
      novamed_s_a: {
        nombre: 'NOVAMED S.A.',
        nombreProducto: 'CONGESTEX 60 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'APRONAX LIQUID GEL 275 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 18500 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 2000 },
          par: { label: 'Par', precio: 2600 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX ACTIVEGEL 20 CAPSULAS LIQUIDAS',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'RETIBLAN 50 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 7500 },
          caja: { label: 'Caja', precio: 35000 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'NIFEDIPINO 30 MG 30 CAPSULAS EX',
        precios: {
          blister: { label: 'Blíster', precio: 15500 },
          caja: { label: 'Caja', precio: 45200 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'NOVAMED S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Congestex 60 Capsulas.',
    imagen: 'img/productos/Congestex x60 cápsulas.jpg',
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1200 },
      { tipo: 'Sobres', precio: 6000 },
      { tipo: 'Par', precio: 3000 }
    ],
  },
  {
    id: 1134,
    nombre: 'Noraver Gripa Y Tos Fast Total X 60 Caps Liq',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'NORAVER GRIPA Y  TOS FAST TOTAL X 60 CAPS LIQ',
        precios: {
          caja: { label: 'Caja', precio: 168674 },
          par: { label: 'Par', precio: 5600 },
          unidad: { label: 'Unidad', precio: 2900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Noraver Gripa Y Tos Fast Total X 60 Caps Liq.',
    imagen: 'img/productos/Noraver Gripa+Tos Fast x60 cáps liq.jpg',
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Caja', precio: 168674 },
      { tipo: 'Par', precio: 5600 },
      { tipo: 'Unidad', precio: 2900 }
    ],
  },
  {
    id: 1135,
    nombre: 'Calmidol Max 48 Grageas',
    laboratorios: {
      sanofi_aventis_de_co: {
        nombre: 'SANOFI AVENTIS DE COLOMBI',
        nombreProducto: 'CALMIDOL MAX 48 GRAGEAS',
        precios: {
          caja: { label: 'Caja', precio: 94000 },
          par: { label: 'Par', precio: 4300 },
          unidad: { label: 'Unidad', precio: 2200 },
          blister: { label: 'Blíster', precio: 24000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'NORVETAL 21 GRAGEAS',
        precios: {
          caja: { label: 'Caja', precio: 9300 },
        },
      },
      b_c_n_medical_s_a: {
        nombre: 'B C N MEDICAL S.A',
        nombreProducto: 'ACTIVA 21 21 GRAGEAS',
        precios: {
          caja: { label: 'Caja', precio: 7800 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'DICLOFENACO 50 MILIGRAMOS 250 GRAGEAS',
        precios: {
          blister: { label: 'Blíster', precio: 2000 },
          caja: { label: 'Caja', precio: 50000 },
        },
      },
      tecnofarma_s_a: {
        nombre: 'TECNOFARMA S.A',
        nombreProducto: 'MICROGYNON SUAVE 21 GRAGEAS',
        precios: {
          caja: { label: 'Caja', precio: 7600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'SANOFI AVENTIS DE COLOMBI',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Calmidol Max 48 Grageas.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 94000 },
      { tipo: 'Par', precio: 4300 },
      { tipo: 'Unidad', precio: 2200 }
    ],
  },
  {
    id: 1136,
    nombre: 'Ainedix Aceclofenaco 100 MG Caja X 10 Tab',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'AINEDIX  ACECLOFENACO 100 MG CAJA X 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 16800 },
          par: { label: 'Par', precio: 3500 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ainedix Aceclofenaco 100 MG Caja X 10 Tab.',
    imagen: 'img/productos/Aceclofenaco 100mg x10 tab.jpg',
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 16800 },
      { tipo: 'Par', precio: 3500 },
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1137,
    nombre: 'Trimebutina 200 MG 300 Tabletas 30 Sobres',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'TRIMEBUTINA 200 MG 300 TABLETAS   30 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 112705 },
          unidad: { label: 'Unidad', precio: 6500 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'TRAZODONA 50 MG CAJA 250 TABLETAS   25 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 56125 },
          unidad: { label: 'Unidad', precio: 2600 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LAPROFF',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Trimebutina 200 MG 300 Tabletas 30 Sobres.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 112705 },
      { tipo: 'Unidad', precio: 6500 }
    ],
  },
  {
    id: 1138,
    nombre: 'Gestavit Dha 30 Capsulas',
    laboratorios: {
      procaps_s_a: {
        nombre: 'PROCAPS S.A.',
        nombreProducto: 'GESTAVIT DHA 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 94000 },
          blister: { label: 'Blíster', precio: 7500 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'APRONAX LIQUID GEL 275 MG 50 CAPSULAS',
        precios: {
          blister: { label: 'Blíster', precio: 18500 },
          caja: { label: 'Caja', precio: 100000 },
          unidad: { label: 'Unidad', precio: 2000 },
          par: { label: 'Par', precio: 2600 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX ACTIVEGEL 20 CAPSULAS LIQUIDAS',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
          par: { label: 'Par', precio: 3000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      expofarma: {
        nombre: 'EXPOFARMA',
        nombreProducto: 'NIFEDIPINO 30 MG 30 CAPSULAS EX',
        precios: {
          blister: { label: 'Blíster', precio: 15500 },
          caja: { label: 'Caja', precio: 45200 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'CLORURO DE MAGNESIO 30 CAPSULAS',
        precios: {
          caja: { label: 'Caja', precio: 16300 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'PROCAPS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Gestavit Dha 30 Capsulas.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 4700 },
      { tipo: 'Caja', precio: 94000 }
    ],
  },
  {
    id: 1139,
    nombre: 'Duraflex Espalda Forte X 18 Caps',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DURAFLEX ESPALDA FORTE X 18 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 59000 },
          par: { label: 'Par', precio: 6700 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Duraflex Espalda Forte X 18 Caps.',
    imagen: 'img/productos/Duraflex Espalda Forte x18 cáps.jpg',
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 2950 },
      { tipo: 'Caja', precio: 59000 },
      { tipo: 'Par', precio: 6700 }
    ],
  },
  {
    id: 1140,
    nombre: 'Mio Rela Tizanidina 4 MG X 10 Tab',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'MIO RELA   TIZANIDINA  4 MG X 10 TAB',
        precios: {
          caja: { label: 'Caja', precio: 36900 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 4000 },
          blister: { label: 'Blíster', precio: 19000 },
          unidad: { label: 'Unidad', precio: 4000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'RELAXFULL  DICLOFENACO GEL 1%   50GR',
        precios: {
          caja: { label: 'Caja', precio: 19800 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'GOICOECHEA PIERNAS RELAJADAS DOBLE MENTOL Y CENTEL',
        precios: {
          caja: { label: 'Caja', precio: 25000 },
        },
      },
      nestle_de_colombia_s: {
        nombre: 'NESTLE DE COLOMBIA S.A.',
        nombreProducto: 'NESTUM CEREAL INFANTIL CERELAC 360 GRAMOS NESTLE D',
        precios: {
          caja: { label: 'Caja', precio: 19200 },
        },
      },
      copidrogas: {
        nombre: 'COPIDROGAS',
        nombreProducto: 'RELAXUS VALERIANA CAPSULA COOPIDROGAS',
        precios: {
          caja: { label: 'Caja', precio: 22000 },
        },
      },
      recamier_s_a: {
        nombre: 'RECAMIER S.A.',
        nombreProducto: 'KARTIFLEX COMPLEX  RELAJANTE CORP  60  G',
        precios: {
          caja: { label: 'Caja', precio: 29000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Mio Rela Tizanidina 4 MG X 10 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1845 },
      { tipo: 'Caja', precio: 36900 },
      { tipo: 'Capsulas', precio: 4000 }
    ],
  },
  {
    id: 1141,
    nombre: 'Alviret 800 Tab Caja X 10',
    laboratorios: {
      hetero_labs_limited: {
        nombre: 'HETERO LABS LIMITED',
        nombreProducto: 'ALVIRET 800 TAB CAJA X 10',
        precios: {
          caja: { label: 'Caja', precio: 22900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DORALIV  CAJA X  10 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      eurofarma_colombia_s: {
        nombre: 'EUROFARMA COLOMBIA S.A.S',
        nombreProducto: 'NEOSALDINA CAJA X 25 BLISTER X 4 GRANJEAS',
        precios: {
          blister: { label: 'Blíster', precio: 6000 },
          caja: { label: 'Caja', precio: 150000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      health_care: {
        nombre: 'HEALTH CARE',
        nombreProducto: 'ADVIL ULTRA  CAJA X 72 CAPS',
        precios: {
          caja: { label: 'Caja', precio: 121690 },
          par: { label: 'Par', precio: 4200 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO  SOBRES  SURTIDOS X25MG CAJA POR 15 UND',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'MEBLAINEX  (MELOXICAM) AMPOLLA 15 MG /1,5ML  CAJA',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 12500 },
        },
      },
      grunenthal_colombian: {
        nombre: 'GRUNENTHAL COLOMBIANA S.A',
        nombreProducto: 'LOMOTIL 2.5 MG 12 CAJAS X 4 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 8500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'HETERO LABS LIMITED',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Alviret 800 Tab Caja X 10.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1832 },
      { tipo: 'Caja', precio: 22900 }
    ],
  },
  {
    id: 1142,
    nombre: 'Supribac F Sulfamet 800 MG + Trimet 160 MG X 10TAB',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'SUPRIBAC F SULFAMET 800 MG + TRIMET 160 MG X 10TAB',
        precios: {
          caja: { label: 'Caja', precio: 19500 },
          frasco: { label: 'Frasco', precio: 22900 },
        },
      },
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'SUPRIBAC  TRIMETOPRIM 80 MG/ SULFAMETOXAZOL400MG C',
        precios: {
          blister: { label: 'Blíster', precio: 8000 },
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 19500 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Supribac F Sulfamet 800 MG + Trimet 160 MG X 10TAB.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1560 },
      { tipo: 'Caja', precio: 19500 }
    ],
  },
  {
    id: 1143,
    nombre: 'Diexsoprazol Esomeprazol 40 MG X 30 Caps',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'DIEXSOPRAZOL ESOMEPRAZOL 20 MG X 10 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 10000 },
          caja: { label: 'Caja', precio: 19800 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BIOQUIFAR PHARMACEUTICA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Diexsoprazol Esomeprazol 40 MG X 30 Caps.',
    imagen: imgMed(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 1800 },
      { tipo: 'Sobres', precio: 15000 },
      { tipo: 'Caja', precio: 28000 }
    ],
  },
  {
    id: 1144,
    nombre: 'Metoprolol 50 MG 30 Tabletas GF',
    laboratorios: {
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'METOPROLOL 50 MG 30 TABLETAS GF',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      ropsohn_therapeutics: {
        nombre: 'ROPSOHN THERAPEUTICS',
        nombreProducto: 'BETOPROLOL METOPROLOL 100 MG 30 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 5800 },
          caja: { label: 'Caja', precio: 15000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'GENFAR S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Metoprolol 50 MG 30 Tabletas GF.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1500 },
      { tipo: 'Caja', precio: 12500 }
    ],
  },
  {
    id: 1145,
    nombre: 'Vaio 8 MG Betahistina Diclorhidrato X 30 Tab',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'VAIO 8 MG BETAHISTINA DICLORHIDRATO  X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 11000 },
          caja: { label: 'Caja', precio: 30000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BIOQUIFAR PHARMACEUTICA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Vaio 8 MG Betahistina Diclorhidrato X 30 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1320 },
      { tipo: 'Sobres', precio: 11000 },
      { tipo: 'Caja', precio: 30000 }
    ],
  },
  {
    id: 1146,
    nombre: 'Warfar Warfarina Sodica 5 MG X 30 Tab',
    laboratorios: {
      labquifar_ltda: {
        nombre: 'LABQUIFAR LTDA',
        nombreProducto: 'WARFAR WARFARINA SODICA 5 MG X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 9000 },
          caja: { label: 'Caja', precio: 27000 },
        },
      },
      salus_pharma: {
        nombre: 'SALUS PHARMA',
        nombreProducto: 'WARFARINA 5MG CAJA X 30 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 10000 },
          caja: { label: 'Caja', precio: 27000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'LABQUIFAR LTDA',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Warfar Warfarina Sodica 5 MG X 30 Tab.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1080 },
      { tipo: 'Sobres', precio: 9000 },
      { tipo: 'Caja', precio: 27000 }
    ],
  },
  {
    id: 1147,
    nombre: 'Mexicam 7.5 MG X 30 Tab Bioquifar',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'MEXICAM 7.5 MG X 30 TAB BIOQUIFAR',
        precios: {
          blister: { label: 'Blíster', precio: 8900 },
          caja: { label: 'Caja', precio: 26000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BIOQUIFAR PHARMACEUTICA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Mexicam 7.5 MG X 30 Tab Bioquifar.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1068 },
      { tipo: 'Sobres', precio: 8900 },
      { tipo: 'Caja', precio: 26000 }
    ],
  },
  {
    id: 1148,
    nombre: 'Ketoprofeno 100 MG 30 Tabletas GF',
    laboratorios: {
      genfar_s_a: {
        nombre: 'GENFAR S.A.',
        nombreProducto: 'KETOPROFENO 100 MG 30 TABLETAS GF',
        precios: {
          blister: { label: 'Blíster', precio: 8500 },
          caja: { label: 'Caja', precio: 24000 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'GENFAR S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Ketoprofeno 100 MG 30 Tabletas GF.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1020 },
      { tipo: 'Sobres', precio: 8500 },
      { tipo: 'Caja', precio: 24000 }
    ],
  },
  {
    id: 1149,
    nombre: 'Asmiket Ketotifeno 1 MG',
    laboratorios: {
      bioquifar_pharmaceut: {
        nombre: 'BIOQUIFAR PHARMACEUTICA S.A.',
        nombreProducto: 'ASMIKET KETOTIFENO 1 MG',
        precios: {
          blister: { label: 'Blíster', precio: 8000 },
          caja: { label: 'Caja', precio: 15000 },
          frasco: { label: 'Frasco', precio: 22900 },
        },
      },
      blaskov: {
        nombre: 'BLASKOV',
        nombreProducto: 'BLASKET KETOTIFENO 0.5MG /ML FRASCO 5 ML LAB BLASC',
        precios: {
          caja: { label: 'Caja', precio: 60900 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'KETOTIFENO JBE  1 MG / 5 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 7000 },
        },
      },
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'KETOTIFENO 20 MG SOL  JBE  X  100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5700 },
        },
      },
      bussie_s_a: {
        nombre: 'BUSSIE S.A.',
        nombreProducto: 'KETOTIFENO 1 MG  X 30 TAB',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 6900 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'BIOQUIFAR PHARMACEUTICA S.A.',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Asmiket Ketotifeno 1 MG.',
    imagen: imgMed(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1600 },
      { tipo: 'Sobres', precio: 8000 },
      { tipo: 'Caja', precio: 15000 }
    ],
  },
  {
    id: 1150,
    nombre: 'Alopurinol 300 MG 30 Tbs MP',
    laboratorios: {
      memphis_products: {
        nombre: 'MEMPHIS PRODUCTS',
        nombreProducto: 'ALOPURINOL 300 MG 30 TBS MP',
        precios: {
          blister: { label: 'Blíster', precio: 6500 },
          caja: { label: 'Caja', precio: 18000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'ALOPURINOL 100 MG 30 TABLETAS AG',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 12000 },
        },
      },
    },
    categoria: 'Medicamentos',
    marca: 'MEMPHIS PRODUCTS',
    descripcion: 'Producto farmacéutico de alta calidad certificado. Alopurinol 300 MG 30 Tbs MP.',
    imagen: imgMed(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Unidad', precio: 1300 },
      { tipo: 'Sobres', precio: 6500 },
      { tipo: 'Caja', precio: 18000 }
    ],
  },
  {
    id: 1151,
    nombre: 'Jeringa 10 ML 21X 1/12 Alfa X 100 Unds',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'JERINGA 10 ML 21X 1/12 ALFA X 100 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 700 },
          caja: { label: 'Caja', precio: 20000 },
          par: { label: 'Par', precio: 1500 },
        },
      },
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'JERINGA DESECHABLE ESTERIL 1 ML X100UNDS',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
      precision_care: {
        nombre: 'PRECISIÓN CARE',
        nombreProducto: 'JERINGA 50 ML  AGJ 21G X 1 1/2 X 25 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      rymco: {
        nombre: 'RYMCO',
        nombreProducto: 'JERINGA 10ML X 10UNDS',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
      becton_dickinson: {
        nombre: 'BECTON DICKINSON',
        nombreProducto: 'BD ULTRA FINE JERINGA INSULINA  X  10 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 9500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ALFA TRADING LTDA',
    descripcion: 'Producto de higiene y cuidado personal. Jeringa 10 ML 21X 1/12 Alfa X 100 Unds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 700 }
    ],
  },
  {
    id: 1152,
    nombre: 'Jerinha 5CM Iverfarma Caja 100 Und',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'JERINHA  5CM  IVERFARMA  CAJA 100 UND',
        precios: {
          caja: { label: 'Caja', precio: 46000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Producto de higiene y cuidado personal. Jerinha 5CM Iverfarma Caja 100 Und.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 46000 },
      { tipo: 'Unidad', precio: 600 }
    ],
  },
  {
    id: 1153,
    nombre: 'Jeringa Begut 10 ML',
    laboratorios: {
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'JERINGA BEGUT 10 ML',
        precios: {
          caja: { label: 'Caja', precio: 62000 },
          unidad: { label: 'Unidad', precio: 700 },
          blister: { label: 'Blíster', precio: 4200 },
        },
      },
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'JERINGA 10 ML 21X 1/12 ALFA X 100 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 700 },
          caja: { label: 'Caja', precio: 20000 },
        },
      },
      nti_new_trade_intern: {
        nombre: 'NTI NEW TRADE INTERNATION',
        nombreProducto: 'CYCLOFEMINA 1 AMPOLLA + JERINGA',
        precios: {
          ampolla: { label: 'Ampolla', precio: 24000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'NOFERTYL AMPOLLA 1 ML C/JERINGA',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
      seven_pharma_colombi: {
        nombre: 'SEVEN PHARMA COLOMBIA SAS',
        nombreProducto: 'BEGUT CURITAS ADHESIVAS COLOR PIEL',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
          paquete: { label: 'Paquete', precio: 1000 },
          unidad: { label: 'Unidad', precio: 100 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'JERINGA DESECH ESTERIL 5ML X 100',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'BEGUT',
    descripcion: 'Producto de higiene y cuidado personal. Jeringa Begut 10 ML.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 62000 },
      { tipo: 'Unidad', precio: 700 }
    ],
  },
  {
    id: 1154,
    nombre: 'Lizmar Plus Limas Para Uñas Caja X 144',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LIZMAR  PLUS LIMAS  PARA UÑAS CAJA X 144',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Producto de higiene y cuidado personal. Lizmar Plus Limas Para Uñas Caja X 144.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 800 }
    ],
  },
  {
    id: 1155,
    nombre: 'Gasa Alfa Est.no TEJ.3X3 50 Sbs X 6 Uds',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'GASA ALFA ASEPTICA 1X1',
        precios: {
          caja: { label: 'Caja', precio: 1500 },
          unidad: { label: 'Unidad', precio: 1000 },
          blister: { label: 'Blíster', precio: 1000 },
          paquete: { label: 'Paquete', precio: 2600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ALFA TRADING LTDA',
    descripcion: 'Producto de higiene y cuidado personal. Gasa Alfa Est.no TEJ.3X3 50 Sbs X 6 Uds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 48000 },
      { tipo: 'Unidad', precio: 1000 }
    ],
  },
  {
    id: 1156,
    nombre: 'Guantes Examen Talla S',
    laboratorios: {
      eterna_s_a: {
        nombre: 'ETERNA S.A.',
        nombreProducto: 'GUANTES EXAMEN TALLA S',
        precios: {
          caja: { label: 'Caja', precio: 30000 },
          par: { label: 'Par', precio: 1500 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GUANTES SILICONADO TALLA M X12UND',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ETERNA S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Guantes Examen Talla S.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 30000 },
      { tipo: 'Par', precio: 1500 }
    ],
  },
  {
    id: 1157,
    nombre: 'Guantes DE Latex Presicion Talla M Caja X 100 Und',
    laboratorios: {
      eterna_s_a: {
        nombre: 'ETERNA S.A.',
        nombreProducto: 'GUANTES DE LATEX PRESICION TALLA M CAJA X 100 UND',
        precios: {
          caja: { label: 'Caja', precio: 30000 },
          par: { label: 'Par', precio: 1500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ETERNA S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Guantes DE Latex Presicion Talla M Caja X 100 Und.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 30000 },
      { tipo: 'Par', precio: 1500 }
    ],
  },
  {
    id: 1158,
    nombre: 'Prepack Today Surtidos Paq 3 Und PG25LLV30',
    laboratorios: {
      haleon_colombia: {
        nombre: 'HALEON COLOMBIA',
        nombreProducto: 'PREPACK TODAY SURTIDOS PAQ 3 UND  PG25LLV30',
        precios: {
          caja: { label: 'Caja', precio: 401000 },
          unidad: { label: 'Unidad', precio: 15500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'HALEON COLOMBIA',
    descripcion: 'Producto de higiene y cuidado personal. Prepack Today Surtidos Paq 3 Und PG25LLV30.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 15500 }
    ],
  },
  {
    id: 1159,
    nombre: 'Alfasafe Guante Latex Surtido',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'ALFASAFE GUANTE LATEX  SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 14300 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'FAST CARE GUANTE LATEX SURTIDO',
        precios: {
          paquete: { label: 'Paquete', precio: 10500 },
          par: { label: 'Par', precio: 1000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ALFA TRADING LTDA',
    descripcion: 'Producto de higiene y cuidado personal. Alfasafe Guante Latex Surtido.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 14300 },
      { tipo: 'Unidad', precio: 1500 }
    ],
  },
  {
    id: 1160,
    nombre: 'Gillette Prestobarba 2 Hojas Ristra X 24 Unds',
    laboratorios: {
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'GILLETTE PRESTOBARBA 2 HOJAS RISTRA X 24 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 50000 },
          unidad: { label: 'Unidad', precio: 3200 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'PROCTER GAMBLE COLOMBIA',
    descripcion: 'Producto de higiene y cuidado personal. Gillette Prestobarba 2 Hojas Ristra X 24 Unds.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Ristra', precio: 50000 },
      { tipo: 'Unidad', precio: 3200 }
    ],
  },
  {
    id: 1161,
    nombre: 'Crema Colgate Menta X 60 ML',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CREMA COLGATE MENTA X 60 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 3800 },
          caja: { label: 'Caja', precio: 22800 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'CREMA COREGA 3D.ULTRA MENTA 40 GR',
        precios: {
          caja: { label: 'Caja', precio: 43500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA COLGATE LUMINOS WHITE  REMUEVE MANCHAS DE VI',
        precios: {
          caja: { label: 'Caja', precio: 23900 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'COLGATE PALMOLIVE CIA.',
    descripcion: 'Producto de higiene y cuidado personal. Crema Colgate Menta X 60 ML.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 3800 }
    ],
  },
  {
    id: 1162,
    nombre: 'Pañuelos A LA Mano',
    laboratorios: {
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAÑUELOS A LA MANO',
        precios: {
          caja: { label: 'Caja', precio: 14000 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      colombiana_kimberly_: {
        nombre: 'COLOMBIANA KIMBERLY COLPA',
        nombreProducto: 'PAÑUELOS KLEENEX PAQUET X 10',
        precios: {
          paquete: { label: 'Paquete', precio: 1200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MANOS LIBRES W INFINITE LISTENING ML-205',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'PRODUCTOS FAMILIA S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Pañuelos A LA Mano.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 14000 },
      { tipo: 'Unidad', precio: 1600 }
    ],
  },
  {
    id: 1163,
    nombre: 'Jeringa Insulina 0.5 X 31G 1/3',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'JERINGA INSULINA 1ML CON AGUJA 30G X 1/3MM',
        precios: {
          caja: { label: 'Caja', precio: 37000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      becton_dickinson: {
        nombre: 'BECTON DICKINSON',
        nombreProducto: 'BD ULTRA FINE JERINGA INSULINA  X  10 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 9500 },
        },
      },
      medispo: {
        nombre: 'MEDISPO',
        nombreProducto: 'JERINGA ESTERIL 1ML INSULINA',
        precios: {
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
      nti_new_trade_intern: {
        nombre: 'NTI NEW TRADE INTERNATION',
        nombreProducto: 'CYCLOFEMINA 1 AMPOLLA + JERINGA',
        precios: {
          ampolla: { label: 'Ampolla', precio: 24000 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'NOFERTYL AMPOLLA 1 ML C/JERINGA',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'JERINGA BEGUT 10 ML',
        precios: {
          caja: { label: 'Caja', precio: 62000 },
          unidad: { label: 'Unidad', precio: 700 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ALFA TRADING LTDA',
    descripcion: 'Producto de higiene y cuidado personal. Jeringa Insulina 0.5 X 31G 1/3.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 700 }
    ],
  },
  {
    id: 1164,
    nombre: 'Algodon Zig Zag MK 25 GR',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ALGODON ZIG ZAG MK 50 GR',
        precios: {
          paquete: { label: 'Paquete', precio: 41500 },
          unidad: { label: 'Unidad', precio: 4200 },
        },
      },
      medical_supplies_cor: {
        nombre: 'MEDICAL SUPPLIES CORP S.A',
        nombreProducto: 'VENDA ALGODON LAMINADO MEDICAL 5X5',
        precios: {
          paquete: { label: 'Paquete', precio: 3500 },
          unidad: { label: 'Unidad', precio: 4800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ALGODON POMOS 100 GR JGB',
        precios: {
          paquete: { label: 'Paquete', precio: 7200 },
        },
      },
      option_s_a: {
        nombre: 'OPTION S.A.',
        nombreProducto: 'COPITO  MEDICARE  ALGODON X 50 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 4800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'COTONETES COPITO FLEXIBLE ALGODON JOHNSON Y JOHNSO',
        precios: {
          caja: { label: 'Caja', precio: 14700 },
        },
      },
      copidrogas: {
        nombre: 'COPIDROGAS',
        nombreProducto: 'AMOROSITO PROM APLICADOR ALGODON COOPIDROGAS',
        precios: {
          frasco: { label: 'Frasco', precio: 4200 },
        },
      },
      jgb_s_a: {
        nombre: 'JGB S.A.',
        nombreProducto: 'ALGODON JGB  25G  X7UNDS',
        precios: {
          caja: { label: 'Caja', precio: 20000 },
          unidad: { label: 'Unidad', precio: 2900 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Algodon Zig Zag MK 25 GR.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 27500 },
      { tipo: 'Unidad', precio: 2700 }
    ],
  },
  {
    id: 1165,
    nombre: 'Jeringa 50 ML Agj 21G X 1 1/2 X 25 Unds',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'JERINGA 10 ML 21X 1/12 ALFA X 100 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 700 },
          caja: { label: 'Caja', precio: 20000 },
          bolsa: { label: 'Bolsa', precio: 23500 },
        },
      },
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'JERINGA DESECHABLE ESTERIL 1 ML X100UNDS',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
      precision_care: {
        nombre: 'PRECISIÓN CARE',
        nombreProducto: 'JERINGA 50 ML  AGJ 21G X 1 1/2 X 25 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      rymco: {
        nombre: 'RYMCO',
        nombreProducto: 'JERINGA 10ML X 10UNDS',
        precios: {
          caja: { label: 'Caja', precio: 50000 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
      becton_dickinson: {
        nombre: 'BECTON DICKINSON',
        nombreProducto: 'BD ULTRA FINE JERINGA INSULINA  X  10 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 9500 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'TOA.NOSOTRAS NATURAL INV.CLAS.TELA X 30 UNDS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 12800 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      colombiana_kimberly_: {
        nombre: 'COLOMBIANA KIMBERLY COLPA',
        nombreProducto: 'TAMPONES KOTEX DIG MEDIO RISTRA X 5 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 10000 },
          unidad: { label: 'Unidad', precio: 2800 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'BONFIEST PLUS  X 32 UNDS',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 102400 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'PRECISIÓN CARE',
    descripcion: 'Producto de higiene y cuidado personal. Jeringa 50 ML Agj 21G X 1 1/2 X 25 Unds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1166,
    nombre: 'Guante DE Nitrilo Negro Tallas Surt X 24 Unds',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'GUANTE NITRILO NEGRO ALFASAF X 12 UNDS TALLAS SURT',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      alfasafe: {
        nombre: 'Alfasafe',
        nombreProducto: 'GUANTE  DE NITRILO NEGRO TALLAS SURT  X 24 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
          par: { label: 'Par', precio: 1500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Alfasafe',
    descripcion: 'Producto de higiene y cuidado personal. Guante DE Nitrilo Negro Tallas Surt X 24 Unds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 10000 },
      { tipo: 'Par', precio: 1500 }
    ],
  },
  {
    id: 1167,
    nombre: 'Suero Fisiologico Clor.sodio 500 ML 1323',
    laboratorios: {
      baxter_s_a: {
        nombre: 'BAXTER S.A.',
        nombreProducto: 'SUERO FISIOLOGICO CLOR.SODIO 500 ML 1323',
        precios: {
          bolsa: { label: 'Bolsa', precio: 4000 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'BAXTER S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Suero Fisiologico Clor.sodio 500 ML 1323.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Bolsa', precio: 4000 }
    ],
  },
  {
    id: 1168,
    nombre: 'Shampoo Dove Reconstruccion + Kerat X 24 Sbs 18 ML',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'SHAMPOO DOVE RECONSTRUCCION + KERAT X 24 SBS 18 ML',
        precios: {
          caja: { label: 'Caja', precio: 23000 },
          ristra: { label: 'Ristra', precio: 12000 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Producto de higiene y cuidado personal. Shampoo Dove Reconstruccion + Kerat X 24 Sbs 18 ML.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 23000 },
      { tipo: 'Ristra', precio: 12000 },
      { tipo: 'Unidad', precio: 1200 }
    ],
  },
  {
    id: 1169,
    nombre: 'Pañal Content Medical X 10 Unds Talla M',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL CONTENT  MEDICAL X 10 UNDS TALLA M',
        precios: {
          caja: { label: 'Caja', precio: 34000 },
          unidad: { label: 'Unidad', precio: 3800 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL CONTENT MDEICAL X 10 UNDS TALLA L',
        precios: {
          caja: { label: 'Caja', precio: 35000 },
          unidad: { label: 'Unidad', precio: 3900 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Pañal Content Medical X 10 Unds Talla M.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 34000 },
      { tipo: 'Unidad', precio: 3800 }
    ],
  },
  {
    id: 1170,
    nombre: 'Nexcare Prom Micropore Cinta Quirurgica Sin Fabric',
    laboratorios: {
      '3m': {
        nombre: '3M',
        nombreProducto: 'NEXCARE PROM MICROPORE CINTA QUIRURGICA SIN FABRIC',
        precios: {
          caja: { label: 'Caja', precio: 7708 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: '3M',
    descripcion: 'Producto de higiene y cuidado personal. Nexcare Prom Micropore Cinta Quirurgica Sin Fabric.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 7708 },
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1171,
    nombre: 'Pan.tena Basic Gde.tipo Tela 21 Uds',
    laboratorios: {
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PAN.TENA BASIC MED.TIPO TELA 21 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 54000 },
          unidad: { label: 'Unidad', precio: 2900 },
          caja: { label: 'Caja', precio: 56300 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'PRODUCTOS FAMILIA SANCELA',
    descripcion: 'Producto de higiene y cuidado personal. Pan.tena Basic Gde.tipo Tela 21 Uds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 56300 }
    ],
  },
  {
    id: 1172,
    nombre: 'Cepillo Dental Pro DE Lux 425 Suave',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CEPILLO DENTAL PRO DE LUX 425 SUAVE',
        precios: {
          blister: { label: 'Blíster', precio: 3800 },
          caja: { label: 'Caja', precio: 40000 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'COLGATE PROM CEPILLO SUAVE 360 COLGATE PALMOLIVE C',
        precios: {
          caja: { label: 'Caja', precio: 17500 },
        },
      },
      proquident_s_a: {
        nombre: 'PROQUIDENT S.A.',
        nombreProducto: 'PROQUIDENT PROM CREMA CEPILLO DENTAL 100G',
        precios: {
          unidad: { label: 'Unidad', precio: 9500 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'PRO PLUS OF.CEPILLO DENTAL  2 UNDS MEDIANO',
        precios: {
          caja: { label: 'Caja', precio: 17600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Producto de higiene y cuidado personal. Cepillo Dental Pro DE Lux 425 Suave.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 3800 },
      { tipo: 'Caja', precio: 40000 }
    ],
  },
  {
    id: 1173,
    nombre: 'Cateters Nelaton Sondas Calibres Surt',
    laboratorios: {
      life_care: {
        nombre: 'LIFE CARE',
        nombreProducto: 'CATETERS NELATON SONDAS CALIBRES SURT',
        precios: {
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'LIFE CARE',
    descripcion: 'Producto de higiene y cuidado personal. Cateters Nelaton Sondas Calibres Surt.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1174,
    nombre: 'Crema Colgate Triple Accion PG60LLV75ML',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA COLGATE TRIPLE ACCION  PG60LLV75ML',
        precios: {
          caja: { label: 'Caja', precio: 4000 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CREMA DENTAL COLGATE TRIPLE ACCION 3X125 ML',
        precios: {
          caja: { label: 'Caja', precio: 23800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Producto de higiene y cuidado personal. Crema Colgate Triple Accion PG60LLV75ML.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 4000 }
    ],
  },
  {
    id: 1175,
    nombre: 'Alfasafe Guante Vinilo Tallas Surt X 24 Unds',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'ALFASAFE GUANTE VINILO TALLAS SURT X 24 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 12000 },
          par: { label: 'Par', precio: 1500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ALFA TRADING LTDA',
    descripcion: 'Producto de higiene y cuidado personal. Alfasafe Guante Vinilo Tallas Surt X 24 Unds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 12000 },
      { tipo: 'Par', precio: 1500 }
    ],
  },
  {
    id: 1176,
    nombre: 'Pañuelos Cuidado Gripal X 18 Unds',
    laboratorios: {
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAÑUELOS CUIDADO GRIPAL X 18 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'PRODUCTOS FAMILIA S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Pañuelos Cuidado Gripal X 18 Unds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 16000 },
      { tipo: 'Unidad', precio: 1800 }
    ],
  },
  {
    id: 1177,
    nombre: 'Gel Ego Sobres Surtidos X25MG Caja Por 15 Und',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO  SOBRES  SURTIDOS X25MG CAJA POR 15 UND',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      naissant: {
        nombre: 'Naissant',
        nombreProducto: 'SHAMPOO NAISSANT SURTIDOS CAJA X 12 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 55000 },
          unidad: { label: 'Unidad', precio: 5800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'UNILEVER ANDINA COLOMBIA',
    descripcion: 'Producto de higiene y cuidado personal. Gel Ego Sobres Surtidos X25MG Caja Por 15 Und.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 15000 },
      { tipo: 'Unidad', precio: 1300 }
    ],
  },
  {
    id: 1178,
    nombre: 'Recolector Orina PED.BOLSA.INV.25 Uds',
    laboratorios: {
      inverfarma_sas: {
        nombre: 'INVERFARMA SAS',
        nombreProducto: 'RECOLECTOR ORINA PED.BOLSA.INV.25 UDS',
        precios: {
          paquete: { label: 'Paquete', precio: 15000 },
          unidad: { label: 'Unidad', precio: 600 },
          caja: { label: 'Caja', precio: 11000 },
        },
      },
      eterna_s_a: {
        nombre: 'ETERNA S.A.',
        nombreProducto: 'BOLSA RECOLECTORA ORINA 2000ML',
        precios: {
          caja: { label: 'Caja', precio: 9000 },
        },
      },
      gran_andina_de_plast: {
        nombre: 'GRAN ANDINA DE PLASTICOS',
        nombreProducto: 'RECOLECTOR DE ORINA 24 HORAS',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
      medical_nissi_sas: {
        nombre: 'MEDICAL NISSI SAS',
        nombreProducto: 'FRASCO RECOLECTOR DE ORINA 24 HORAS',
        precios: {
          unidad: { label: 'Unidad', precio: 11500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'INVERFARMA SAS',
    descripcion: 'Producto de higiene y cuidado personal. Recolector Orina PED.BOLSA.INV.25 Uds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 15000 },
      { tipo: 'Unidad', precio: 600 }
    ],
  },
  {
    id: 1179,
    nombre: 'Micropore Piel 24X3 Bolsa PG2 LL3',
    laboratorios: {
      tres_m_colombia_s_a: {
        nombre: 'TRES M COLOMBIA S.A.',
        nombreProducto: 'MICROPORE PIEL 24X3 BOLSA PG2 LL3',
        precios: {
          paquete: { label: 'Paquete', precio: 14000 },
          unidad: { label: 'Unidad', precio: 4600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'TRES M COLOMBIA S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Micropore Piel 24X3 Bolsa PG2 LL3.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 14000 },
      { tipo: 'Unidad', precio: 4600 }
    ],
  },
  {
    id: 1180,
    nombre: 'Cureband Microporoso (1,5CMX9M / 1/2X10YRD) Color',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'CUREBAND MICROPOROSO (5CMX9M / 2X10YRD) COLOR PIEL',
        precios: {
          caja: { label: 'Caja', precio: 57000 },
          unidad: { label: 'Unidad', precio: 15300 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Cureband Microporoso (1,5CMX9M / 1/2X10YRD) Color.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 55000 },
      { tipo: 'Unidad', precio: 4400 }
    ],
  },
  {
    id: 1181,
    nombre: 'Cepillo Colgate Premier Medio X 1',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CEPILLO COLGATE PREMIER MEDIO X 1',
        precios: {
          unidad: { label: 'Unidad', precio: 2500 },
          caja: { label: 'Caja', precio: 19500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'COLGATE PALMOLIVE CIA.',
    descripcion: 'Producto de higiene y cuidado personal. Cepillo Colgate Premier Medio X 1.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1182,
    nombre: 'Pañal Tena Pants Clasico M X 16 Und',
    laboratorios: {
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PAÑAL TENA PANTS CLASICO M X 16 UND',
        precios: {
          caja: { label: 'Caja', precio: 51200 },
          paquete: { label: 'Paquete', precio: 4400 },
          unidad: { label: 'Unidad', precio: 4000 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'TENA PANTS CLASICO TALLA M  X8 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 26600 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'PRODUCTOS FAMILIA SANCELA',
    descripcion: 'Producto de higiene y cuidado personal. Pañal Tena Pants Clasico M X 16 Und.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 51200 }
    ],
  },
  {
    id: 1183,
    nombre: 'Dte Balance Crema Duos .pro/ex.nor. X 16 Sbs',
    laboratorios: {
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'DTE BALANCE CREMA DUOS .PRO/EX.NOR. X 16 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DTE BALANCE CLINICAL  MUJER  CREMA X 32G',
        precios: {
          frasco: { label: 'Frasco', precio: 4200 },
          caja: { label: 'Caja', precio: 12900 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'HENKEL COLOMBIANA S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Dte Balance Crema Duos .pro/ex.nor. X 16 Sbs.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1500 },
      { tipo: 'Caja', precio: 19000 }
    ],
  },
  {
    id: 1184,
    nombre: 'Maquina DE Afeitar Schick 4 Mujer',
    laboratorios: {
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'MAQUINA DE AFEITAR SCHICK 4 MUJER',
        precios: {
          ristra: { label: 'Ristra', precio: 39024 },
          unidad: { label: 'Unidad', precio: 4500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'HENKEL COLOMBIANA S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Maquina DE Afeitar Schick 4 Mujer.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Ristra', precio: 39024 },
      { tipo: 'Unidad', precio: 4500 }
    ],
  },
  {
    id: 1185,
    nombre: 'Canula Nasal Oxigeno Pediatrico 2,2 Mts Well',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CANULA NASAL OXIGENO PEDIATRICO  2,2 MTS WELL',
        precios: {
          unidad: { label: 'Unidad', precio: 5500 },
          caja: { label: 'Caja', precio: 14500 },
        },
      },
      life_care: {
        nombre: 'LIFE CARE',
        nombreProducto: 'CANULA NASAL  OXIGENO PEDIATRICO 2,1 MTS',
        precios: {
          unidad: { label: 'Unidad', precio: 5500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Producto de higiene y cuidado personal. Canula Nasal Oxigeno Pediatrico 2,2 Mts Well.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 5500 }
    ],
  },
  {
    id: 1186,
    nombre: 'Crema Colgate Triple Accion 50 ML + Cepillo',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA COLGATE TRIPLE ACCION 50 ML + CEPILLO',
        precios: {
          caja: { label: 'Caja', precio: 4700 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'COLGATE CEPILLO TRIPLE ACCION COLGATE PALMOLIVE CO',
        precios: {
          caja: { label: 'Caja', precio: 12700 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'Genérico',
    descripcion: 'Producto de higiene y cuidado personal. Crema Colgate Triple Accion 50 ML + Cepillo.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 4700 }
    ],
  },
  {
    id: 1187,
    nombre: 'Prestobarba Gillette Venus Simply X 1',
    laboratorios: {
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'PRESTOBARBA GILLETTE VENUS SIMPLY X 1',
        precios: {
          ristra: { label: 'Ristra', precio: 32143 },
          unidad: { label: 'Unidad', precio: 4400 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'PROCTER GAMBLE COLOMBIA',
    descripcion: 'Producto de higiene y cuidado personal. Prestobarba Gillette Venus Simply X 1.',
    imagen: imgCui(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Ristra', precio: 32143 },
      { tipo: 'Unidad', precio: 4400 }
    ],
  },
  {
    id: 1188,
    nombre: 'Dte.yodora Crema 12 GR',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'DTE.YODORA CREMA 12 GR',
        precios: {
          tubo: { label: 'Tubo', precio: 3700 },
          paquete: { label: 'Paquete', precio: 27800 },
          caja: { label: 'Caja', precio: 7500 },
          frasco: { label: 'Frasco', precio: 8800 },
          unidad: { label: 'Unidad', precio: 10000 },
          par: { label: 'Par', precio: 20500 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'DES LADY TALC PRACTI CREMA X 30 GRS',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA P.PEINAR SAVITAL BIOTINA 275 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto de higiene y cuidado personal. Dte.yodora Crema 12 GR.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Tubo', precio: 3700 }
    ],
  },
  {
    id: 1189,
    nombre: 'Cre.den.colgate TRI.ACC.22GR 12 Uds',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'CRE.DEN.COLGATE TRI.ACC.22GR 12 UDS',
        precios: {
          unidad: { label: 'Unidad', precio: 2500 },
          caja: { label: 'Caja', precio: 22800 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'COLGATE PALMOLIVE CIA.',
    descripcion: 'Producto de higiene y cuidado personal. Cre.den.colgate TRI.ACC.22GR 12 Uds.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1190,
    nombre: 'Guante Nitrilo Negro Alfasaf X 12 Unds Tallas Surt',
    laboratorios: {
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'GUANTE NITRILO NEGRO ALFASAF X 12 UNDS TALLAS SURT',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      alfasafe: {
        nombre: 'Alfasafe',
        nombreProducto: 'GUANTE  DE NITRILO NEGRO TALLAS SURT  X 24 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 10000 },
          par: { label: 'Par', precio: 1500 },
        },
      },
    },
    categoria: 'Cuidado Personal',
    marca: 'ALFA TRADING LTDA',
    descripcion: 'Producto de higiene y cuidado personal. Guante Nitrilo Negro Alfasaf X 12 Unds Tallas Surt.',
    imagen: imgCui(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1191,
    nombre: 'Mascarilla Matizante Naissant Surt X 12 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MASCARILLA MATIZANTE NAISSANT SURT     X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 69000 },
          unidad: { label: 'Unidad', precio: 5800 },
          frasco: { label: 'Frasco', precio: 29000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Genérico',
    descripcion: 'Producto de belleza y estética. Mascarilla Matizante Naissant Surt X 12 Unds.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 69000 },
      { tipo: 'Unidad', precio: 5800 }
    ],
  },
  {
    id: 1192,
    nombre: 'Shampoo Pantene Surtido Sachet X 12 Sbs',
    laboratorios: {
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'SHAMPOO PANTENE SURTIDO SACHET X 12 SBS',
        precios: {
          ristra: { label: 'Ristra', precio: 7000 },
          unidad: { label: 'Unidad', precio: 1000 },
          blister: { label: 'Blíster', precio: 700 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'PANTENE SHAMPOO SURTIDOS 200 MILILITROS',
        precios: {
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'SHAMPOO PANTENE SURTIDOS  510ML',
        precios: {
          caja: { label: 'Caja', precio: 31000 },
          frasco: { label: 'Frasco', precio: 6500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'PROCTER GAMBLE COLOMBIA',
    descripcion: 'Producto de belleza y estética. Shampoo Pantene Surtido Sachet X 12 Sbs.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Ristra', precio: 7000 },
      { tipo: 'Unidad', precio: 1000 }
    ],
  },
  {
    id: 1193,
    nombre: 'Shampoo Naissant Surtidos Caja X 12 Sobres',
    laboratorios: {
      naissant: {
        nombre: 'Naissant',
        nombreProducto: 'SHAMPOO NAISSANT SURTIDOS CAJA X 12 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 55000 },
          unidad: { label: 'Unidad', precio: 5800 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Naissant',
    descripcion: 'Producto de belleza y estética. Shampoo Naissant Surtidos Caja X 12 Sobres.',
    imagen: imgBel(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 55000 },
      { tipo: 'Unidad', precio: 5800 }
    ],
  },
  {
    id: 1194,
    nombre: 'Nutribela 15 Surtidos Trat Capilar 27ML X 12SBS',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NUTRIBELA 15  SURTIDOS TRAT CAPILAR  27ML X 12SBS',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Genérico',
    descripcion: 'Producto de belleza y estética. Nutribela 15 Surtidos Trat Capilar 27ML X 12SBS.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1500 }
    ],
  },
  {
    id: 1195,
    nombre: 'Acondicionador Savital Surt X 20 Sobre 25 ML',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'ACONDICIONADOR SAVITAL SURT X 20 SOBRE 25 ML',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 14000 },
          bolsa: { label: 'Bolsa', precio: 3400 },
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'OFERTA SAVITAL SHAMPO + ACONDICIONADOR  SURT',
        precios: {
          par: { label: 'Par', precio: 29500 },
          unidad: { label: 'Unidad', precio: 17500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'UNILEVER ANDINA COLOMBIA',
    descripcion: 'Producto de belleza y estética. Acondicionador Savital Surt X 20 Sobre 25 ML.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1000 },
      { tipo: 'Caja', precio: 14000 }
    ],
  },
  {
    id: 1196,
    nombre: 'Crema Para Peinar Konzil Surt Caja X 18 Sbs',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA PARA PEINAR KONZIL SURT CAJA X 18 SBS',
        precios: {
          caja: { label: 'Caja', precio: 18000 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      schwarzkopf: {
        nombre: 'SCHWARZKOPF',
        nombreProducto: 'OFTA KONZIL CREMA PARA PEINAR SURT X 230 ML',
        precios: {
          par: { label: 'Par', precio: 25000 },
          unidad: { label: 'Unidad', precio: 16000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Genérico',
    descripcion: 'Producto de belleza y estética. Crema Para Peinar Konzil Surt Caja X 18 Sbs.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 18000 },
      { tipo: 'Unidad', precio: 1200 }
    ],
  },
  {
    id: 1197,
    nombre: 'Savital Crema Peinar Surtidos CJ X 20SBS',
    laboratorios: {
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SAVITAL CREMA PEINAR SURTIDOS CJ X 20SBS',
        precios: {
          caja: { label: 'Caja', precio: 17000 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'SACHET  SAVITAL CREMA PEINAR SURTIDOS  X 95 ML',
        precios: {
          bolsa: { label: 'Bolsa', precio: 3400 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'UNILEVER COLOMBIA SCC S.A.S.',
    descripcion: 'Producto de belleza y estética. Savital Crema Peinar Surtidos CJ X 20SBS.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 17000 },
      { tipo: 'Unidad', precio: 1000 }
    ],
  },
  {
    id: 1198,
    nombre: 'Nutribela 15 Acondicionador Surt 15ML X 12 Sbs',
    laboratorios: {
      quala_s_a: {
        nombre: 'QUALA S.A.',
        nombreProducto: 'NUTRIBELA 15 ACONDICIONADOR  SURT 15ML X 12 SBS',
        precios: {
          caja: { label: 'Caja', precio: 11000 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ACONDICIONADOR NUTRIBELA15      SURTIDO X 370 ML',
        precios: {
          caja: { label: 'Caja', precio: 19800 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'QUALA S.A.',
    descripcion: 'Producto de belleza y estética. Nutribela 15 Acondicionador Surt 15ML X 12 Sbs.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 11000 },
      { tipo: 'Unidad', precio: 1200 }
    ],
  },
  {
    id: 1199,
    nombre: 'Blondor Wella Manzanilla Caja X 20 Sobres X 20 Gra',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BLONDOR WELLA MANZANILLA CAJA X 20 SOBRES X 20 GRA',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
          unidad: { label: 'Unidad', precio: 4500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Genérico',
    descripcion: 'Producto de belleza y estética. Blondor Wella Manzanilla Caja X 20 Sobres X 20 Gra.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 70000 },
      { tipo: 'Unidad', precio: 4500 }
    ],
  },
  {
    id: 1200,
    nombre: 'Crema Nivea 30 GR R.367',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CREMA NIVEA 30 GR R.367',
        precios: {
          caja: { label: 'Caja', precio: 10500 },
          tarro: { label: 'Tarro', precio: 32000 },
          frasco: { label: 'Frasco', precio: 31000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'BEIERSDORF S.A.',
    descripcion: 'Producto de belleza y estética. Crema Nivea 30 GR R.367.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 10500 }
    ],
  },
  {
    id: 1201,
    nombre: 'Esmaltes Comercial - Eschardos Surtidos Shilher',
    laboratorios: {
      laboratorio_de_cosme: {
        nombre: 'LABORATORIO DE COSMÉTICOS SHILHER S.A.S.',
        nombreProducto: 'ESMALTES COMERCIAL - ESCHARDOS SURTIDOS  SHILHER',
        precios: {
          frasco: { label: 'Frasco', precio: 4400 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'LABORATORIO DE COSMÉTICOS SHILHER S',
    descripcion: 'Producto de belleza y estética. Esmaltes Comercial - Eschardos Surtidos Shilher.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Frasco', precio: 4400 }
    ],
  },
  {
    id: 1202,
    nombre: 'Bloq.sundark Adultos 12 Sbs 10 GR',
    laboratorios: {
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'BLOQ.SUNDARK ADULTOS SPF 60 120 ML',
        precios: {
          caja: { label: 'Caja', precio: 54000 },
          blister: { label: 'Blíster', precio: 3200 },
          frasco: { label: 'Frasco', precio: 39900 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'LAB. PRONABELL LTDA',
    descripcion: 'Producto de belleza y estética. Bloq.sundark Adultos 12 Sbs 10 GR.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 3200 },
      { tipo: 'Caja', precio: 31200 }
    ],
  },
  {
    id: 1203,
    nombre: 'Crema Pond Sachet Humectante Azul',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA POND SACHET   HUMECTANTE    AZUL',
        precios: {
          blister: { label: 'Blíster', precio: 1800 },
          caja: { label: 'Caja', precio: 16000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Genérico',
    descripcion: 'Producto de belleza y estética. Crema Pond Sachet Humectante Azul.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1800 },
      { tipo: 'Caja', precio: 16000 }
    ],
  },
  {
    id: 1204,
    nombre: 'Pantene Acondicionador Surtido X 12 Sbs',
    laboratorios: {
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'PANTENE ACONDICIONADOR SURTIDO X 12 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          ristra: { label: 'Ristra', precio: 9000 },
          frasco: { label: 'Frasco', precio: 11900 },
          caja: { label: 'Caja', precio: 13500 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'PANTENE CREMA PARA PEINAR SURTIDO SACHET X 18 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 700 },
          ristra: { label: 'Ristra', precio: 8400 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'SACHET SAVITAL  ACONDICIONADOR  SURTIDOS  X 100ML',
        precios: {
          bolsa: { label: 'Bolsa', precio: 3400 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PANTENE PRO V  SURTIDOS  X 300 ML',
        precios: {
          caja: { label: 'Caja', precio: 22900 },
          unidad: { label: 'Unidad', precio: 21900 },
          frasco: { label: 'Frasco', precio: 6500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'PYG COLOMBIA LTDA.',
    descripcion: 'Producto de belleza y estética. Pantene Acondicionador Surtido X 12 Sbs.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1000 },
      { tipo: 'Ristra', precio: 9000 }
    ],
  },
  {
    id: 1205,
    nombre: 'Cicatricure Gel Cicatrices Sobre 8G X12UNDS',
    laboratorios: {
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'CICATRICURE GEL CICATRICES SOBRE 8G X12UNDS',
        precios: {
          blister: { label: 'Blíster', precio: 4600 },
          caja: { label: 'Caja', precio: 54000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'GENOMMA LAB.COLOMBIA',
    descripcion: 'Producto de belleza y estética. Cicatricure Gel Cicatrices Sobre 8G X12UNDS.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 4600 },
      { tipo: 'Caja', precio: 54000 }
    ],
  },
  {
    id: 1206,
    nombre: 'Cre.p.peinar Sedal Rizos DEF.18ML 36 Sbs',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CRE.P.PEINAR SEDAL RIZOS DEF.18ML  36 SBS',
        precios: {
          caja: { label: 'Caja', precio: 35000 },
          ristra: { label: 'Ristra', precio: 12000 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'UNILEVER ANDINA COLOMBIA',
    descripcion: 'Producto de belleza y estética. Cre.p.peinar Sedal Rizos DEF.18ML 36 Sbs.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 35000 },
      { tipo: 'Ristra', precio: 12000 },
      { tipo: 'Unidad', precio: 1200 }
    ],
  },
  {
    id: 1207,
    nombre: 'Crema Ponds Rejuveness X 10 Sachets',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CREMA PONDS REJUVENESS  X 10 SACHETS',
        precios: {
          caja: { label: 'Caja', precio: 16500 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA PONDS REJUVENESS 50 GR',
        precios: {
          frasco: { label: 'Frasco', precio: 17300 },
          caja: { label: 'Caja', precio: 28000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Genérico',
    descripcion: 'Producto de belleza y estética. Crema Ponds Rejuveness X 10 Sachets.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 16500 },
      { tipo: 'Unidad', precio: 1800 }
    ],
  },
  {
    id: 1208,
    nombre: 'Uñas Postizas Adoro X 20',
    laboratorios: {
      disanfer_y_chenier: {
        nombre: 'Disanfer y Chenier',
        nombreProducto: 'UÑAS POSTIZAS ADORO X 20',
        precios: {
          paquete: { label: 'Paquete', precio: 1500 },
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'XUCAI ELEGANT TOUCH UÑAS POSTIZAS CON ADESIVO DECO',
        precios: {
          paquete: { label: 'Paquete', precio: 2000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Disanfer y Chenier',
    descripcion: 'Producto de belleza y estética. Uñas Postizas Adoro X 20.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 1500 }
    ],
  },
  {
    id: 1209,
    nombre: 'Bloqueador Tanga Spf 100 X 12 Sbs',
    laboratorios: {
      recamier_s_a: {
        nombre: 'RECAMIER S.A.',
        nombreProducto: 'BLOQUEADOR EN CREMA TANGA SUN ACTIVE RECAMIER',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
          unidad: { label: 'Unidad', precio: 3300 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TANGA BLOQUEADOR SOLA SPF 70 X 220ML',
        precios: {
          caja: { label: 'Caja', precio: 54000 },
        },
      },
      copidrogas: {
        nombre: 'COPIDROGAS',
        nombreProducto: 'BALAO BLOQUEADOR SOLAR CREMA 12G',
        precios: {
          caja: { label: 'Caja', precio: 27000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'RECAMIER S.A.',
    descripcion: 'Producto de belleza y estética. Bloqueador Tanga Spf 100 X 12 Sbs.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 38000 },
      { tipo: 'Unidad', precio: 3300 }
    ],
  },
  {
    id: 1210,
    nombre: 'Gel Ego For Men Surt Pote 110 ML',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'GEL EGO FOR MEN SURT POTE 110 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'SHAMPOO NUTRIBELA POTE 400ML   SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 18900 },
        },
      },
      masglo: {
        nombre: 'MASGLO',
        nombreProducto: 'ESMALTE MASGLO SURT',
        precios: {
          unidad: { label: 'Unidad', precio: 6500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'HIDRAPLUS  75 ZINC     SURTIDO  400 ML SUERO',
        precios: {
          botella: { label: 'Botella', precio: 10600 },
        },
      },
      labinco_s_a: {
        nombre: 'LABINCO S.A.',
        nombreProducto: 'SOLHIDREX SABORES SURT   X  30 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 42000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'OFT DTE REXONA BARRA MUJER SURTIDO 50 G X2UND',
        precios: {
          frasco: { label: 'Frasco', precio: 17200 },
          par: { label: 'Par', precio: 32900 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'DTE GILLETTE SPECIALIZED GEL SURT  45 GR.',
        precios: {
          frasco: { label: 'Frasco', precio: 9200 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS SHAMPOO SURTIDOS X  200 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 13500 },
          frasco: { label: 'Frasco', precio: 11500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'UNILEVER ANDINA COLOMBIA',
    descripcion: 'Producto de belleza y estética. Gel Ego For Men Surt Pote 110 ML.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Frasco', precio: 3500 }
    ],
  },
  {
    id: 1211,
    nombre: 'Manteca DE Cacao 5 GR 12 Uds Disanfer',
    laboratorios: {
      dist_disanfer_ltda: {
        nombre: 'DIST. DISANFER LTDA',
        nombreProducto: 'MANTECA DE CACAO 5 GR 12 UDS DISANFER',
        precios: {
          caja: { label: 'Caja', precio: 30000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MANTECA DE CACAO X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 6000 },
          unidad: { label: 'Unidad', precio: 500 },
          paquete: { label: 'Paquete', precio: 25000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'DIST. DISANFER LTDA',
    descripcion: 'Producto de belleza y estética. Manteca DE Cacao 5 GR 12 Uds Disanfer.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 30000 },
      { tipo: 'Unidad', precio: 3000 }
    ],
  },
  {
    id: 1212,
    nombre: 'Pantene Mascari. Tratamiento Restaur. Surt X 8 Sbs',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'PANTENE MASCARI. TRATAMIENTO RESTAUR. SURT X 8 SBS',
        precios: {
          ristra: { label: 'Ristra', precio: 1600 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'UNILEVER ANDINA COLOMBIA',
    descripcion: 'Producto de belleza y estética. Pantene Mascari. Tratamiento Restaur. Surt X 8 Sbs.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Ristra', precio: 1600 },
      { tipo: 'Unidad', precio: 1600 }
    ],
  },
  {
    id: 1213,
    nombre: 'Keratina Tratamiento Natural Sobres',
    laboratorios: {
      disanfer_y_chenier: {
        nombre: 'Disanfer y Chenier',
        nombreProducto: 'KERATINA TRATAMIENTO NATURAL SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 28000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Disanfer y Chenier',
    descripcion: 'Producto de belleza y estética. Keratina Tratamiento Natural Sobres.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1500 },
      { tipo: 'Caja', precio: 28000 }
    ],
  },
  {
    id: 1214,
    nombre: 'Mascarilla Matizante Naissant Surtido 300ML',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MASCARILLA MATIZANTE NAISSANT SURTIDO 300ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29000 },
        },
      },
      naisant: {
        nombre: 'Naisant',
        nombreProducto: 'SHAMPO NAISSANT MATIZANTE SURTIDO 300ML',
        precios: {
          unidad: { label: 'Unidad', precio: 27000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Genérico',
    descripcion: 'Producto de belleza y estética. Mascarilla Matizante Naissant Surtido 300ML.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Frasco', precio: 29000 }
    ],
  },
  {
    id: 1215,
    nombre: 'Shampo Savital Sachet Grande 100ML Surtido',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'SHAMPO SAVITAL SACHET  GRANDE  100ML   SURTIDO',
        precios: {
          bolsa: { label: 'Bolsa', precio: 3700 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'UNILEVER ANDINA COLOMBIA',
    descripcion: 'Producto de belleza y estética. Shampo Savital Sachet Grande 100ML Surtido.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Bolsa', precio: 3700 }
    ],
  },
  {
    id: 1216,
    nombre: 'Lubriderm Sobre X25 ML',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LUBRIDERM  SOBRE X25 ML',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          frasco: { label: 'Frasco', precio: 17000 },
        },
      },
      labinco_s_a: {
        nombre: 'LABINCO S.A.',
        nombreProducto: 'SOLHIDREX SABORES SURT   X  30 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 42000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PEG POLIETILENGLICOL 3350 12 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 82821 },
          unidad: { label: 'Unidad', precio: 6900 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'ACONDICIONADOR SAVITAL SURT X 20 SOBRE 25 ML',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 14000 },
        },
      },
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'ARAWAK DESPIGMENTADOR X 12 SOBRES',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 24000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'JOHNSON JOHNSON DE COLO',
    descripcion: 'Producto de belleza y estética. Lubriderm Sobre X25 ML.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 3700 }
    ],
  },
  {
    id: 1217,
    nombre: 'Polvo Compacto Ana Maria Verde Tonos Surtidos',
    laboratorios: {
      productos_de_belleza: {
        nombre: 'PRODUCTOS DE BELLEZA ANA MARIA S.A',
        nombreProducto: 'POLVO COMPACTO ANA MARIA VERDE TONOS SURTIDOS',
        precios: {
          caja: { label: 'Caja', precio: 24900 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'PRODUCTOS DE BELLEZA ANA MARIA S.A',
    descripcion: 'Producto de belleza y estética. Polvo Compacto Ana Maria Verde Tonos Surtidos.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 24900 }
    ],
  },
  {
    id: 1218,
    nombre: 'Crema Nivea 60 GR PG3LLV4',
    laboratorios: {
      beiersdorf_s_a: {
        nombre: 'BEIERSDORF S.A.',
        nombreProducto: 'CREMA NIVEA 60 GR  PG3LLV4',
        precios: {
          caja: { label: 'Caja', precio: 72800 },
          unidad: { label: 'Unidad', precio: 19500 },
          tarro: { label: 'Tarro', precio: 32000 },
          frasco: { label: 'Frasco', precio: 31000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'BEIERSDORF S.A.',
    descripcion: 'Producto de belleza y estética. Crema Nivea 60 GR PG3LLV4.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 72800 },
      { tipo: 'Unidad', precio: 19500 }
    ],
  },
  {
    id: 1219,
    nombre: 'Elixir DE Coco 10 ML',
    laboratorios: {
      naisant: {
        nombre: 'Naisant',
        nombreProducto: 'ELIXIR DE COCO 10 ML',
        precios: {
          caja: { label: 'Caja', precio: 53000 },
          unidad: { label: 'Unidad', precio: 4600 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'JABON DOVE LECHE DE COCO X 90 GR',
        precios: {
          caja: { label: 'Caja', precio: 3900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'HELADO CHOCOCONO X 24 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 43200 },
          unidad: { label: 'Unidad', precio: 3500 },
          frasco: { label: 'Frasco', precio: 8900 },
        },
      },
      anglopharma: {
        nombre: 'ANGLOPHARMA',
        nombreProducto: 'TEOLIXIR TEOFILINA ELIXIR 80MG/15ML  X 240ML',
        precios: {
          caja: { label: 'Caja', precio: 23000 },
        },
      },
      johnverys_sas: {
        nombre: 'JOHNVERYS SAS',
        nombreProducto: 'ACEITE NATURAL DE COCO Y MONOI DE TAHITI X 220ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13500 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'Naisant',
    descripcion: 'Producto de belleza y estética. Elixir DE Coco 10 ML.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 53000 },
      { tipo: 'Unidad', precio: 4600 }
    ],
  },
  {
    id: 1220,
    nombre: 'Bloq.sundark Kids 12 Sbs 10 GR',
    laboratorios: {
      lab_pronabell_ltda: {
        nombre: 'LAB. PRONABELL LTDA',
        nombreProducto: 'BLOQ.SUNDARK KIDS 12 SBS 10 GR',
        precios: {
          blister: { label: 'Blíster', precio: 3600 },
          caja: { label: 'Caja', precio: 36000 },
          frasco: { label: 'Frasco', precio: 39900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PROTECTOR SOLAR  SUNDARK KIDS 60 UV     120',
        precios: {
          caja: { label: 'Caja', precio: 38000 },
        },
      },
    },
    categoria: 'Belleza',
    marca: 'LAB. PRONABELL LTDA',
    descripcion: 'Producto de belleza y estética. Bloq.sundark Kids 12 Sbs 10 GR.',
    imagen: imgBel(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 3600 },
      { tipo: 'Caja', precio: 36000 }
    ],
  },
  {
    id: 1221,
    nombre: 'Microgynon 21 Tabletas',
    laboratorios: {
      tecnofarma_s_a: {
        nombre: 'TECNOFARMA S.A',
        nombreProducto: 'MICROGYNON 21 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 7800 },
        },
      },
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ASPIRINA EFERVESCENTE 500 MG 50 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 2500 },
          caja: { label: 'Caja', precio: 50269 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      genomma_lab_colombia: {
        nombre: 'GENOMMA LAB.COLOMBIA',
        nombreProducto: 'X RAY DOL 48 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 3700 },
          caja: { label: 'Caja', precio: 66849 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ASA 100 MG 100 TABLETAS MK',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      glaxo_smithkline_con: {
        nombre: 'GLAXO SMITHKLINE CONSUMER',
        nombreProducto: 'DOLEX 500 MG 100 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 60000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 650 },
          unidad: { label: 'Unidad', precio: 1600 },
        },
      },
      lafrancol_s_a: {
        nombre: 'LAFRANCOL S.A.',
        nombreProducto: 'SEVEDOL EXTRA FUERTE 60 TABLETAS',
        precios: {
          caja: { label: 'Caja', precio: 108000 },
          unidad: { label: 'Unidad', precio: 1800 },
          blister: { label: 'Blíster', precio: 14000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOFARMA S.A',
    descripcion: 'Producto especializado para bebés y mamás. Microgynon 21 Tabletas.',
    imagen: imgBeb(),
    tags: [],
    requiereReceta: true,
    variantes: [
      { tipo: 'Caja', precio: 7800 }
    ],
  },
  {
    id: 1222,
    nombre: 'Toalli Winny Aloe Vita E X 24 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TOALLI WINNY ALOE VITA E X 24 UND',
        precios: {
          paquete: { label: 'Paquete', precio: 4000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Toalli Winny Aloe Vita E X 24 Und.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 4000 }
    ],
  },
  {
    id: 1223,
    nombre: 'Cha.baby Soft Cuidado Delicado 20 Sbs',
    laboratorios: {
      alicorp_colombia: {
        nombre: 'ALICORP COLOMBIA',
        nombreProducto: 'CHA.BABY SOFT CUIDADO DELICADO 20 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1000 },
          caja: { label: 'Caja', precio: 14000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'ALICORP COLOMBIA',
    descripcion: 'Producto especializado para bebés y mamás. Cha.baby Soft Cuidado Delicado 20 Sbs.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1000 },
      { tipo: 'Caja', precio: 14000 }
    ],
  },
  {
    id: 1224,
    nombre: 'Toall Winny Aloe Y Vit E X 100 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TOALL WINNY ALOE Y VIT E X 100 UND',
        precios: {
          paquete: { label: 'Paquete', precio: 13000 },
          caja: { label: 'Caja', precio: 28600 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'TOALLITA HUMEDA. PEQUEÑIN ANTIBACTERIAL  ALOE 40 U',
        precios: {
          caja: { label: 'Caja', precio: 5400 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TOALLITAS ARRURRU ALOE X 70 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 8800 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Toall Winny Aloe Y Vit E X 100 Und.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 13000 }
    ],
  },
  {
    id: 1225,
    nombre: 'Johnsons Shampoo Surtidos X 100 ML',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS SHAMPOO SURTIDOS X  200 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 13500 },
          frasco: { label: 'Frasco', precio: 11500 },
          caja: { label: 'Caja', precio: 33900 },
          tarro: { label: 'Tarro', precio: 37000 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'DOVE SHAMPOO SURTIDOS  X 12 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1200 },
          ristra: { label: 'Ristra', precio: 8400 },
        },
      },
      pyg_colombia_ltda: {
        nombre: 'PYG COLOMBIA LTDA.',
        nombreProducto: 'HYS SHAMPOO HEAD & SHOULDERS SURTIDOS  375ML',
        precios: {
          frasco: { label: 'Frasco', precio: 19800 },
          caja: { label: 'Caja', precio: 13500 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'JOHNSON JOHNSON DE COLO',
    descripcion: 'Producto especializado para bebés y mamás. Johnsons Shampoo Surtidos X 100 ML.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Frasco', precio: 11500 }
    ],
  },
  {
    id: 1226,
    nombre: 'Mascarilla Revitalizante Coco',
    laboratorios: {
      naisant: {
        nombre: 'Naisant',
        nombreProducto: 'MASCARILLA REVITALIZANTE  COCO',
        precios: {
          caja: { label: 'Caja', precio: 44000 },
          sachet: { label: 'Sachet', precio: 4300 },
          tarro: { label: 'Tarro', precio: 18200 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Naisant',
    descripcion: 'Producto especializado para bebés y mamás. Mascarilla Revitalizante Coco.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 44000 },
      { tipo: 'Sachet', precio: 4300 }
    ],
  },
  {
    id: 1227,
    nombre: 'Toalli Winny Aloe Vit E X 70 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'TOALLI WINNY ALOE VITA E X 24 UND',
        precios: {
          paquete: { label: 'Paquete', precio: 4000 },
          caja: { label: 'Caja', precio: 28600 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'TOALLITA HUMEDA. PEQUEÑIN ANTIBACTERIAL  ALOE 40 U',
        precios: {
          caja: { label: 'Caja', precio: 5400 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TOALLITAS ARRURRU ALOE X 70 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 8800 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Toalli Winny Aloe Vit E X 70 Und.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 9600 }
    ],
  },
  {
    id: 1228,
    nombre: 'Pañal Winny Ultratrim Sec Etapa 4 X 50',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY    ULTRATRIM SEC  ETAPA 4 X 50',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY  ULT SEC ETAPA 5   X50',
        precios: {
          caja: { label: 'Caja', precio: 77000 },
          paquete: { label: 'Paquete', precio: 35800 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Ultratrim Sec Etapa 4 X 50.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 70000 }
    ],
  },
  {
    id: 1229,
    nombre: 'Corta Uñas Cola DE Castor Genial X 24 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CORTA UÑAS COLA DE CASTOR GENIAL X 24 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Corta Uñas Cola DE Castor Genial X 24 Unds.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1800 }
    ],
  },
  {
    id: 1230,
    nombre: 'Johnson´s Baby Crema Hidrat 25ML X 12 Sbs',
    laboratorios: {
      s_c_johnson_colombia: {
        nombre: 'S.C. JOHNSON COLOMBIANA',
        nombreProducto: 'JOHNSON´S BABY CREMA HIDRAT 25ML  X 12  SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1700 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS CREMA HIDRATANTE BABY SURT 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 17500 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'S.C. JOHNSON COLOMBIANA',
    descripcion: 'Producto especializado para bebés y mamás. Johnson´s Baby Crema Hidrat 25ML X 12 Sbs.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1700 }
    ],
  },
  {
    id: 1231,
    nombre: 'Pañal Winny Pants Etapa 4 X 50 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY PANTS ETAPA 4 X 50 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
          paquete: { label: 'Paquete', precio: 35800 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY SEC ETAPA 3 X 16 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 19000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Pants Etapa 4 X 50 Unds.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 70000 }
    ],
  },
  {
    id: 1232,
    nombre: 'Pañal Winny Sensitive ET 0 X 30 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY SENSITIVE ET 0 X 30 UND',
        precios: {
          paquete: { label: 'Paquete', precio: 21500 },
          caja: { label: 'Caja', precio: 46200 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY SENSITIVE ETAPA 0  X 50 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 35800 },
          caja: { label: 'Caja', precio: 77000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Sensitive ET 0 X 30 Und.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Paquete', precio: 21500 }
    ],
  },
  {
    id: 1233,
    nombre: 'Crema # 4 20 GR',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'DES LADY TALC PRACTI CREMA X 30 GRS',
        precios: {
          frasco: { label: 'Frasco', precio: 3500 },
        },
      },
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'CREMA P.PEINAR SAVITAL BIOTINA 275 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSON BABY CREMA  PARA PEINAR 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16500 },
        },
      },
      henkel_colombiana_s_: {
        nombre: 'HENKEL COLOMBIANA S.A.',
        nombreProducto: 'DTE BALANCE CREMA DUOS .PRO/EX.NOR. X 16 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1500 },
          caja: { label: 'Caja', precio: 19000 },
        },
      },
      gerco: {
        nombre: 'GERCO',
        nombreProducto: 'CREMA FORZ 24 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 3000 },
          caja: { label: 'Caja', precio: 48000 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'PANTENE CREMA PARA PEINAR SURTIDO SACHET X 18 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 700 },
          ristra: { label: 'Ristra', precio: 8400 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Crema # 4 20 GR.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 10600 }
    ],
  },
  {
    id: 1234,
    nombre: 'Johnsons Aceite Baby Surt 50 ML',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS ACEITE BABY SURT  100 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 13800 },
          caja: { label: 'Caja', precio: 33000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'JOHNSON JOHNSON DE COLO',
    descripcion: 'Producto especializado para bebés y mamás. Johnsons Aceite Baby Surt 50 ML.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Frasco', precio: 7200 }
    ],
  },
  {
    id: 1235,
    nombre: 'Pañal Winny Pants ET 5 X 30 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY PANTS ET 5 X 30 UND',
        precios: {
          caja: { label: 'Caja', precio: 46500 },
          paquete: { label: 'Paquete', precio: 21500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY PANTS ETAPA 4 X 50 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PAÑAL TENA PANTS CLASICO M X 16 UND',
        precios: {
          caja: { label: 'Caja', precio: 51200 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Pants ET 5 X 30 Und.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 46500 }
    ],
  },
  {
    id: 1236,
    nombre: 'Pañal Winny Ultra Sec Etp 1 X 50UND',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY ULTRA SEC ETP 1  X 50UND',
        precios: {
          caja: { label: 'Caja', precio: 40500 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY    ULTRATRIM SEC  ETAPA 4 X 50',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Ultra Sec Etp 1 X 50UND.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 40500 }
    ],
  },
  {
    id: 1237,
    nombre: 'Pañal Winny Sensitive Etapa 0 X 50 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY SENSITIVE ETAPA 0  X 50 UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 35800 },
          caja: { label: 'Caja', precio: 70000 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY SEC ETAPA 3 X 16 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 19000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Sensitive Etapa 0 X 50 Unds.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Paquete', precio: 35800 }
    ],
  },
  {
    id: 1238,
    nombre: 'Pañal Winny Ult Sec ET 1 X 30 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY ULT SEC ET 5 X 30 UND',
        precios: {
          caja: { label: 'Caja', precio: 46200 },
          paquete: { label: 'Paquete', precio: 21500 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY  ULT SEC ETAPA 5   X50',
        precios: {
          caja: { label: 'Caja', precio: 77000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Ult Sec ET 1 X 30 Und.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 23900 }
    ],
  },
  {
    id: 1239,
    nombre: 'Pañal Winny Pants Etapa 5 X 50 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY PANTS  ETAPA   5 X 50 UND',
        precios: {
          caja: { label: 'Caja', precio: 77000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY PANTS ETAPA 4 X 50 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
          paquete: { label: 'Paquete', precio: 35800 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Pants Etapa 5 X 50 Und.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 77000 }
    ],
  },
  {
    id: 1240,
    nombre: 'Acid Mantle Baby Antipañalitis Crema X 100 GR',
    laboratorios: {
      bayer_s_a: {
        nombre: 'BAYER S.A.',
        nombreProducto: 'ACID MANTLE BABY ANTIPAÑALITIS CREMA X 100 GR',
        precios: {
          caja: { label: 'Caja', precio: 35600 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'BAYER S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Acid Mantle Baby Antipañalitis Crema X 100 GR.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 35600 }
    ],
  },
  {
    id: 1241,
    nombre: 'Pañal Winny Ult Sec 3X30 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY ULT SEC 3X30 UND',
        precios: {
          caja: { label: 'Caja', precio: 34900 },
          paquete: { label: 'Paquete', precio: 21500 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY  ULT SEC ETAPA 5   X50',
        precios: {
          caja: { label: 'Caja', precio: 77000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Ult Sec 3X30 Und.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 34900 }
    ],
  },
  {
    id: 1242,
    nombre: 'Biberon 4 Onzas Only Baby Cuchara Silic',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BIBERON 4 ONZAS  ONLY BABY CUCHARA SILIC',
        precios: {
          unidad: { label: 'Unidad', precio: 15600 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Biberon 4 Onzas Only Baby Cuchara Silic.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 15600 }
    ],
  },
  {
    id: 1243,
    nombre: 'Biberon 3 Onzas Cchara Silicona Only Baby',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BIBERON 3 ONZAS CCHARA SILICONA  ONLY BABY',
        precios: {
          unidad: { label: 'Unidad', precio: 12500 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Biberon 3 Onzas Cchara Silicona Only Baby.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 12500 }
    ],
  },
  {
    id: 1244,
    nombre: 'Crema Dental Fluocardent Kids Sin Fluor Raton T',
    laboratorios: {
      jgb_s_a: {
        nombre: 'JGB S.A.',
        nombreProducto: 'CREMA  DENTAL  FLUOCARDENT  KIDS SIN FLUOR RATON T',
        precios: {
          caja: { label: 'Caja', precio: 11800 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'JGB S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Crema Dental Fluocardent Kids Sin Fluor Raton T.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 11800 }
    ],
  },
  {
    id: 1245,
    nombre: 'Vitamina C Pediatrica 30 ML Cereza',
    laboratorios: {
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'VITAMINA C PEDIATRICA 30 ML CEREZA',
        precios: {
          caja: { label: 'Caja', precio: 8000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'LABORATORIOS COASPHARMA S.A.S',
    descripcion: 'Producto especializado para bebés y mamás. Vitamina C Pediatrica 30 ML Cereza.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 8000 }
    ],
  },
  {
    id: 1246,
    nombre: 'Biberon 2 Onzas Minitree',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BIBERON 2 ONZAS MINITREE',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
          unidad: { label: 'Unidad', precio: 12000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Biberon 2 Onzas Minitree.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 7500 }
    ],
  },
  {
    id: 1247,
    nombre: 'Cepillo Dedo Skippy One Estuche (azul/rosa)',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CEPILLO DEDO SKIPPY ONE ESTUCHE (AZUL/ROSA)',
        precios: {
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Cepillo Dedo Skippy One Estuche (azul/rosa).',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 3000 }
    ],
  },
  {
    id: 1248,
    nombre: 'Klim 1+ Bolsa 1000 GR',
    laboratorios: {
      nestle_de_colombia_s: {
        nombre: 'NESTLE DE COLOMBIA S.A.',
        nombreProducto: 'KLIM 1+ BOLSA 1000 GR',
        precios: {
          bolsa: { label: 'Bolsa', precio: 51000 },
        },
      },
      jgb_s_a: {
        nombre: 'JGB S.A.',
        nombreProducto: 'OFERTA TARRITO ROJO BOLSA PAGUE: 1000 G LLEVE: 200',
        precios: {
          caja: { label: 'Caja', precio: 63900 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'NESTLE DE COLOMBIA S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Klim 1+ Bolsa 1000 GR.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Bolsa', precio: 51000 }
    ],
  },
  {
    id: 1249,
    nombre: 'Pañal Winny Pants ET 4 X 30 Und',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'PAÑAL WINNY PANTS ET 5 X 30 UND',
        precios: {
          caja: { label: 'Caja', precio: 46500 },
          paquete: { label: 'Paquete', precio: 21500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAÑAL WINNY PANTS ETAPA 4 X 50 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 70000 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PAÑAL TENA PANTS CLASICO M X 16 UND',
        precios: {
          caja: { label: 'Caja', precio: 51200 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto especializado para bebés y mamás. Pañal Winny Pants ET 4 X 30 Und.',
    imagen: imgBeb(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 42000 }
    ],
  },
  {
    id: 1250,
    nombre: 'Extractor DE Elche Palanca Obly Baby',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'EXTRACTOR DE ELCHE PALANCA OBLY BABY',
        precios: {
          caja: { label: 'Caja', precio: 39000 },
        },
      },
    },
    categoria: 'Bebé y Mamá',
    marca: 'Genérico',
    descripcion: 'Producto especializado para bebés y mamás. Extractor DE Elche Palanca Obly Baby.',
    imagen: imgBeb(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 39000 }
    ],
  },
  {
    id: 1251,
    nombre: 'Naproxeno 500MG Caja X 300 Tabletas',
    laboratorios: {
      laproff: {
        nombre: 'LAPROFF',
        nombreProducto: 'NAPROXENO 500MG CAJA X 300 TABLETAS',
        precios: {
          blister: { label: 'Blíster', precio: 4500 },
          caja: { label: 'Caja', precio: 130000 },
          pastillas___capsulas: { label: 'Pastillas / Capsulas', precio: 500 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'TINIDAZOL 500MG CAJA  X 8 TABLETAS LAB COASPHARMA',
        precios: {
          caja: { label: 'Caja', precio: 4500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'LAPROFF',
    descripcion: 'Producto de consumo masivo para el hogar. Naproxeno 500MG Caja X 300 Tabletas.',
    imagen: 'img/productos/Naproxeno 500mg x300 tab.jpg',
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres', precio: 4500 },
      { tipo: 'Caja', precio: 130000 },
      { tipo: 'Capsulas', precio: 500 }
    ],
  },
  {
    id: 1252,
    nombre: 'Tapabocas Negro',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'TAPABOCAS NEGRO',
        precios: {
          caja: { label: 'Caja', precio: 35000 },
          unidad: { label: 'Unidad', precio: 700 },
        },
      },
      schwarzkopf: {
        nombre: 'SCHWARZKOPF',
        nombreProducto: 'IGORA VITAL D. TUBO 1-1 NEGRO AZUL',
        precios: {
          caja: { label: 'Caja', precio: 35500 },
        },
      },
      lab_vogue: {
        nombre: 'LAB VOGUE',
        nombreProducto: 'VOGUE PESTANINA ULTRA VOLUMEN NEGRO 9 GRAMOS LABOR',
        precios: {
          frasco: { label: 'Frasco', precio: 22500 },
        },
      },
      begut: {
        nombre: 'BEGUT',
        nombreProducto: 'TAPABOCAS POR UNIDAD  BEGUT',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 500 },
        },
      },
      nabonasar_martinez_y: {
        nombre: 'NABONASAR MARTINEZ Y CIA.',
        nombreProducto: 'TINTE IRIS 24 NEGRO 9 GR 12 UDS',
        precios: {
          caja: { label: 'Caja', precio: 31000 },
          empaque: { label: 'Empaque', precio: 3700 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Tapabocas Negro.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 35000 },
      { tipo: 'Unidad', precio: 700 }
    ],
  },
  {
    id: 1253,
    nombre: 'Vidrio Ceramica',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'VIDRIO CERAMICA',
        precios: {
          caja: { label: 'Caja', precio: 5000 },
        },
      },
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'GOTERO PIPETA DE VIDRIO BOLSA X20 UNDS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 23500 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Vidrio Ceramica.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 5000 }
    ],
  },
  {
    id: 1254,
    nombre: 'Chicle Trident 5U Surt 8.5G X 18 Unds',
    laboratorios: {
      mondelez_colombia_s_: {
        nombre: 'MONDELEZ COLOMBIA S.A.S',
        nombreProducto: 'CHICLE TRIDENT 5U SURT 8.5G X 18 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 20000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'MONDELEZ COLOMBIA S.A.S',
    descripcion: 'Producto de consumo masivo para el hogar. Chicle Trident 5U Surt 8.5G X 18 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 20000 },
      { tipo: 'Unidad', precio: 1500 }
    ],
  },
  {
    id: 1255,
    nombre: 'Helado Artesanal Sabores Surt X 25 Und',
    laboratorios: {
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'HELADO ARTESANAL SABORES SURT X 25 UND',
        precios: {
          caja: { label: 'Caja', precio: 42500 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'HELADO MEDIO LITRO SABORES SURT',
        precios: {
          unidad: { label: 'Unidad', precio: 12000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'COMERCIAL NUTRESA S.A.S',
    descripcion: 'Producto de consumo masivo para el hogar. Helado Artesanal Sabores Surt X 25 Und.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 42500 },
      { tipo: 'Unidad', precio: 3500 }
    ],
  },
  {
    id: 1256,
    nombre: 'Shampo H Y S Sachet Surtido X 12 Sbs',
    laboratorios: {
      unilever_andina_colo: {
        nombre: 'UNILEVER ANDINA COLOMBIA',
        nombreProducto: 'SHAMPO SAVITAL SACHET  GRANDE  100ML   SURTIDO',
        precios: {
          bolsa: { label: 'Bolsa', precio: 3700 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'SHAMPO  H Y S  SACHET  SURTIDO  X  12 SBS',
        precios: {
          ristra: { label: 'Ristra', precio: 8000 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'SHAMPOO PANTENE SURTIDO SACHET X 12 SBS',
        precios: {
          ristra: { label: 'Ristra', precio: 7000 },
          unidad: { label: 'Unidad', precio: 1000 },
          blister: { label: 'Blíster', precio: 700 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SEDAL SHAMPOO SURTIDO 340ML',
        precios: {
          frasco: { label: 'Frasco', precio: 16000 },
          blister: { label: 'Blíster', precio: 1200 },
          ristra: { label: 'Ristra', precio: 8400 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS SHAMPOO SURTIDOS X  200 ML',
        precios: {
          unidad: { label: 'Unidad', precio: 13500 },
          frasco: { label: 'Frasco', precio: 11500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Shampo H Y S Sachet Surtido X 12 Sbs.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Ristra', precio: 8000 },
      { tipo: 'Unidad', precio: 1000 }
    ],
  },
  {
    id: 1257,
    nombre: 'Galleta Festival Sabores Surtidos X 12 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GALLETA FESTIVAL  SABORES SURTIDOS X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Galleta Festival Sabores Surtidos X 12 Unds.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Unidad', precio: 1500 }
    ],
  },
  {
    id: 1258,
    nombre: 'Jet Chocolatina Peq X 50',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'JET CHOCOLATINA PEQ  X 50',
        precios: {
          caja: { label: 'Caja', precio: 35000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'CHOCOLATINA GOL X 31G',
        precios: {
          caja: { label: 'Caja', precio: 1 },
          unidad: { label: 'Unidad', precio: 1000 },
        },
      },
      comestibles_italo: {
        nombre: 'COMESTIBLES ITALO',
        nombreProducto: 'ITALO CHOCOLATINA PEQUENA RELLENA X10UNDS',
        precios: {
          paquete: { label: 'Paquete', precio: 1 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      compania_nacional_ch: {
        nombre: 'COMPANIA NACIONAL CHOCOLATES S.A.S.',
        nombreProducto: 'CHOCOLATINA JET BURBUJET CRUJIVAINILLA X 21 GRAMOS',
        precios: {
          caja: { label: 'Caja', precio: 18000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Jet Chocolatina Peq X 50.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 35000 },
      { tipo: 'Unidad', precio: 1300 }
    ],
  },
  {
    id: 1259,
    nombre: 'Depilador Pinza Trim 5-29B',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DEPILADOR PINZA  TRIM 5-29B',
        precios: {
          unidad: { label: 'Unidad', precio: 3500 },
          caja: { label: 'Caja', precio: 4200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Depilador Pinza Trim 5-29B.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 3500 }
    ],
  },
  {
    id: 1260,
    nombre: 'Paleta Aloha Agua Surtida X 24 Und',
    laboratorios: {
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'PALETA ALOHA AGUA SURTIDA X 24 UND',
        precios: {
          caja: { label: 'Caja', precio: 31200 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'COMERCIAL NUTRESA S.A.S',
    descripcion: 'Producto de consumo masivo para el hogar. Paleta Aloha Agua Surtida X 24 Und.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 31200 },
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1261,
    nombre: 'Helado Chococono X 24 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'HELADO CHOCOCONO X 24 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 43200 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'HELADO PLATILLO SURT X 20UNDS',
        precios: {
          caja: { label: 'Caja', precio: 36000 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Helado Chococono X 24 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 43200 },
      { tipo: 'Unidad', precio: 3500 }
    ],
  },
  {
    id: 1262,
    nombre: 'Pediasure Surt Liquido Oral Frasco X 220 ML U',
    laboratorios: {
      abbott_laboratories_: {
        nombre: 'ABBOTT LABORATORIES S.A',
        nombreProducto: 'PEDIASURE SURT LIQUIDO ORAL FRASCO X 220 ML U',
        precios: {
          caja: { label: 'Caja', precio: 11000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'ABBOTT LABORATORIES S.A',
    descripcion: 'Producto de consumo masivo para el hogar. Pediasure Surt Liquido Oral Frasco X 220 ML U.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 11000 }
    ],
  },
  {
    id: 1263,
    nombre: 'Rexona Clinical Clean Hombre Sacchet Por 20 Sobre',
    laboratorios: {
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'REXONA CLINICAL CLEAN  HOMBRE SACCHET POR 20 SOBRE',
        precios: {
          caja: { label: 'Caja', precio: 16000 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'UNILEVER COLOMBIA SCC S.A.S.',
    descripcion: 'Producto de consumo masivo para el hogar. Rexona Clinical Clean Hombre Sacchet Por 20 Sobre.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 16000 },
      { tipo: 'Unidad', precio: 1200 }
    ],
  },
  {
    id: 1264,
    nombre: 'Savitas Shampo Surtido 30 ML Caja X 24 Sbs',
    laboratorios: {
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SAVITAS SHAMPO SURTIDO 30 ML CAJA X 24 SBS',
        precios: {
          caja: { label: 'Caja', precio: 26000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      naissant: {
        nombre: 'Naissant',
        nombreProducto: 'SHAMPOO NAISSANT SURTIDOS CAJA X 12 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 55000 },
          unidad: { label: 'Unidad', precio: 5800 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'UNILEVER COLOMBIA SCC S.A.S.',
    descripcion: 'Producto de consumo masivo para el hogar. Savitas Shampo Surtido 30 ML Caja X 24 Sbs.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 26000 },
      { tipo: 'Unidad', precio: 1300 }
    ],
  },
  {
    id: 1265,
    nombre: 'Pack Jabon Johnson Surtido 110 G X 12 Unds',
    laboratorios: {
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'PACK  JABON JOHNSON SURTIDO  110 G X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 35000 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'COLGATE PALMOLIVE CIA.',
    descripcion: 'Producto de consumo masivo para el hogar. Pack Jabon Johnson Surtido 110 G X 12 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 35000 },
      { tipo: 'Unidad', precio: 3500 }
    ],
  },
  {
    id: 1266,
    nombre: 'Solhidrex Sabores Surt X 30 Sobres',
    laboratorios: {
      labinco_s_a: {
        nombre: 'LABINCO S.A.',
        nombreProducto: 'SOLHIDREX SABORES SURT   X  30 SOBRES',
        precios: {
          caja: { label: 'Caja', precio: 42000 },
          unidad: { label: 'Unidad', precio: 3000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'LABINCO S.A.',
    descripcion: 'Producto de consumo masivo para el hogar. Solhidrex Sabores Surt X 30 Sobres.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 42000 },
      { tipo: 'Unidad', precio: 3000 }
    ],
  },
  {
    id: 1267,
    nombre: 'Halls Caramelo Duros Barra Surtido 302.4 G 12 Unds',
    laboratorios: {
      mondelez_colombia_s_: {
        nombre: 'MONDELEZ COLOMBIA S.A.S',
        nombreProducto: 'HALLS CARAMELO DUROS BARRA SURTIDO 302.4 G 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 16500 },
          unidad: { label: 'Unidad', precio: 1700 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'MONDELEZ COLOMBIA S.A.S',
    descripcion: 'Producto de consumo masivo para el hogar. Halls Caramelo Duros Barra Surtido 302.4 G 12 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 16500 },
      { tipo: 'Unidad', precio: 1700 }
    ],
  },
  {
    id: 1268,
    nombre: 'Gillette Prestobarba 3 Hojas Ristra X 10 Unds',
    laboratorios: {
      procter_gamble_colom: {
        nombre: 'PROCTER  GAMBLE COLOMBIA',
        nombreProducto: 'GILLETTE PRESTOBARBA 2 HOJAS RISTRA X 24 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 50000 },
          unidad: { label: 'Unidad', precio: 3200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'PROCTER GAMBLE COLOMBIA',
    descripcion: 'Producto de consumo masivo para el hogar. Gillette Prestobarba 3 Hojas Ristra X 10 Unds.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Ristra', precio: 48900 },
      { tipo: 'Unidad', precio: 4600 }
    ],
  },
  {
    id: 1269,
    nombre: 'Agua Brisa 280 ML',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'AGUA  BRISA 280 ML',
        precios: {
          canasta: { label: 'Canasta', precio: 12000 },
          unidad: { label: 'Unidad', precio: 1200 },
          botella: { label: 'Botella', precio: 1600 },
        },
      },
      coca_cola_femsa_s_a_: {
        nombre: 'COCA COLA FEMSA S.A DE.C.V',
        nombreProducto: 'BRISA AGUA PURA X1L',
        precios: {
          paca: { label: 'Paca', precio: 12000 },
          unidad: { label: 'Unidad', precio: 2400 },
          canasta: { label: 'Canasta', precio: 16200 },
          botella: { label: 'Botella', precio: 2600 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
      osa: {
        nombre: 'OSA',
        nombreProducto: 'AGUA OXIGENADA OSA X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 3900 },
        },
      },
      corpaul: {
        nombre: 'CORPAUL',
        nombreProducto: 'AGUA DESTILADA CORPAUL 500 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5200 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'PALETA ALOHA AGUA SURTIDA X 24 UND',
        precios: {
          caja: { label: 'Caja', precio: 31200 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AGUA OXIGENADA    X  120  ML',
        precios: {
          tarro: { label: 'Tarro', precio: 4800 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Agua Brisa 280 ML.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Canasta', precio: 6000 },
      { tipo: 'Canasta', precio: 12000 },
      { tipo: 'Unidad', precio: 1200 }
    ],
  },
  {
    id: 1270,
    nombre: 'Brisa Agua Pura 600 ML',
    laboratorios: {
      coca_cola_femsa_s_a_: {
        nombre: 'COCA COLA FEMSA S.A DE.C.V',
        nombreProducto: 'BRISA AGUA PURA X1L',
        precios: {
          paca: { label: 'Paca', precio: 12000 },
          unidad: { label: 'Unidad', precio: 2400 },
          canasta: { label: 'Canasta', precio: 16200 },
          botella: { label: 'Botella', precio: 2600 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BRISA AGUA PURA 600 ML',
        precios: {
          canasta: { label: 'Canasta', precio: 48000 },
          botella: { label: 'Botella', precio: 1600 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Brisa Agua Pura 600 ML.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Canasta', precio: 24000 },
      { tipo: 'Botella', precio: 1600 },
      { tipo: 'Canasta', precio: 48000 }
    ],
  },
  {
    id: 1271,
    nombre: 'Bebida Energizante Speed Max Grande 310 ML',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BEBIDA ENERGIZANTE SPEED MAX GRANDE 310 ML',
        precios: {
          canasta: { label: 'Canasta', precio: 45000 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Bebida Energizante Speed Max Grande 310 ML.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Canasta', precio: 23500 },
      { tipo: 'Canasta', precio: 45000 },
      { tipo: 'Unidad', precio: 2000 }
    ],
  },
  {
    id: 1272,
    nombre: 'Chocosptop X 50 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CHOCOSPTOP X 50 UNDS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 22356 },
          unidad: { label: 'Unidad', precio: 600 },
          ristra: { label: 'Ristra', precio: 20000 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'TOA.NOSOTRAS NATURAL INV.CLAS.TELA X 30 UNDS',
        precios: {
          bolsa: { label: 'Bolsa', precio: 12800 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
      colombiana_kimberly_: {
        nombre: 'COLOMBIANA KIMBERLY COLPA',
        nombreProducto: 'TAMPONES KOTEX DIG MEDIO RISTRA X 5 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 10000 },
          unidad: { label: 'Unidad', precio: 2800 },
        },
      },
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'BONFIEST PLUS  X 32 UNDS',
        precios: {
          blister: { label: 'Blíster', precio: 4000 },
          caja: { label: 'Caja', precio: 102400 },
        },
      },
      alfa_trading_ltda: {
        nombre: 'ALFA TRADING LTDA',
        nombreProducto: 'JERINGA 10 ML 21X 1/12 ALFA X 100 UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 700 },
          bolsa: { label: 'Bolsa', precio: 23500 },
          caja: { label: 'Caja', precio: 20000 },
        },
      },
      edgewell_personal_ca: {
        nombre: 'EDGEWELL PERSONAL CARE CO',
        nombreProducto: 'MAQUINA SCHICK  4 TITANIUM   * 10 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 38500 },
          unidad: { label: 'Unidad', precio: 4600 },
        },
      },
      ecar_ltda: {
        nombre: 'ECAR LTDA',
        nombreProducto: 'TIAMINA 100MG/ML  X10 ML SOL INY  CJX12UNDS',
        precios: {
          unidad: { label: 'Unidad', precio: 6700 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Chocosptop X 50 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Bolsa', precio: 22356 },
      { tipo: 'Unidad', precio: 600 }
    ],
  },
  {
    id: 1273,
    nombre: 'Chococono Mini X 24 Unds',
    laboratorios: {
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'CHOCOCONO MINI X  24 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 51000 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'HELADO CHOCOCONO X 24 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 43200 },
          unidad: { label: 'Unidad', precio: 3500 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'TENA TOALLA DELGADA DISCREET MINI X30UNDS',
        precios: {
          caja: { label: 'Caja', precio: 23900 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'COMERCIAL NUTRESA S.A.S',
    descripcion: 'Producto de consumo masivo para el hogar. Chococono Mini X 24 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 51000 },
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1274,
    nombre: 'Mani LA Especial Con Sal 35 GR X 12 Und',
    laboratorios: {
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'MANI  LA ESPECIAL MIX ARANDANOS X 12 UNDS',
        precios: {
          blister: { label: 'Blíster', precio: 3200 },
          caja: { label: 'Caja', precio: 24000 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MANI LA ESPECIAL PASAS 35G X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 9000 },
          unidad: { label: 'Unidad', precio: 2100 },
        },
      },
      compania_nacional_ch: {
        nombre: 'COMPANIA NACIONAL CHOCOLATES S.A.S.',
        nombreProducto: 'MANI LA ESPECIAL CON SAL 35 GR X 12 UND',
        precios: {
          caja: { label: 'Caja', precio: 22000 },
          unidad: { label: 'Unidad', precio: 2100 },
        },
      },
      c_i_super_de_aliment: {
        nombre: 'C.I.  SUPER DE ALIMENTOS',
        nombreProducto: 'CHOCO JUMBO MANI PEQUEÑA X24',
        precios: {
          caja: { label: 'Caja', precio: 30000 },
          unidad: { label: 'Unidad', precio: 1500 },
        },
      },
      aspen_colombiana_sas: {
        nombre: 'ASPEN COLOMBIANA SAS',
        nombreProducto: 'OFERTA LECHE MAGNESIA ORIGINAL PRECIO ESPECIAL',
        precios: {
          caja: { label: 'Caja', precio: 27400 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'COMPANIA NACIONAL CHOCOLATES S.A.S.',
    descripcion: 'Producto de consumo masivo para el hogar. Mani LA Especial Con Sal 35 GR X 12 Und.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 22000 },
      { tipo: 'Unidad', precio: 2100 }
    ],
  },
  {
    id: 1275,
    nombre: 'Dte Lady Speed Stick Sachet Gel Caja 18 Und',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'DTE LADY SPEED STICK SACHET  GEL     CAJA 18 UND',
        precios: {
          caja: { label: 'Caja', precio: 18750 },
          unidad: { label: 'Unidad', precio: 1200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Dte Lady Speed Stick Sachet Gel Caja 18 Und.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 18750 },
      { tipo: 'Unidad', precio: 1200 }
    ],
  },
  {
    id: 1276,
    nombre: 'Pañal Tena Slip Confort XL X 12 Unds',
    laboratorios: {
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAÑAL TENA SLIP CONFORT XL X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 46800 },
          unidad: { label: 'Unidad', precio: 4200 },
        },
      },
      productos_familia_sa: {
        nombre: 'PRODUCTOS FAMILIA SANCELA',
        nombreProducto: 'PANAL TENA SLIP CLASICO L  X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 30000 },
          unidad: { label: 'Unidad', precio: 4000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'PRODUCTOS FAMILIA S.A.',
    descripcion: 'Producto de consumo masivo para el hogar. Pañal Tena Slip Confort XL X 12 Unds.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 46800 },
      { tipo: 'Unidad', precio: 4200 }
    ],
  },
  {
    id: 1277,
    nombre: 'Blo Solar Sundown Playa Y Piscina Spf 70 X 12 Sbs',
    laboratorios: {
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'SUNDOWN PLAYA Y PISCINA 70 POTECTOR SOLAR 120 ML',
        precios: {
          tarro: { label: 'Tarro', precio: 49800 },
          blister: { label: 'Blíster', precio: 3800 },
          caja: { label: 'Caja', precio: 38400 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'JOHNSON JOHNSON DE COLO',
    descripcion: 'Producto de consumo masivo para el hogar. Blo Solar Sundown Playa Y Piscina Spf 70 X 12 Sbs.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 3800 },
      { tipo: 'Caja', precio: 38400 }
    ],
  },
  {
    id: 1278,
    nombre: 'Alcohol Antiseptico MK Frasco X 120 ML',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ALCOHOL ANTISEPTICO MK FRASCO X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 3200 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto de consumo masivo para el hogar. Alcohol Antiseptico MK Frasco X 120 ML.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Frasco', precio: 3200 }
    ],
  },
  {
    id: 1279,
    nombre: 'Alcohol MK X 350 ML',
    laboratorios: {
      tecnoquimicas_s_a: {
        nombre: 'TECNOQUIMICAS S.A.',
        nombreProducto: 'ALCOHOL MK X 350 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5900 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'LISTERINE CONTROL CALCULO ZERO ALCOHOL 500 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 29900 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'LISTERINE COOL MINT ZERO ALCOHOL X 360 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 15000 },
          caja: { label: 'Caja', precio: 3800 },
        },
      },
      colgate_palmolive_ci: {
        nombre: 'COLGATE PALMOLIVE CIA.',
        nombreProducto: 'ENJ.COLGATE PERIOGARD SIN ALCOHOL 250 ML',
        precios: {
          caja: { label: 'Caja', precio: 30500 },
        },
      },
      icom: {
        nombre: 'ICOM',
        nombreProducto: 'ALCOPI ALCOHOL 70% X 130ML SPRAY',
        precios: {
          caja: { label: 'Caja', precio: 3500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'TECNOQUIMICAS S.A.',
    descripcion: 'Producto de consumo masivo para el hogar. Alcohol MK X 350 ML.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Frasco', precio: 5900 }
    ],
  },
  {
    id: 1280,
    nombre: 'Isodine Ovulos 200MG Yodovpovi X24 Ovul',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'ISODINE OVULOS 200MG YODOVPOVI  X24 OVUL',
        precios: {
          caja: { label: 'Caja', precio: 72000 },
          unidad: { label: 'Unidad', precio: 3100 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Isodine Ovulos 200MG Yodovpovi X24 Ovul.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 72000 },
      { tipo: 'Unidad', precio: 3100 }
    ],
  },
  {
    id: 1281,
    nombre: 'Helado Casero Sabores Surt X 25 Und',
    laboratorios: {
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'HELADO CASERO SABORES SURT X 25 UND',
        precios: {
          caja: { label: 'Caja', precio: 30000 },
          unidad: { label: 'Unidad', precio: 2500 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'HELADO MEDIO LITRO SABORES SURT',
        precios: {
          unidad: { label: 'Unidad', precio: 12000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'COMERCIAL NUTRESA S.A.S',
    descripcion: 'Producto de consumo masivo para el hogar. Helado Casero Sabores Surt X 25 Und.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 30000 },
      { tipo: 'Unidad', precio: 2500 }
    ],
  },
  {
    id: 1282,
    nombre: 'Aceite Ricino Frasco X 30 ML X 12 Unds',
    laboratorios: {
      lab_athos_s_a_s: {
        nombre: 'LAB. ATHOS S.A.S',
        nombreProducto: 'ACEITE RICINO FRASCO X 30 ML X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 31200 },
          frasco: { label: 'Frasco', precio: 2700 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'LAB. ATHOS S.A.S',
    descripcion: 'Producto de consumo masivo para el hogar. Aceite Ricino Frasco X 30 ML X 12 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 31200 },
      { tipo: 'Frasco', precio: 2700 }
    ],
  },
  {
    id: 1283,
    nombre: 'Papel Higienico Familia Alcolchax 48 Und',
    laboratorios: {
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'PAPEL HIGIENICO   FAMILIA ALCOLCHAX       48   UND',
        precios: {
          caja: { label: 'Caja', precio: 96000 },
          unidad: { label: 'Unidad', precio: 2600 },
          paquete: { label: 'Paquete', precio: 56000 },
        },
      },
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PAPEL HIGIENICO FAMILIA MEGA ROLLO 4UND',
        precios: {
          caja: { label: 'Caja', precio: 9500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'PRODUCTOS FAMILIA S.A.',
    descripcion: 'Producto de consumo masivo para el hogar. Papel Higienico Familia Alcolchax 48 Und.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 96000 },
      { tipo: 'Unidad', precio: 2600 }
    ],
  },
  {
    id: 1284,
    nombre: 'Kinder Barra DE Chocolate Rellena X24UNDS',
    laboratorios: {
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'KINDER BARRA DE CHOCOLATE RELLENA X24UNDS',
        precios: {
          caja: { label: 'Caja', precio: 26500 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'COMERCIAL NUTRESA S.A.S',
    descripcion: 'Producto de consumo masivo para el hogar. Kinder Barra DE Chocolate Rellena X24UNDS.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 26500 },
      { tipo: 'Unidad', precio: 1800 }
    ],
  },
  {
    id: 1285,
    nombre: 'Gaseosa Coca-cola 400ML',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GASEOSA COCA-COLA 400ML',
        precios: {
          canasta: { label: 'Canasta', precio: 30000 },
          unidad: { label: 'Unidad', precio: 3100 },
          caja: { label: 'Caja', precio: 65000 },
        },
      },
      coca_cola_femsa_s_a_: {
        nombre: 'COCA COLA FEMSA S.A DE.C.V',
        nombreProducto: 'GASEOSA COCA - COLA  250ML',
        precios: {
          canasta: { label: 'Canasta', precio: 21600 },
          botella: { label: 'Botella', precio: 2000 },
          paca: { label: 'Paca', precio: 56000 },
          caja: { label: 'Caja', precio: 8400 },
          six_pack: { label: 'Six Pack', precio: 18000 },
          unidad: { label: 'Unidad', precio: 3100 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Gaseosa Coca-cola 400ML.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Canasta', precio: 9600 },
      { tipo: 'Canasta', precio: 30000 },
      { tipo: 'Unidad', precio: 3100 }
    ],
  },
  {
    id: 1286,
    nombre: 'Gomas Trululu Surtidas 70G',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GOMAS TRULULU SURTIDAS  70G',
        precios: {
          paquete: { label: 'Paquete', precio: 2300 },
          unidad: { label: 'Unidad', precio: 3200 },
        },
      },
      c_i_super_de_aliment: {
        nombre: 'C.I.  SUPER DE ALIMENTOS',
        nombreProducto: 'GOMAS TRULULU SPLASH',
        precios: {
          paquete: { label: 'Paquete', precio: 2000 },
        },
      },
      comestibles_aldor: {
        nombre: 'COMESTIBLES ALDOR',
        nombreProducto: 'GOMAS TROLLI SURTIDAS X 70 G',
        precios: {
          caja: { label: 'Caja', precio: 1800 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Gomas Trululu Surtidas 70G.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 2300 }
    ],
  },
  {
    id: 1287,
    nombre: 'Mentas Chao Pastillas Surt X 16 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'MENTAS CHAO PASTILLAS SURT X 16 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 18000 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
      comestibles_aldor: {
        nombre: 'COMESTIBLES ALDOR',
        nombreProducto: 'MENTAS CHAO PASTILLAS SURTIDA',
        precios: {
          caja: { label: 'Caja', precio: 20800 },
          unidad: { label: 'Unidad', precio: 1300 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Mentas Chao Pastillas Surt X 16 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 18000 },
      { tipo: 'Unidad', precio: 1300 }
    ],
  },
  {
    id: 1288,
    nombre: 'Barra Mini Bianchi Surtidos X 18 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'BARRA MINI BIANCHI  SURTIDOS  X 18 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 17000 },
          unidad: { label: 'Unidad', precio: 1100 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Barra Mini Bianchi Surtidos X 18 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 17000 },
      { tipo: 'Unidad', precio: 1100 }
    ],
  },
  {
    id: 1289,
    nombre: 'Crema Limon Pequeña Por 12 Und Aproqui',
    laboratorios: {
      aproquim_ltda: {
        nombre: 'APROQUIM LTDA',
        nombreProducto: 'CREMA LIMON   PEQUEÑA    POR 12 UND        APROQUI',
        precios: {
          paquete: { label: 'Paquete', precio: 6000 },
          unidad: { label: 'Unidad', precio: 600 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'APROQUIM LTDA',
    descripcion: 'Producto de consumo masivo para el hogar. Crema Limon Pequeña Por 12 Und Aproqui.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Paquete', precio: 6000 },
      { tipo: 'Unidad', precio: 600 }
    ],
  },
  {
    id: 1290,
    nombre: 'Maquina Schick 4 Titanium * 10 Unds',
    laboratorios: {
      edgewell_personal_ca: {
        nombre: 'EDGEWELL PERSONAL CARE CO',
        nombreProducto: 'MAQUINA SCHICK  4 TITANIUM   * 10 UNDS',
        precios: {
          ristra: { label: 'Ristra', precio: 38500 },
          unidad: { label: 'Unidad', precio: 4600 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'EDGEWELL PERSONAL CARE CO',
    descripcion: 'Producto de consumo masivo para el hogar. Maquina Schick 4 Titanium * 10 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Ristra', precio: 38500 },
      { tipo: 'Unidad', precio: 4600 }
    ],
  },
  {
    id: 1291,
    nombre: 'Paleta Chocolisto',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PALETA CHOCOLISTO',
        precios: {
          caja: { label: 'Caja', precio: 36000 },
          unidad: { label: 'Unidad', precio: 2200 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'PALETA ALOHA AGUA SURTIDA X 24 UND',
        precios: {
          caja: { label: 'Caja', precio: 31200 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Paleta Chocolisto.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 36000 },
      { tipo: 'Unidad', precio: 2200 }
    ],
  },
  {
    id: 1292,
    nombre: 'Jabon Intimo Intibon Surt X 12 Sbs',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'JABON INTIMO INTIBON SURT  X  12 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1200 },
          caja: { label: 'Caja', precio: 10000 },
          frasco: { label: 'Frasco', precio: 14900 },
        },
      },
      belleza_express_ltda: {
        nombre: 'BELLEZA EXPRESS LTDA',
        nombreProducto: 'JABON INTIMO INTIBON SURTIDOS  X 120G',
        precios: {
          caja: { label: 'Caja', precio: 11500 },
        },
      },
      productos_familia_s_: {
        nombre: 'PRODUCTOS FAMILIA S.A.',
        nombreProducto: 'JABON INTIMO NOSOTRAS SURT X 200 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 15600 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Jabon Intimo Intibon Surt X 12 Sbs.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 1200 },
      { tipo: 'Caja', precio: 10000 }
    ],
  },
  {
    id: 1293,
    nombre: 'Prueba DE Embarazo Early Test - Cassette',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'PRUEBA DE EMBARAZO EARLY TEST - CASSETTE',
        precios: {
          caja: { label: 'Caja', precio: 7500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Prueba DE Embarazo Early Test - Cassette.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 7500 }
    ],
  },
  {
    id: 1294,
    nombre: 'Galleta Jet Wuafer Recubierta Sutido X20UNDS',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'GALLETA JET WUAFER RECUBIERTA SUTIDO X20UNDS',
        precios: {
          caja: { label: 'Caja', precio: 19000 },
          unidad: { label: 'Unidad', precio: 1800 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Galleta Jet Wuafer Recubierta Sutido X20UNDS.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Caja', precio: 19000 },
      { tipo: 'Unidad', precio: 1800 }
    ],
  },
  {
    id: 1295,
    nombre: 'Agua Brisa Con Gas X 600 ML',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'AGUA  BRISA 280 ML',
        precios: {
          canasta: { label: 'Canasta', precio: 12000 },
          unidad: { label: 'Unidad', precio: 1200 },
          botella: { label: 'Botella', precio: 1600 },
        },
      },
      coca_cola_femsa_s_a_: {
        nombre: 'COCA COLA FEMSA S.A DE.C.V',
        nombreProducto: 'BRISA AGUA PURA X1L',
        precios: {
          paca: { label: 'Paca', precio: 12000 },
          unidad: { label: 'Unidad', precio: 2400 },
          canasta: { label: 'Canasta', precio: 16200 },
          botella: { label: 'Botella', precio: 2600 },
          caja: { label: 'Caja', precio: 1 },
        },
      },
      osa: {
        nombre: 'OSA',
        nombreProducto: 'AGUA OXIGENADA OSA X 120 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 3900 },
        },
      },
      corpaul: {
        nombre: 'CORPAUL',
        nombreProducto: 'AGUA DESTILADA CORPAUL 500 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 5200 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'PALETA ALOHA AGUA SURTIDA X 24 UND',
        precios: {
          caja: { label: 'Caja', precio: 31200 },
          unidad: { label: 'Unidad', precio: 2000 },
        },
      },
      laboratorios_coaspha: {
        nombre: 'LABORATORIOS COASPHARMA S.A.S',
        nombreProducto: 'AGUA OXIGENADA    X  120  ML',
        precios: {
          tarro: { label: 'Tarro', precio: 4800 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'COCA COLA FEMSA S.A DE.C.V',
    descripcion: 'Producto de consumo masivo para el hogar. Agua Brisa Con Gas X 600 ML.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Canasta', precio: 16000 },
      { tipo: 'Unidad', precio: 1700 }
    ],
  },
  {
    id: 1296,
    nombre: 'Chupo Rep Estandar Skippy One',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CHUPO REP ESTANDAR SKIPPY ONE',
        precios: {
          unidad: { label: 'Unidad', precio: 1500 },
          caja: { label: 'Caja', precio: 4100 },
          paquete: { label: 'Paquete', precio: 16500 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Chupo Rep Estandar Skippy One.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Unidad', precio: 1500 }
    ],
  },
  {
    id: 1297,
    nombre: 'Shampoo Johnson Baby Surt X 12 Sbs',
    laboratorios: {
      s_c_johnson_colombia: {
        nombre: 'S.C. JOHNSON COLOMBIANA',
        nombreProducto: 'SHAMPOO JOHNSON BABY SURT   X 12 SBS',
        precios: {
          blister: { label: 'Blíster', precio: 1200 },
          caja: { label: 'Caja', precio: 13000 },
        },
      },
      johnson_johnson_de_c: {
        nombre: 'JOHNSON  JOHNSON DE COLO',
        nombreProducto: 'JOHNSONS SHAMPOO BABY 750ML SURTIDOS',
        precios: {
          caja: { label: 'Caja', precio: 33900 },
          unidad: { label: 'Unidad', precio: 13500 },
          frasco: { label: 'Frasco', precio: 11500 },
        },
      },
      alicorp_colombia: {
        nombre: 'ALICORP COLOMBIA',
        nombreProducto: 'BABY SOFT SHAMPOO SURTIDO X 750 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 24000 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'S.C. JOHNSON COLOMBIANA',
    descripcion: 'Producto de consumo masivo para el hogar. Shampoo Johnson Baby Surt X 12 Sbs.',
    imagen: imgMer(),
    tags: [T.vendido],
    variantes: [
      { tipo: 'Sobres', precio: 1200 },
      { tipo: 'Caja', precio: 13000 }
    ],
  },
  {
    id: 1298,
    nombre: 'Apositos Oculares Para Niños',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'APOSITOS OCULARES PARA NIÑOS',
        precios: {
          blister: { label: 'Blíster', precio: 900 },
          caja: { label: 'Caja', precio: 13300 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Apositos Oculares Para Niños.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Sobres', precio: 900 },
      { tipo: 'Caja', precio: 13300 }
    ],
  },
  {
    id: 1299,
    nombre: 'Chocolatina Jumbo Mani 90G X 6 Unds',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'CHOCOLATINA JUMBO MANI 35G X 12 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 41000 },
          unidad: { label: 'Unidad', precio: 3800 },
        },
      },
      comercial_nutresa_s_: {
        nombre: 'COMERCIAL NUTRESA S.A.S',
        nombreProducto: 'CHOCOLATINA JUMBO ROSCA  X 6 UNDS',
        precios: {
          caja: { label: 'Caja', precio: 15000 },
          unidad: { label: 'Unidad', precio: 2300 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'Genérico',
    descripcion: 'Producto de consumo masivo para el hogar. Chocolatina Jumbo Mani 90G X 6 Unds.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 48000 },
      { tipo: 'Unidad', precio: 8600 }
    ],
  },
  {
    id: 1300,
    nombre: 'Bebida Hidratante Gatorade Surtido',
    laboratorios: {
      gaseosas_lux_sas: {
        nombre: 'GASEOSAS LUX SAS',
        nombreProducto: 'BEBIDA HIDRATANTE GATORADE         SURTIDO',
        precios: {
          caja: { label: 'Caja', precio: 3900 },
        },
      },
    },
    categoria: 'Mercado y Hogar',
    marca: 'GASEOSAS LUX SAS',
    descripcion: 'Producto de consumo masivo para el hogar. Bebida Hidratante Gatorade Surtido.',
    imagen: imgMer(),
    tags: [],
    variantes: [
      { tipo: 'Caja', precio: 3900 }
    ],
  },

/* ═══ FIN DE LOS 300 NUEVOS PRODUCTOS ═══ */
  

];

/* ════════════════════════════════════════════════════════════
   METADATOS DE CATEGORÍAS (sin cambios)
   ════════════════════════════════════════════════════════════ */
const CATEGORIAS_META = {
  'Medicamentos':     { icon:'💊', color:'#E8F5E9', accent:'#1565C0', emoji:'💊' },
  'Belleza':          { icon:'💄', color:'#FCE4EC', accent:'#AD1457', emoji:'💄' },
  'Cuidado Personal': { icon:'🧴', color:'#E3F2FD', accent:'#00695C', emoji:'🧴' },
  'Bebé y Mamá':      { icon:'👶', color:'#FFF9C4', accent:'#E65100', emoji:'👶' },
  'Mercado y Hogar':  { icon:'🏠', color:'#F3E5F5', accent:'#6A1B9A', emoji:'🏠' },
  'Marcas Propias':   { icon:'⭐', color:'#E0F2F1', accent:'#1B5E20', emoji:'⭐' },
};

/* ════════════════════════════════════════════════════════════
   PROMOCIONES (sin cambios)
   ════════════════════════════════════════════════════════════ */
const PROMOCIONES = [
  {
    id: 1,
    nombre: '🤧 2x1 en Antigripales Noxpirin',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'NOXPIRIN PLUS CAPS ADLUTOS DIA NOCHE X  120 CAPS',
        precios: {
          blister: { label: 'Blíster', precio: 5000 },
          caja: { label: 'Caja', precio: 114000 },
          par: { label: 'Par', precio: 3000 },
        },
      },
      lab_siegfried_s_a: {
        nombre: 'LAB.SIEGFRIED S.A',
        nombreProducto: 'NOXPIRIN F JUGO DIA MANDARINA GRA.24 SBS',
        precios: {
          caja: { label: 'Caja', precio: 38400 },
          unidad: { label: 'Unidad', precio: 2600 },
          blister: { label: 'Blíster', precio: 5000 },
          frasco: { label: 'Frasco', precio: 15700 },
        },
      },
    },
    descripcion: 'Lleva 2 cajas de Noxpirin F Adultos Noche al precio de 1.',
    tipo: '2x1',
    productosAfectados: [24],
    precioEspecial: 14000,
    descuentoPorcentaje: 50,
    condiciones: 'Válido en presentación x24 sobres. Máx. 2 pares por cliente.',
    vigenciaHasta: '2025-12-31',
  },
  {
    id: 2,
    nombre: '💧 Combo Hidratación Electrolit',
    descripcion: 'Lleva 3 Electrolit 625ml y paga solo 2. Cualquier sabor.',
    tipo: '2x1',
    productosAfectados: [95],
    precioEspecial: 14000,
    descuentoPorcentaje: 33,
    condiciones: 'Mínimo 3 unidades de 625ml. Precio por las 3.',
    vigenciaHasta: '2025-12-31',
  },
  {
    id: 3,
    nombre: '💊 Combo Dolor Total',
    descripcion: 'Ibuprofeno 400mg + Diclofenaco 50mg.',
    tipo: 'combo',
    productosAfectados: [2, 61],
    precioEspecial: 7000,
    descuentoPorcentaje: 15,
    condiciones: 'Ibuprofeno x10 + Diclofenaco x10 tab.',
    vigenciaHasta: '2025-12-31',
  },
  {
    id: 4,
    nombre: '❤️ Pack Corazón Sano',
    descripcion: 'Vitamina C 500mg x144 + Aspirina 100mg x140.',
    tipo: 'combo',
    productosAfectados: [82, 15],
    precioEspecial: 35000,
    descuentoPorcentaje: 20,
    condiciones: 'Una presentación de cada producto.',
    vigenciaHasta: '2025-12-31',
  },
  {
    id: 5,
    nombre: '🌿 Kit Vitaminas Inmunidad',
    laboratorios: {
      generico: {
        nombre: 'Genérico',
        nombreProducto: 'VITAMINAS    VITALYXIR     ADULTO   NIÑO',
        imagen: 'img/productos/Dolex Bebés 60ml jarabe.jpg',
        precios: {
          unidad: { label: 'Unidad', precio: 69800 },
          caja: { label: 'Caja', precio: 36000 },
        },
      },
      unilever_colombia_sc: {
        nombre: 'UNILEVER COLOMBIA SCC S.A.S.',
        nombreProducto: 'SAVITAL CREMA PEINAR MULTIVITAMINAS 275 MILILITROS',
        precios: {
          caja: { label: 'Caja', precio: 12500 },
        },
      },
      quala_s_a: {
        nombre: 'QUALA S.A.',
        nombreProducto: 'GEL EGO VITAMINAS X 240 ML',
        precios: {
          frasco: { label: 'Frasco', precio: 10800 },
        },
      },
    },
    descripcion: 'Vitamina C + Zinc Naranja + Complejo B.',
    tipo: 'combo',
    productosAfectados: [82, 83],
    precioEspecial: 32000,
    descuentoPorcentaje: 18,
    condiciones: 'Vitamina C+Zinc x100 + Complejo B x250.',
    vigenciaHasta: '2025-12-31',
  },
];

const getPromocionesActivas = () => {
  const hoy = new Date().toISOString().split('T')[0];
  return PROMOCIONES.filter(p => p.vigenciaHasta >= hoy);
};

const getPromocionesDelProducto = (productoId) =>
  getPromocionesActivas().filter(p => p.productosAfectados.includes(productoId));

const calcularAhorro = (promo) => {
  if (!promo.descuentoPorcentaje) return 0;
  const producto = CATALOGO.find(p => p.id === promo.productosAfectados[0]);
  if (!producto) return 0;
  const base = promo.productosAfectados.reduce((acc, id) => {
    const p = CATALOGO.find(x => x.id === id);
    return acc + (p ? p.variantes[0].precio : 0);
  }, 0);
  return Math.round(base * (promo.descuentoPorcentaje / 100));
};

/* ════════════════════════════════════════════════════════════
   HELPERS (sin cambios)
   ════════════════════════════════════════════════════════════ */
const getCategorias    = () => [...new Set(CATALOGO.map(p => p.categoria))];
const getMarcas        = () => [...new Set(CATALOGO.map(p => p.marca))].sort();
const getPrecioBase    = p  => Math.min(...p.variantes.map(v => v.precio));
const formatPrecio     = n  => '$' + n.toLocaleString('es-CO');

const filtrarProductos = ({ categoria = null, marca = null, precioMin = 0, precioMax = Infinity, busqueda = '' } = {}) => {
  const q = busqueda.toLowerCase().trim();
  return CATALOGO.filter(p => {
    if (categoria && p.categoria !== categoria) return false;
    if (marca     && p.marca     !== marca)     return false;
    const precioBase = p.variantes[0].precio;
    if (precioBase < precioMin || precioBase > precioMax) return false;
    if (q && !p.nombre.toLowerCase().includes(q) &&
             !p.categoria.toLowerCase().includes(q) &&
             !p.marca.toLowerCase().includes(q) &&
             !p.descripcion.toLowerCase().includes(q)) return false;
    return true;
  });
};

/* ── Exponer al scope global ── */
if (typeof window !== 'undefined') {
  window.CATALOGO                  = CATALOGO;
  window.CATEGORIAS_META           = CATEGORIAS_META;
  window.PROMOCIONES               = PROMOCIONES;
  window.getCategorias             = getCategorias;
  window.getMarcas                 = getMarcas;
  window.filtrarProductos          = filtrarProductos;
  window.getPrecioBase             = getPrecioBase;
  window.formatPrecio              = formatPrecio;
  window.getPromocionesActivas     = getPromocionesActivas;
  window.getPromocionesDelProducto = getPromocionesDelProducto;
  window.calcularAhorro            = calcularAhorro;
}