# Script para inicializar datos de prueba
Write-Host "🔧 Inicializando datos del sistema..." -ForegroundColor Cyan

# 1. LOGIN ADMIN
Write-Host "`n[1] Logineo Admin..." -ForegroundColor Yellow
$adminRes = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method Post -Body (@{userId=1;pin='0000'}|ConvertTo-Json) -ContentType 'application/json'
$adminToken = $adminRes.token
Write-Host "✓ Admin: $($adminRes.user.name)" -ForegroundColor Green

# 2. CREATE TEACHERS
Write-Host "`n[2] Creando Teachers..." -ForegroundColor Yellow
$teachersData = @(
  @{name='Dr. Pedro Mamani Quispe'; email='pedro@uni.edu.pe'; pin='1234'},
  @{name='Dra. Rosa Condori Huanca'; email='rosa@uni.edu.pe'; pin='5678'}
)

$teachers = @()
foreach ($data in $teachersData) {
  $body = @{name=$data.name; email=$data.email; pin=$data.pin} | ConvertTo-Json
  $res = Invoke-RestMethod -Uri http://localhost:3000/api/admin/teachers -Method Post `
    -Headers @{Authorization="Bearer $adminToken"} -Body $body -ContentType 'application/json'
  $teachers += $res
  Write-Host "✓ $($res.name) (id=$($res.id))" -ForegroundColor Green
}

$pedro = $teachers[0]
$rosa = $teachers[1]

# 3. LOGIN TEACHERS Y CREAR CURSOS
Write-Host "`n[3] Creando Cursos..." -ForegroundColor Yellow

# Pedro Login
$pedroRes = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method Post `
  -Body (@{userId=$pedro.id;pin='1234'}|ConvertTo-Json) -ContentType 'application/json'
$pedroToken = $pedroRes.token

# Pedro's Courses
$course1 = Invoke-RestMethod -Uri http://localhost:3000/api/courses -Method Post `
  -Headers @{Authorization="Bearer $pedroToken"} `
  -Body (@{name='Programación I'; code='CS-101'; schedule='Lun-Mie 10:00-12:00'}|ConvertTo-Json) `
  -ContentType 'application/json'
Write-Host "✓ $($course1.name) (id=$($course1.id))" -ForegroundColor Green

$course2 = Invoke-RestMethod -Uri http://localhost:3000/api/courses -Method Post `
  -Headers @{Authorization="Bearer $pedroToken"} `
  -Body (@{name='Algoritmos'; code='CS-102'; schedule='Mar-Jue 14:00-16:00'}|ConvertTo-Json) `
  -ContentType 'application/json'
Write-Host "✓ $($course2.name) (id=$($course2.id))" -ForegroundColor Green

# Rosa Login
$rosaRes = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method Post `
  -Body (@{userId=$rosa.id;pin='5678'}|ConvertTo-Json) -ContentType 'application/json'
$rosaToken = $rosaRes.token

# Rosa's Courses
$course3 = Invoke-RestMethod -Uri http://localhost:3000/api/courses -Method Post `
  -Headers @{Authorization="Bearer $rosaToken"} `
  -Body (@{name='Cálculo I'; code='MAT-101'; schedule='Lun-Mie 08:00-10:00'}|ConvertTo-Json) `
  -ContentType 'application/json'
Write-Host "✓ $($course3.name) (id=$($course3.id))" -ForegroundColor Green

# 4. AGREGAR ESTUDIANTES
Write-Host "`n[4] Agregando Estudiantes..." -ForegroundColor Yellow

# Estudiantes de Pedro (Programación I)
$students1 = @(
  @{name='Jorge López García'; code='2024010001'; email='jorge.lopez@uni.edu.pe'},
  @{name='María Rodríguez Pérez'; code='2024010002'; email='maria.rodriguez@uni.edu.pe'},
  @{name='Carlos Martínez Silva'; code='2024010003'; email='carlos.martinez@uni.edu.pe'},
  @{name='Laura Fernández Morales'; code='2024010004'; email='laura.fernandez@uni.edu.pe'},
  @{name='Juan Francisco Ramírez'; code='2024010005'; email='juan.ramirez@uni.edu.pe'}
)

foreach ($s in $students1) {
  Invoke-RestMethod -Uri "http://localhost:3000/api/courses/$($course1.id)/students" -Method Post `
    -Headers @{Authorization="Bearer $pedroToken"} `
    -Body (@{name=$s.name; code=$s.code; email=$s.email}|ConvertTo-Json) `
    -ContentType 'application/json' | Out-Null
  Write-Host "  ✓ $($s.name) → $($course1.name)" -ForegroundColor Green
}

# Estudiantes de Rosa (Cálculo I)
$students2 = @(
  @{name='Andrea Sánchez López'; code='2024020001'; email='andrea.sanchez@uni.edu.pe'},
  @{name='Diego Moreno García'; code='2024020002'; email='diego.moreno@uni.edu.pe'},
  @{name='Elena Vargas Romero'; code='2024020003'; email='elena.vargas@uni.edu.pe'},
  @{name='Sergio Castillo Mendoza'; code='2024020004'; email='sergio.castillo@uni.edu.pe'}
)

foreach ($s in $students2) {
  Invoke-RestMethod -Uri "http://localhost:3000/api/courses/$($course3.id)/students" -Method Post `
    -Headers @{Authorization="Bearer $rosaToken"} `
    -Body (@{name=$s.name; code=$s.code; email=$s.email}|ConvertTo-Json) `
    -ContentType 'application/json' | Out-Null
  Write-Host "  ✓ $($s.name) → $($course3.name)" -ForegroundColor Green
}

# 5. CREAR SESIONES
Write-Host "`n[5] Creando Sesiones..." -ForegroundColor Yellow

$today = Get-Date -Format "yyyy-MM-dd"
$tomorrow = (Get-Date).AddDays(1) -Format "yyyy-MM-dd"

# Sesión de Pedro
$session1 = Invoke-RestMethod -Uri "http://localhost:3000/api/courses/$($course1.id)/sessions" -Method Post `
  -Headers @{Authorization="Bearer $pedroToken"} `
  -Body (@{date=$today; start_time='10:00'; end_time='11:30'; topic='Introducción a JavaScript'}|ConvertTo-Json) `
  -ContentType 'application/json'
Write-Host "✓ $($session1.topic) ($today)" -ForegroundColor Green

# Sesión de Rosa
$session2 = Invoke-RestMethod -Uri "http://localhost:3000/api/courses/$($course3.id)/sessions" -Method Post `
  -Headers @{Authorization="Bearer $rosaToken"} `
  -Body (@{date=$today; start_time='08:00'; end_time='09:30'; topic='Límites y Continuidad'}|ConvertTo-Json) `
  -ContentType 'application/json'
Write-Host "✓ $($session2.topic) ($today)" -ForegroundColor Green

Write-Host "`n✅ SISTEMA INICIALIZADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "`n📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "  Admin: id=1, PIN=0000"  
Write-Host "  Pedro: id=$($pedro.id), PIN=1234"
Write-Host "  Rosa:  id=$($rosa.id), PIN=5678"
Write-Host "`n"
