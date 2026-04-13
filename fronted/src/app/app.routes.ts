import { Routes } from '@angular/router';
import { authGuard, adminGuard, teacherGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'courses',
    canActivate: [authGuard, teacherGuard],
    loadComponent: () => import('./features/courses/list/courses-list.component').then(m => m.CoursesListComponent)
  },
  {
    path: 'courses/new',
    canActivate: [authGuard, teacherGuard],
    loadComponent: () => import('./features/courses/new-course/new-course.component').then(m => m.NewCourseComponent)
  },
  {
    path: 'courses/:id',
    canActivate: [authGuard, teacherGuard],
    loadComponent: () => import('./features/courses/detail/course-detail.component').then(m => m.CourseDetailComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/panel/admin-panel.component').then(m => m.AdminPanelComponent)
  },
  { path: '**', redirectTo: 'login' }
];
