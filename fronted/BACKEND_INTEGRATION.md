# Guía de Integración Backend - Frontend UniAsistencia

## 📋 Resumen de cambios

Se han preparado los siguientes componentes para conectar con un backend de Node.js/Express:

### 1. **Archivos de Configuración**
- `src/app/core/config/environment.ts` - Configuración de URLs de API

### 2. **Servicios HTTP**
- `src/app/core/services/api.service.ts` - Servicio centralizado para todas las llamadas HTTP
- `src/app/core/services/auth-backend.service.ts` - Autenticación con backend
- `src/app/core/services/data-backend.service.ts` - Gestión de cursos, estudiantes, asistencia

### 3. **Interceptores**
- `src/app/core/interceptors/api.interceptor.ts` - Manejo de errores, timeout y autenticación

### 4. **Configuración**
- `src/app/app.config.ts` - Actualizado con HttpClient e interceptor

---

## 🔧 Configuración Inicial

### Paso 1: Actualizar la URL del Backend

En `src/app/core/config/environment.ts`, cambia la URL según tu entorno:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Cambiar según tu backend
  apiTimeout: 30000,
  endpoints: {
    auth: '/auth',
    courses: '/courses',
    // ... más endpoints
  }
};
```

### Paso 2: Usar los Servicios en Componentes

#### Autenticación (Login)

```typescript
import { AuthServiceBackend } from '../core/services/auth-backend.service';

export class LoginComponent {
  constructor(private auth: AuthServiceBackend) {}

