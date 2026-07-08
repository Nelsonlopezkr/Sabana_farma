# ==================================================================
#  Droguerias Economicas - migrar-imagenes-slug.ps1  v1.1
#  (v1.1: solo caracteres ASCII para compatibilidad con PowerShell 5.1)
#
#  PROBLEMA QUE RESUELVE:
#   93 productos tienen "imagen" apuntando a archivos con espacios,
#   tildes y simbolos (%). Eso funciona local pero ROMPE en GitHub
#   Pages (Linux). Este script migra todo a la convencion slug.
#
#  QUE HACE (en orden):
#   1. Crea respaldo: productos-data.backup.js
#   2. Renombra los archivos fisicos en img/productos/
#      "Fluoftal Fluorometolona 0,1% X 5ML.jpg"
#         pasa a "fluoftal-fluorometolona-0-1-x-5ml.jpg"
#   3. Corrige las rutas "imagen" dentro de productos-data.js
#      (solo cambia el TEXTO de la ruta, no toca la estructura)
#   4. Genera reporte: _reporte-migracion.txt
#
#  COMO USARLO:
#   powershell -ExecutionPolicy Bypass -File .\migrar-imagenes-slug.ps1
# ==================================================================

# --- CONFIGURACION (ruta de tu proyecto) --------------------------
$RutaRepo = "C:\Users\necso\OneDrive\Desktop\Desarrollo W\droguerias"
# ------------------------------------------------------------------

$RutaDatos   = Join-Path $RutaRepo "js\productos-data.js"
$CarpetaImg  = Join-Path $RutaRepo "img\productos"
$RutaBackup  = Join-Path $RutaRepo "js\productos-data.backup.js"
$RutaReporte = Join-Path $RutaRepo "_reporte-migracion.txt"

# --- Slug identico a slugProducto() de catalogo.js ---
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

# --- Validaciones ---
if (-not (Test-Path -LiteralPath $RutaDatos)) {
    Write-Host "ERROR: no se encontro $RutaDatos" -ForegroundColor Red; exit 1
}
if (-not (Test-Path -LiteralPath $CarpetaImg)) {
    Write-Host "ERROR: no se encontro $CarpetaImg" -ForegroundColor Red; exit 1
}

# --- 1. Respaldo ---
Copy-Item -LiteralPath $RutaDatos -Destination $RutaBackup -Force
Write-Host ""
Write-Host "[OK] Respaldo creado: productos-data.backup.js" -ForegroundColor Green

# --- 2. Leer datos y encontrar rutas de imagen ---
$raw = Get-Content -LiteralPath $RutaDatos -Raw -Encoding UTF8
$patron = '"imagen":\s*"img/productos/([^"]+)"'
$coincidencias = [regex]::Matches($raw, $patron)
Write-Host "[OK] Rutas de imagen encontradas en los datos: $($coincidencias.Count)" -ForegroundColor Green

$renombrados  = New-Object System.Collections.Generic.List[string]
$sinArchivo   = New-Object System.Collections.Generic.List[string]
$colisiones   = New-Object System.Collections.Generic.List[string]
$mapaRutas    = @{}   # nombre original -> nombre slug

# --- 3. Renombrar archivos fisicos ---
foreach ($m in $coincidencias) {
    $archivoOriginal = $m.Groups[1].Value
    if ($mapaRutas.ContainsKey($archivoOriginal)) { continue }

    $ext  = [System.IO.Path]::GetExtension($archivoOriginal)
    $base = [System.IO.Path]::GetFileNameWithoutExtension($archivoOriginal)
    $slug = Get-Slug $base
    $nuevoNombre = "$slug$ext"

    $rutaVieja = Join-Path $CarpetaImg $archivoOriginal
    $rutaNueva = Join-Path $CarpetaImg $nuevoNombre

    if ($archivoOriginal -eq $nuevoNombre) {
        $mapaRutas[$archivoOriginal] = $nuevoNombre
        continue
    }

    if (Test-Path -LiteralPath $rutaNueva) {
        $colisiones.Add("$archivoOriginal -> $nuevoNombre (destino ya existia; se usa el existente)")
        $mapaRutas[$archivoOriginal] = $nuevoNombre
        continue
    }

    if (Test-Path -LiteralPath $rutaVieja) {
        Rename-Item -LiteralPath $rutaVieja -NewName $nuevoNombre
        $renombrados.Add("$archivoOriginal -> $nuevoNombre")
        $mapaRutas[$archivoOriginal] = $nuevoNombre
    } else {
        $sinArchivo.Add("$archivoOriginal (referenciado en datos, archivo no encontrado)")
        $mapaRutas[$archivoOriginal] = $nuevoNombre
    }
}

# --- 4. Corregir rutas dentro de productos-data.js ---
$evaluador = {
    param($match)
    $original = $match.Groups[1].Value
    $nuevo = $mapaRutas[$original]
    if (-not $nuevo) { return $match.Value }
    return '"imagen": "img/productos/' + $nuevo + '"'
}
$rawNuevo = [regex]::Replace($raw, $patron, $evaluador)

# Guardar en UTF-8 sin BOM (mismo formato del archivo original)
[System.IO.File]::WriteAllText($RutaDatos, $rawNuevo, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "[OK] productos-data.js actualizado con rutas slug" -ForegroundColor Green

# --- 5. Reporte ---
$lineas = @()
$lineas += "REPORTE DE MIGRACION A SLUG - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
$lineas += "======================================================="
$lineas += ""
$lineas += "ARCHIVOS RENOMBRADOS ($($renombrados.Count)):"
$lineas += $renombrados
$lineas += ""
if ($colisiones.Count -gt 0) {
    $lineas += "COLISIONES ($($colisiones.Count)):"
    $lineas += $colisiones
    $lineas += ""
}
$lineas += "REFERENCIAS SIN ARCHIVO FISICO ($($sinArchivo.Count)) - verifica estas imagenes:"
$lineas += $sinArchivo
$lineas += ""
$lineas += "Respaldo de datos: js\productos-data.backup.js"
$lineas += "Si algo salio mal: copia el backup sobre productos-data.js y"
$lineas += "restaura los nombres de archivo desde Git (git checkout -- img/productos)"
$lineas | Set-Content -LiteralPath $RutaReporte -Encoding UTF8

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Archivos renombrados:  $($renombrados.Count)" -ForegroundColor Green
Write-Host " Colisiones:            $($colisiones.Count)" -ForegroundColor Yellow
Write-Host " Referencias rotas:     $($sinArchivo.Count)" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Reporte: _reporte-migracion.txt"
Write-Host ""
Write-Host " Siguiente paso: abre gestor-imagenes.html -> Verificar imagenes"
Write-Host " Luego: git add -A / git commit / git push"
Write-Host ""
