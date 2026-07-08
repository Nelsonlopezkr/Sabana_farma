# ==================================================================
#  Droguerias Economicas - generar-imagenes-data.ps1  v1.0
#
#  QUE HACE:
#   1. Escanea img\productos\ (todos los .jpg .jpeg .webp)
#   2. Los cruza con el catalogo por slug del nombre
#   3. Genera js\imagenes-data.js con el mapa id -> ruta de imagen
#      (archivo NUEVO: nunca toca productos-data.js)
#
#  FLUJO DE TRABAJO DESDE AHORA:
#   - Agregas imagenes con el gestor como siempre
#   - Ejecutas este script (5 segundos)
#   - git add -A / commit / push
#   Las imagenes quedan conectadas a la pagina automaticamente.
#
#  EJECUTAR:
#   powershell -ExecutionPolicy Bypass -File .\generar-imagenes-data.ps1
# ==================================================================

# --- CONFIGURACION ---
$RutaRepo = "C:\Users\necso\OneDrive\Desktop\Desarrollo W\droguerias"
# ---------------------

$RutaDatos  = Join-Path $RutaRepo "js\productos-data.js"
$CarpetaImg = Join-Path $RutaRepo "img\productos"
$RutaSalida = Join-Path $RutaRepo "js\imagenes-data.js"

function Get-Slug([string]$nombre) {
    $s = $nombre.ToLowerInvariant()
    $s = $s.Normalize([System.Text.NormalizationForm]::FormD)
    $sb = New-Object System.Text.StringBuilder
    foreach ($c in $s.ToCharArray()) {
        if ([System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($c) -ne
            [System.Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($c)
        }
    }
    $s = $sb.ToString()
    $s = [regex]::Replace($s, '[^a-z0-9]+', '-')
    return $s.Trim('-')
}

if (-not (Test-Path -LiteralPath $RutaDatos))  { Write-Host "ERROR: no existe $RutaDatos"  -ForegroundColor Red; exit 1 }
if (-not (Test-Path -LiteralPath $CarpetaImg)) { Write-Host "ERROR: no existe $CarpetaImg" -ForegroundColor Red; exit 1 }

# --- 1. Leer catalogo: pares id + nombre ---
$raw = Get-Content -LiteralPath $RutaDatos -Raw -Encoding UTF8
$pares = [regex]::Matches($raw, '"id":\s*(\d+)\s*,\s*\r?\n\s*"nombre":\s*"([^"]+)"')
Write-Host ""
Write-Host "[OK] Productos leidos del catalogo: $($pares.Count)" -ForegroundColor Green

# mapa slug -> id (el primero gana)
$slugAId = @{}
foreach ($m in $pares) {
    $slug = Get-Slug $m.Groups[2].Value
    if ($slug -and -not $slugAId.ContainsKey($slug)) { $slugAId[$slug] = $m.Groups[1].Value }
}

# --- 2. Escanear imagenes ---
$archivos = Get-ChildItem -LiteralPath $CarpetaImg -File |
    Where-Object { $_.Extension -match '^\.(jpg|jpeg|webp)$' }
Write-Host "[OK] Imagenes en img\productos: $($archivos.Count)" -ForegroundColor Green

# preferir .webp si existe jpg y webp del mismo slug
$porSlug = @{}
foreach ($f in $archivos) {
    $base = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    $ext  = $f.Extension.ToLowerInvariant()
    if (-not $porSlug.ContainsKey($base) -or $ext -eq '.webp') { $porSlug[$base] = $f.Name }
}

# --- 3. Cruzar y construir el mapa id -> ruta ---
$mapa = New-Object System.Collections.Generic.List[string]
$sinProducto = New-Object System.Collections.Generic.List[string]
foreach ($slug in ($porSlug.Keys | Sort-Object)) {
    if ($slugAId.ContainsKey($slug)) {
        $id = $slugAId[$slug]
        $mapa.Add('  "' + $id + '": "img/productos/' + $porSlug[$slug] + '"')
    } else {
        $sinProducto.Add($porSlug[$slug])
    }
}

# --- 4. Escribir js\imagenes-data.js ---
$lineas = @()
$lineas += '/* =========================================================='
$lineas += '   IMAGENES-DATA - GENERADO AUTOMATICAMENTE, NO EDITAR A MANO'
$lineas += '   Regenerar con: generar-imagenes-data.ps1'
$lineas += '   Conecta las imagenes de img/productos/ con el catalogo.'
$lineas += '   Cargar DESPUES de productos-data.js'
$lineas += '   ========================================================== */'
$lineas += 'var IMAGENES_PRODUCTOS = {'
$lineas += ($mapa -join ",`n")
$lineas += '};'
$lineas += ''
$lineas += '/* Aplicar rutas al catalogo (mismo mecanismo que las rutas'
$lineas += '   directas en productos-data.js, que ya funciona) */'
$lineas += '(function () {'
$lineas += "  if (typeof CATALOGO === 'undefined') return;"
$lineas += '  CATALOGO.forEach(function (p) {'
$lineas += '    var ruta = IMAGENES_PRODUCTOS[String(p.id)];'
$lineas += '    if (!ruta) return;'
$lineas += '    if (!p.imagen) p.imagen = ruta;'
$lineas += '    if (p.variantes && p.variantes[0] && !p.variantes[0].imagen) {'
$lineas += '      p.variantes[0].imagen = ruta;'
$lineas += '    }'
$lineas += '  });'
$lineas += '})();'

[System.IO.File]::WriteAllText($RutaSalida, ($lineas -join "`n"), (New-Object System.Text.UTF8Encoding($false)))

Write-Host "[OK] Generado: js\imagenes-data.js" -ForegroundColor Green
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Imagenes conectadas al catalogo: $($mapa.Count)" -ForegroundColor Green
Write-Host " Imagenes sin producto (revisar):  $($sinProducto.Count)" -ForegroundColor Yellow
if ($sinProducto.Count -gt 0) { $sinProducto | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow } }
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " RECUERDA (solo la primera vez): agregar en productos.html"
Write-Host " e index.html, DEBAJO de la linea de productos-data.js:"
Write-Host '   <script defer src="js/imagenes-data.js"></script>'
Write-Host ""