  login(userId: number, pin: string) {
    this.auth.login(userId, pin).subscribe({
      next: (response) => {
        console.log('Login exitoso', response.user);
      },
      error: (error) => {
        console.error('Error en login', error);
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
```

#### Obtener Datos (Cursos, Estudiantes, etc.)

```typescript
import { DataServiceBackend } from '../core/services/data-backend.service';

export class MyComponent {
  courses$ = this.data.getCourses();
  students$ = this.data.getStudents(courseId);
  sessions$ = this.data.getSessions(courseId);

  constructor(private data: DataServiceBackend) {}

  // En el template usar async pipe:
  // @for (course of courses$ | async)
}
```

#### Registrar Asistencia

```typescript
recordAttendance(courseId: number, studentId: number, sessionId: number) {
  this.data.recordAttendance(courseId, studentId, sessionId, 'p')
    .subscribe({
      next: () => console.log('Asistencia registrada'),
      error: (error) => console.error('Error:', error)
    });
}
```

---

## 📡 Endpoints Esperados del Backend

El backend debe implementar los siguientes endpoints:

### Autenticación

```
POST   /api/auth/login              - Login con userId y pin
GET    /api/auth/me                 - Obtener usuario actual
POST   /api/auth/logout             - Logout
```

### Cursos

```
GET    /api/courses                 - Obtener todos los cursos
GET    /api/courses/:id             - Obtener un curso
POST   /api/courses                 - Crear curso
PUT    /api/courses/:id             - Actualizar curso
DELETE /api/courses/:id             - Eliminar curso
```

### Estudiantes

```
GET    /api/courses/:id/students                    - Obtener estudiantes
POST   /api/courses/:id/students                    - Agregar estudiante
POST   /api/courses/:id/students/import             - Importar estudiantes (CSV/lote)
DELETE /api/courses/:id/students/:studentId         - Eliminar estudiante
```

### Sesiones

```
GET    /api/courses/:id/sessions                    - Obtener sesiones
POST   /api/courses/:id/sessions                    - Crear sesión
PUT    /api/courses/:id/sessions/:sessionId         - Actualizar sesión
DELETE /api/courses/:id/sessions/:sessionId         - Eliminar sesión
```

### Asistencia

```
GET    /api/courses/:id/attendance                                      - Obtener asistencia
PUT    /api/courses/:id/attendance/:studentId/:sessionId               - Registrar asistencia
PUT    /api/courses/:id/sessions/:sessionId/attendance                 - Registrar en lote
```

### Justificaciones

```
GET    /api/courses/:id/justifications                                 - Obtener justificaciones
POST   /api/courses/:id/justifications                                 - Agregar justificación
PUT    /api/courses/:id/justifications/:studentId/:sessionId           - Actualizar justificación
DELETE /api/courses/:id/justifications/:studentId/:sessionId           - Eliminar justificación
```

### Admin

```
GET    /api/admin/stats             - Estadísticas
GET    /api/admin/users             - Todos los usuarios
GET    /api/admin/courses           - Todos los cursos
```

---

## 🔐 Autenticación con Token JWT

El interceptor espera que el backend devuelva un token JWT en la respuesta de login:

### Respuesta esperada de login:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Pedro Mamani",
    "email": "pedro@uni.edu.pe",
    "role": "teacher",
    "status": "active"
  }
}
```

### El token se guarda automáticamente en:
- `localStorage` bajo la clave `'auth_token'`
- Signal `auth.token`

### Para usar el token en solicitudes adicionales:

Si necesitas agregar el token a los headers manualmente, puedes:

```typescript
const token = this.auth.getToken();
// Usar en HTTP headers si es necesario
```

---

## 🚨 Manejo de Errores

El interceptor captura automáticamente errores HTTP y genera mensajes legibles:

```typescript
this.data.getCourses().subscribe({
  next: (courses) => { /* éxito */ },
  error: (error) => {
    // error.message - Mensaje legible
    // error.status - Código HTTP (400, 401, 500, etc.)
    // error.error - Respuesta del servidor
    console.error(error.message);
  }
});
```

### Códigos de estado manejados:

- **400**: Solicitud inválida
- **401**: No autorizado (sesión expirada)
- **403**: Acceso denegado
- **404**: Recurso no encontrado
- **408**: Timeout (30 segundos por defecto)
- **409**: Conflicto en datos
- **500**: Error del servidor
- **503**: Servicio no disponible

---

## 📝 Cambios en Componentes Existentes

### Login Component

Actualizar para usar `AuthServiceBackend`:

```typescript
// Cambiar de:
import { AuthService } from '../../../core/services/auth.service';
// A:
import { AuthServiceBackend } from '../../../core/services/auth-backend.service';
```

### Componentes que muestran datos

Actualizar para usar `DataServiceBackend`:

```typescript
// Cambiar de:
import { DataService } from '../../../core/services/data.service';
// A:
import { DataServiceBackend } from '../../../core/services/data-backend.service';

// Usar async pipe en templates:
@for (course of courses$ | async; track course.id) {
  <!-- contenido -->
}
```

---

## 🛠️ Próximos Pasos Recomendados

1. ✅ **Implementar backend** con los endpoints descritos
2. ✅ **Actualizar componentes** para usar `AuthServiceBackend` y `DataServiceBackend`
3. ✅ **Probar conexión** con Postman o Thunder Client
4. ✅ **Agregar guards** en rutas para validar autenticación
5. ✅ **Validar respuestas** del backend con el esquema de interfaces TypeScript
6. ✅ **Manejar errores** en UI con notificaciones al usuario

---

## 📚 Recursos Útiles

- [Documentación Angular HttpClient](https://angular.io/guide/http)
- [Interceptores HTTP en Angular](https://angular.io/guide/http#intercepting-requests-and-responses)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

## ⚠️ Notas Importantes

- Los servicios como `DataService` y `AuthService` siguen existiendo (mock local)
- Los nuevos servicios `DataServiceBackend` y `AuthServiceBackend` son para el backend
- El timeout por defecto es **30 segundos**, ajustable en `environment.ts`
- Asegúrate que el backend tenga CORS habilitado
- Los tokens se guardan en localStorage (considera usar seguridad adicional en producción)

---

¡Listo para conectar con backend! 🚀
