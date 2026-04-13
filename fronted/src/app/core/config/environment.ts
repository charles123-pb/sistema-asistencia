/**
 * Configuración de ambiente para la aplicación
 * Cambiar la URL según el entorno (desarrollo, producción, etc.)
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  apiTimeout: 30000, // 30 segundos
  
  // Endpoints específicos (opcional, para mayor control)
  endpoints: {
    auth: '/auth',
    users: '/users',
    courses: '/courses',
    students: '/students',
    sessions: '/sessions',
    attendance: '/attendance',
    justifications: '/justifications',
    admin: '/admin',
  }
};
