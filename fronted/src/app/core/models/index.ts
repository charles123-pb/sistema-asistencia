export interface Student {
  id: number;
  name: string;
  code: string;
  sem: string;
  email?: string;
}

export interface Session {
  id: number;
  name: string;
  date: string;
  time: string;
  type: string;
  comp: 't' | 'p';
}

export type AttendanceValue = 'p' | 'a' | 't' | 'j';

export interface Justification {
  reason: string;
  obs?: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  sec: string;
  sem: string;
  credits: number;
  minatt: number;
  color: number;
  icon: number;
  desc?: string;
  students: Student[];
  sessions: Session[];
  att: Record<string, AttendanceValue>;
  justifications: Record<string, Justification>;
}

export interface Teacher {
  id: number;
  name: string;
  email?: string;
  dept?: string;
  pin: string;
  pinDisplay?: string;
  status: 'active' | 'inactive';
  role: 'teacher';
  courses: Course[];
}

export interface Admin {
  id: 0;
  name: string;
  email?: string;
  dept?: string;
  pin: string;
  pinDisplay?: string;
  status: 'active';
  role: 'admin';
  courses: Course[];
}

export type AppUser = Teacher | Admin;

export interface AppData {
  admin: Admin;
  teachers: Teacher[];
}

export const COLORS: { s: string; bg: string; ic: string }[] = [
  { s: '#3B5BDB', bg: '#EEF2FF', ic: '#3B5BDB' },
  { s: '#0099CF', bg: '#E3F8FF', ic: '#0099CF' },
  { s: '#2F9E44', bg: '#EBFBEE', ic: '#2F9E44' },
  { s: '#E67700', bg: '#FFF4E0', ic: '#E67700' },
  { s: '#C92A2A', bg: '#FFF0F0', ic: '#C92A2A' },
  { s: '#862E9C', bg: '#F8F0FC', ic: '#862E9C' },
  { s: '#1098AD', bg: '#E3FAFC', ic: '#1098AD' },
];

export const ICONS = ['📚', '🔬', '💻', '📐', '🧮', '📊', '🎨', '🏛️', '⚗️', '🌍'];

export const AV_COLORS = ['#E8F4FD','#FEF9C3','#F0FDF4','#FEF2F2','#F5F3FF','#FFF7ED','#F0F9FF'];
export const AV_TEXTS  = ['#1E40AF','#854D0E','#166534','#991B1B','#6D28D9','#9A3412','#0C4A6E'];
