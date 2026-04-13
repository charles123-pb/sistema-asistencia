Write-Host "=== DEMO MODE - UniAsistencia ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# 1. Login Admin
Write-Host "[1/8] Admin Login..." -ForegroundColor Yellow
$adminRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body '{"userId":1,"pin":"0000"}' -ContentType "application/json" -ErrorAction Stop
$adminToken = $adminRes.token
Write-Host "OK - Admin Token Ready" -ForegroundColor Green
Write-Host ""

# 2. Create Pedro
Write-Host "[2/8] Creating Teacher: Pedro..." -ForegroundColor Yellow
$pedroData = '{"name":"Dr. Pedro Mamani Quispe","email":"pedro@uni.edu.pe","pin":"1234"}'
$pedroRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/teachers" -Method Post -Headers @{Authorization="Bearer $adminToken"} -Body $pedroData -ContentType "application/json" -ErrorAction Stop
$pedroId = $pedroRes.id
Write-Host "OK - Pedro created (ID: $pedroId)" -ForegroundColor Green
Write-Host ""

# 3. Crear Docente 2: Rosa
Write-Host "[3/8] Creando Docente 2: Rosa Condori Huanca..." -ForegroundColor Yellow
$teacherRosa = @{
    name = "Dra. Rosa Condori Huanca"
    email = "rosa@uni.edu.pe"
    pin = "5678"
}
$rosaRes = Invoke-RestMethod -Uri "$baseUrl/api/admin/teachers" -Method Post `
    -Headers @{Authorization="Bearer $adminToken"} `
    -Body ($teacherRosa | ConvertTo-Json) `
    -ContentType "application/json"
$rosaId = $rosaRes.id
Write-Host "✓ Rosa creada (ID: $rosaId)`n" -ForegroundColor Green

# 4. Pedro login y crear curso
Write-Host "[4/8] Pedro crea Curso: Programación I..." -ForegroundColor Yellow
$pedroLogin = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post `
    -Body (@{userId=$pedroId; pin="1234"} | ConvertTo-Json) `
    -ContentType "application/json"
$pedroToken = $pedroLogin.token

$course1 = @{
    name = "Programación I"
    code = "CS-101"
    schedule = "Lun-Mie 10:00-12:00"
}
$course1Res = Invoke-RestMethod -Uri "$baseUrl/api/courses" -Method Post `
    -Headers @{Authorization="Bearer $pedroToken"} `
    -Body ($course1 | ConvertTo-Json) `
    -ContentType "application/json"
$course1Id = $course1Res.id
Write-Host "✓ Curso 'Programación I' creado (ID: $course1Id)`n" -ForegroundColor Green

# 5. Rosa login y crear curso
Write-Host "[5/8] Rosa crea Curso: Cálculo I..." -ForegroundColor Yellow
$rosaLogin = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post `
    -Body (@{userId=$rosaId; pin="5678"} | ConvertTo-Json) `
    -ContentType "application/json"
$rosaToken = $rosaLogin.token

$course2 = @{
    name = "Cálculo I"
    code = "MAT-101"
    schedule = "Lun-Mie 08:00-10:00"
}
$course2Res = Invoke-RestMethod -Uri "$baseUrl/api/courses" -Method Post `
    -Headers @{Authorization="Bearer $rosaToken"} `
    -Body ($course2 | ConvertTo-Json) `
    -ContentType "application/json"
$course2Id = $course2Res.id
Write-Host "✓ Curso 'Cálculo I' creado (ID: $course2Id)`n" -ForegroundColor Green

# 6. Agregar estudiantes a Curso Programación I
Write-Host "[6/8] Agregando 3 Estudiantes a Programación I..." -ForegroundColor Yellow
$students1 = @(
    @{name="Jorge López García"; code="2024010001"; email="jorge@uni.edu.pe"},
    @{name="María Rodríguez Pérez"; code="2024010002"; email="maria@uni.edu.pe"},
    @{name="Carlos Quispe Mamani"; code="2024010003"; email="carlos@uni.edu.pe"}
)

