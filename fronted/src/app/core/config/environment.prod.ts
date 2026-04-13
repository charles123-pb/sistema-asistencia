/**
 * Producción: si el frontend y el API comparten el mismo dominio con /api detrás de un proxy,
 * deja `apiUrl: '/api'`. Si el API está en otro host, pon aquí la URL completa (ej. https://api.tudominio.com/api).
 */
export const environment = {
  production: true,
  apiUrl: '/api',
  apiTimeout: 30000,

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
