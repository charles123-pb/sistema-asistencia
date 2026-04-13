import { Injectable, signal, computed } from '@angular/core';
import { AttendanceValue, AV_COLORS, AV_TEXTS, Course, Teacher, AppUser, Student, Session, Justification, AppData } from '../models';

/**
 * Servicio de utilidades para la aplicación
 * - Formateo de datos
 * - Cálculos básicos
 * - Colores y estilos
 * 
 * NOTA: Para cambios persistentes, usar DataServiceBackend que consume la API
 * Este servicio solo proporciona funciones de UI y compatibilidad
 */
@Injectable({ providedIn: 'root' })
export class DataService {

  // Datos vacíos como placeholder
  private _data = signal<AppData>({ admin: { id: 0, name: '', email: '', pin: '', role: 'admin', status: 'active', courses: [] }, teachers: [] });
  readonly data = this._data.asReadonly();

  readonly adminStats = computed(() => ({
    active: this._data().teachers.filter(t => t.status === 'active').length,
    total: this._data().teachers.length
  }));

  // ─── Dummy Methods for Compatibility ──────────────────────────
  // Estos métodos NO hacen nada. Los componentes deben usar DataServiceBackend
  // Se mantienen por compatibilidad para no romper completamente los componentes

  createCourse(...args: any[]): void { }
  updateCourse(...args: any[]): void { }
  deleteCourse(...args: any[]): void { }
  createSession(...args: any[]): void { }
  updateSession(...args: any[]): void { }
  deleteSession(...args: any[]): void { }
  setAttendance(...args: any[]): void { }
  addStudent(...args: any[]): void { }
  updateStudent(...args: any[]): void { }
  deleteStudent(...args: any[]): void { }
  importStudents(...args: any[]): void { }
  saveJustification(...args: any[]): void { }
  addTeacher(...args: any[]): void { }
  updateTeacher(...args: any[]): void { }
  deleteTeacher(...args: any[]): void { }
  calcAvg(...args: any[]): number { return 0; }
  calcStuPctFor(...args: any[]): number { return 0; }
  buildAlerts(...args: any[]): any[] { return []; }
  isPinTaken(...args: any[]): boolean { return false; }

  // ─── Attendance Utilities ──────────────────────────────────────

  /**
   * Calcula el color de asistencia según el porcentaje
   */
  attColor(pct: number, min: number): string {
    if (pct >= min) return '#2F9E44'; // Verde
    if (pct >= min - 15) return '#E67700'; // Naranja
    return '#C92A2A'; // Rojo
  }

  /**
   * Obtiene colores de avatar para estudiantes
   */
  getAvatarColors(index: number): { bg: string; c: string } {
    return { bg: AV_COLORS[index % 7], c: AV_TEXTS[index % 7] };
  }

  /**
   * Extrae iniciales de un nombre
   */
  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(x => x[0]).join('');
  }

  // ─── Date Formatting ──────────────────────────────────────────

  /**
   * Formatea fecha de YYYY-MM-DD a formato legible
   * Ejemplo: "2025-04-13" → "13 abr 2025"
   */
  fmtDate(d: string | null | undefined): string {
    if (!d) return '—';
    try {
      const [y, m, day] = d.split('-');
      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const monthIndex = parseInt(m) - 1;
      if (monthIndex < 0 || monthIndex >= 12) return '—';
      return `${parseInt(day)} ${months[monthIndex]} ${y}`;
    } catch {
      return '—';
    }
  }

  /**
   * Formatea hora HH:MM a formato 12h
   * Ejemplo: "08:00" → "8:00 AM"
   */
  fmtTime(time: string | null | undefined): string {
    if (!time) return '—';
    try {
      const [h, m] = time.split(':').map(x => parseInt(x));
      const suffix = h >= 12 ? 'PM' : 'AM';
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
    } catch {
      return time;
    }
  }

  /**
   * Formatea rango de fechas
   * Ejemplo: "2025-04-01" → "01-04"
   */
  fmtDateShort(d: string | null | undefined): string {
    if (!d) return '—';
    try {
      const [_, m, day] = d.split('-');
      return `${day}-${m}`;
    } catch {
      return '—';
    }
  }

  // ─── Validation ───────────────────────────────────────────────

  /**
   * Valida si un email es válido
   */
  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Valida si un PIN tiene 4 dígitos
   */
  isValidPin(pin: string): boolean {
    return /^\d{4}$/.test(pin);
  }

  /**
   * Valida si un código de estudiante es válido
   */
  isValidStudentCode(code: string): boolean {
    return code.trim().length > 0;
  }

  // ─── Text Utilities ───────────────────────────────────────────

  /**
   * Convierte texto a mayúsculas (primera letra)
   */
  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Trunca texto a cierta longitud
   */
  truncate(str: string, len: number, suffix = '...'): string {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + suffix : str;
  }

  // ─── Status Helpers ────────────────────────────────────────────

  /**
   * Obtiene el texto de estado de asistencia
   */
  getAttendanceText(status: AttendanceValue | string): string {
    const map: Record<string, string> = {
      'p': 'Presente',
      'a': 'Ausente',
      't': 'Tardanza',
      'j': 'Justificado'
    };
    return map[status] || 'Desconocido';
  }

  /**
   * Obtiene el ícono de estado de asistencia
   */
  getAttendanceIcon(status: AttendanceValue | string): string {
    const map: Record<string, string> = {
      'p': 'check_circle',
      'a': 'cancel',
      't': 'schedule',
      'j': 'verified_user'
    };
    return map[status] || 'help';
  }

  // ─── Array Utilities ───────────────────────────────────────────

  /**
   * Ordena un array de objetos por una propiedad
   */
  sortBy<T extends Record<string, any>>(arr: T[], key: keyof T, desc = false): T[] {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return desc ? 1 : -1;
      if (aVal > bVal) return desc ? -1 : 1;
      return 0;
    });
  }

  /**
   * Agrupa un array de objetos por una propiedad
   */
  groupBy<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce((acc, item) => {
      const k = String(item[key]);
      acc[k] = [...(acc[k] || []), item];
      return acc;
    }, {} as Record<string, T[]>);
  }

  /**
   * Filtra un array eliminando duplicados por una propiedad
   */
  unique<T extends Record<string, any>>(arr: T[], key: keyof T): T[] {
    const seen = new Set<any>();
    return arr.filter(item => {
      const k = item[key];
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
}

