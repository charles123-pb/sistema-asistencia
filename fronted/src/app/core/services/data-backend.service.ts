import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Course, Session, Student, AttendanceValue, Justification } from '../models';
import { environment } from '../config/environment';

type CreateCoursePayload = Pick<Course, 'name' | 'code' | 'sec' | 'sem' | 'credits' | 'minatt' | 'color' | 'icon' | 'desc'>;

/**
 * Servicio para gestionar datos del backend
 * Reemplaza DataService para usar API en lugar de mock
 */
@Injectable({ providedIn: 'root' })
export class DataServiceBackend {
  private api = inject(ApiService);
  private endpoints = environment.endpoints;

  // ==================== CURSOS ====================

  /**
   * Obtener todos los cursos del usuario actual
   */
  getCourses(): Observable<Course[]> {
    return this.api.get<Course[]>(this.endpoints.courses);
  }

  /**
   * Obtener un curso específico por ID
   */
  getCourse(courseId: number): Observable<Course> {
    return this.api.get<Course>(`${this.endpoints.courses}/${courseId}`);
  }

  /**
   * Crear un nuevo curso
   */
  createCourse(course: CreateCoursePayload): Observable<Course> {
    return this.api.post<Course>(this.endpoints.courses, course);
  }

  /**
   * Actualizar un curso
   */
  updateCourse(courseId: number, course: Partial<Course>): Observable<Course> {
    return this.api.put<Course>(`${this.endpoints.courses}/${courseId}`, course);
  }

  /**
   * Eliminar un curso
   */
  deleteCourse(courseId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoints.courses}/${courseId}`);
  }

  // ==================== ESTUDIANTES ====================

  /**
   * Obtener estudiantes de un curso
   */
  getStudents(courseId: number): Observable<Student[]> {
    return this.api.get<Student[]>(`${this.endpoints.courses}/${courseId}${this.endpoints.students}`);
  }

  /**
   * Agregar un estudiante a un curso
   */
  addStudent(courseId: number, student: Omit<Student, 'id'>): Observable<Student> {
    return this.api.post<Student>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.students}`,
      student
    );
  }

  /**
   * Importar múltiples estudiantes a un curso (CSV, archivo, etc.)
   */
  importStudents(courseId: number, students: Omit<Student, 'id'>[]): Observable<Student[]> {
    return this.api.post<Student[]>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.students}/import`,
      { students }
    );
  }

  /**
   * Actualizar un estudiante
   */
  updateStudent(
    courseId: number,
    studentId: number,
    student: Partial<Pick<Student, 'name' | 'code' | 'sem' | 'email'>>
  ): Observable<Student> {
    return this.api.put<Student>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.students}/${studentId}`,
      student
    );
  }

  /**
   * Eliminar un estudiante
   */
  removeStudent(courseId: number, studentId: number): Observable<void> {
    return this.api.delete<void>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.students}/${studentId}`
    );
  }

  // ==================== SESIONES ====================

  /**
   * Obtener sesiones de un curso
   */
  getSessions(courseId: number): Observable<Session[]> {
    return this.api.get<Session[]>(`${this.endpoints.courses}/${courseId}${this.endpoints.sessions}`);
  }

  /**
   * Crear una nueva sesión
   */
  createSession(courseId: number, session: Omit<Session, 'id'>): Observable<Session> {
    return this.api.post<Session>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.sessions}`,
      session
    );
  }

  /**
   * Actualizar una sesión
   */
  updateSession(courseId: number, sessionId: number, session: Partial<Session>): Observable<Session> {
    return this.api.put<Session>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.sessions}/${sessionId}`,
      session
    );
  }

  /**
   * Eliminar una sesión
   */
  deleteSession(courseId: number, sessionId: number): Observable<void> {
    return this.api.delete<void>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.sessions}/${sessionId}`
    );
  }

  // ==================== ASISTENCIA ====================

  /**
   * Obtener la asistencia de un curso
   */
  getAttendance(courseId: number): Observable<Record<string, AttendanceValue>> {
    return this.api.get<Record<string, AttendanceValue>>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.attendance}`
    );
  }

  /**
   * Registrar asistencia de un estudiante en una sesión
   */
  recordAttendance(
    courseId: number,
    studentId: number,
    sessionId: number,
    value: AttendanceValue
  ): Observable<void> {
    return this.api.put<void>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.attendance}/${studentId}/${sessionId}`,
      { value }
    );
  }

  /**
   * Registrar asistencia en lote para una sesión
   */
  recordBatchAttendance(
    courseId: number,
    sessionId: number,
    attendance: Record<number, AttendanceValue>
  ): Observable<void> {
    return this.api.put<void>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.sessions}/${sessionId}${this.endpoints.attendance}`,
      { attendance }
    );
  }

  // ==================== JUSTIFICACIONES ====================

  /**
   * Obtener justificaciones de un curso
   */
  getJustifications(courseId: number): Observable<Record<string, Justification>> {
    return this.api.get<Record<string, Justification>>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.justifications}`
    );
  }

  /**
   * Agregar una justificación de inasistencia
   */
  addJustification(
    courseId: number,
    studentId: number,
    sessionId: number,
    justification: Justification
  ): Observable<void> {
    return this.api.post<void>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.justifications}`,
      { studentId, sessionId, ...justification }
    );
  }

  /**
   * Actualizar una justificación
   */
  updateJustification(
    courseId: number,
    studentId: number,
    sessionId: number,
    justification: Justification
  ): Observable<void> {
    return this.api.put<void>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.justifications}/${studentId}/${sessionId}`,
      justification
    );
  }

  /**
   * Eliminar una justificación
   */
  removeJustification(
    courseId: number,
    studentId: number,
    sessionId: number
  ): Observable<void> {
    return this.api.delete<void>(
      `${this.endpoints.courses}/${courseId}${this.endpoints.justifications}/${studentId}/${sessionId}`
    );
  }

  // ==================== ADMIN ====================

  /**
   * Obtener estadísticas para el panel de admin
   */
  getAdminStats(): Observable<any> {
    return this.api.get(`${this.endpoints.admin}/stats`);
  }

  /**
   * Obtener todos los usuarios (solo para admin)
   */
  getAllUsers(): Observable<any[]> {
    return this.api.get(`${this.endpoints.admin}/users`);
  }

  /**
   * Obtener todos los cursos (solo para admin)
   */
  getAllCourses(): Observable<Course[]> {
    return this.api.get<Course[]>(`${this.endpoints.admin}/courses`);
  }

  // ==================== TEACHERS (DOCENTES) ====================

  /**
   * Obtener todos los docentes
   */
  getTeachers(): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoints.admin}/teachers`);
  }

  /**
   * Crear un nuevo docente
   */
  createTeacher(data: { name: string; email?: string; pin: string; status?: string; role?: string }): Observable<any> {
    return this.api.post<any>(`${this.endpoints.admin}/teachers`, data);
  }

  /**
   * Actualizar un docente
   */
  updateTeacher(teacherId: number, data: Partial<any>): Observable<any> {
    return this.api.put<any>(`${this.endpoints.admin}/teachers/${teacherId}`, data);
  }

  /**
   * Eliminar un docente
   */
  deleteTeacher(teacherId: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoints.admin}/teachers/${teacherId}`);
  }
}