foreach ($student in $students1) {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/courses/$course1Id/students" -Method Post `
        -Headers @{Authorization="Bearer $pedroToken"} `
        -Body ($student | ConvertTo-Json) `
        -ContentType "application/json"
}
Write-Host "✓ 3 Estudiantes agregados a Programación I`n" -ForegroundColor Green

# 7. Agregar estudiantes a Curso Cálculo I
Write-Host "[7/8] Agregando 2 Estudiantes a Cálculo I..." -ForegroundColor Yellow
$students2 = @(
    @{name="Lucia Flores Collo"; code="2024020001"; email="lucia@uni.edu.pe"},
    @{name="Andrés Chambi Conde"; code="2024020002"; email="andres@uni.edu.pe"}
)

foreach ($student in $students2) {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/courses/$course2Id/students" -Method Post `
        -Headers @{Authorization="Bearer $rosaToken"} `
        -Body ($student | ConvertTo-Json) `
        -ContentType "application/json"
}
Write-Host "✓ 2 Estudiantes agregados a Cálculo I`n" -ForegroundColor Green

# 8. Crear sesiones
Write-Host "[8/8] Creando Sesiones..." -ForegroundColor Yellow
$today = Get-Date -Format "yyyy-MM-dd"

$session1 = @{
    date = $today
    start_time = "10:00"
    end_time = "11:30"
    topic = "Introducción a JavaScript"
}
$null = Invoke-RestMethod -Uri "$baseUrl/api/courses/$course1Id/sessions" -Method Post `
    -Headers @{Authorization="Bearer $pedroToken"} `
    -Body ($session1 | ConvertTo-Json) `
    -ContentType "application/json"

$session2 = @{
    date = $today
    start_time = "08:00"
    end_time = "09:30"
    topic = "Cálculo de Límites"
}
$null = Invoke-RestMethod -Uri "$baseUrl/api/courses/$course2Id/sessions" -Method Post `
    -Headers @{Authorization="Bearer $rosaToken"} `
    -Body ($session2 | ConvertTo-Json) `
    -ContentType "application/json"

Write-Host "✓ Sesiones creadas`n" -ForegroundColor Green

# Resumen
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           ✅ MODO DEMO CONFIGURADO                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "CREDENCIALES DE LOGIN:" -ForegroundColor Cyan
Write-Host "┌─ ADMINISTRADOR" -ForegroundColor Gray
Write-Host "│  ID: 1" -ForegroundColor Gray
Write-Host "│  PIN: 0000" -ForegroundColor Gray
Write-Host "└──────────────────────────────────────────────────────" -ForegroundColor Gray

Write-Host "`n┌─ DOCENTE 1 (Programación)" -ForegroundColor Cyan
Write-Host "│  Nombre: Dr. Pedro Mamani Quispe" -ForegroundColor Gray
Write-Host "│  ID: $pedroId" -ForegroundColor Gray
Write-Host "│  PIN: 1234" -ForegroundColor Gray
Write-Host "│  Cursos: Programación I (CS-101)" -ForegroundColor Gray
Write-Host "│  Estudiantes: 3" -ForegroundColor Gray
Write-Host "└──────────────────────────────────────────────────────" -ForegroundColor Gray

Write-Host "`n┌─ DOCENTE 2 (Matemáticas)" -ForegroundColor Cyan
Write-Host "│  Nombre: Dra. Rosa Condori Huanca" -ForegroundColor Gray
Write-Host "│  ID: $rosaId" -ForegroundColor Gray
Write-Host "│  PIN: 5678" -ForegroundColor Gray
Write-Host "│  Cursos: Cálculo I (MAT-101)" -ForegroundColor Gray
Write-Host "│  Estudiantes: 2" -ForegroundColor Gray
Write-Host "└──────────────────────────────────────────────────────" -ForegroundColor Gray

Write-Host "`n Access: http://localhost:4200/login`n" -ForegroundColor Yellow
