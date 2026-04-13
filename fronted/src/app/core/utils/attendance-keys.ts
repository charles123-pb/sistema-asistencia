import { AttendanceValue, Course } from '../models';

/** Misma convención que el backend: `studentId_sessionId` */
export function attKey(studentId: number, sessionId: number): string {
  return `${studentId}_${sessionId}`;
}

/** Cuenta sesiones “válidas” para el mínimo: presente, tardanza o justificado */
export function isPresentLike(v: AttendanceValue | string | undefined): boolean {
  return v === 'p' || v === 't' || v === 'j';
}

export function calcStuPctFor(course: Course, studentId: number): number {
  const sessions = course.sessions ?? [];
  if (sessions.length === 0) return 100;
  const att = course.att ?? {};
  let ok = 0;
  for (const s of sessions) {
    const v = att[attKey(studentId, s.id)] as AttendanceValue | undefined;
    const effective = v ?? 'p';
    if (isPresentLike(effective)) ok++;
  }
  return Math.round((ok / sessions.length) * 100);
}

export function calcAvg(course: Course): number {
  const students = course.students ?? [];
  if (students.length === 0) return 0;
  let sum = 0;
  for (const st of students) {
    sum += calcStuPctFor(course, st.id);
  }
  return Math.round(sum / students.length);
}
