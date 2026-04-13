import { Component, computed, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Course, Teacher, COLORS, ICONS } from '../../../core/models';
import { SessionsTabComponent } from '../../sessions/attendance/sessions-tab.component';
import { StudentsTabComponent } from '../../students/list/students-tab.component';
import { HistoryTabComponent } from '../../sessions/attendance/history-tab.component';
import { CourseSettingsComponent } from '../settings/course-settings.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    MatTabsModule, MatIconModule, MatButtonModule,
    SessionsTabComponent, StudentsTabComponent, HistoryTabComponent, CourseSettingsComponent
  ],
  template: `
    @if (course()) {
      <div class="fade-in">

        <!-- Course Banner -->
        <div class="bg-[var(--surface)] border-b border-[var(--border)] px-7 py-5 shadow-sm">

          <!-- Breadcrumb -->
          <div class="flex items-center gap-1.5 text-xs text-[var(--text3)] mb-4">
            <span class="text-[var(--accent)] font-medium cursor-pointer hover:underline"
                  (click)="router.navigate(['/courses'])">Inicio</span>
            <mat-icon class="!text-xs">chevron_right</mat-icon>
            <span>{{ course()!.name }}</span>
          </div>

          <div class="flex items-start gap-4 flex-wrap">

            <!-- Icon -->
            <div class="w-[50px] h-[50px] rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                 [style.background]="color().bg" [style.color]="color().ic">
              {{ icon() }}
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold tracking-tight">{{ course()!.name }}</h2>
              <p class="text-sm text-[var(--text2)] mt-0.5">
                {{ course()!.code }} · Sección {{ course()!.sec }} · {{ course()!.sem }} · {{ course()!.credits }} créd.
              </p>

<!-- Attendance bar -->
              <div class="flex items-center gap-2 mt-3 max-w-xs">
                <div class="flex-1 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                  <div class="h-full rounded-full transition-all"
                       [style.width.%]="avg()" [style.background]="attColor()"></div>
                </div>
                <span class="text-sm font-bold font-mono" [style.color]="attColor()">{{ avg() }}%</span>
                <span class="text-xs text-[var(--text3)]">asist. · mín. {{ course()!.minatt }}%</span>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex gap-4 flex-shrink-0">
              <div class="text-center">
                <div class="text-xl font-bold">{{ course()!.students.length }}</div>
                <div class="text-xs text-[var(--text3)]">Estudiantes</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold">{{ course()!.sessions.length }}</div>
                <div class="text-xs text-[var(--text3)]">Grupos</div>
              </div>
            </div>

          </div>
        </div>

        <!-- Tabs -->
        <mat-tab-group [(selectedIndex)]="selectedTab"
                       class="course-tabs"
                       animationDuration="150ms">
          <mat-tab label="Sesiones">
            <app-sessions-tab [course]="course()!" />
          </mat-tab>
          <mat-tab label="Estudiantes">
            <app-students-tab [course]="course()!" />
          </mat-tab>
          <mat-tab label="Historial">
            <app-history-tab [course]="course()!" />
          </mat-tab>
          <mat-tab label="Configuración">
            <app-course-settings [course]="course()!" />
          </mat-tab>
        </mat-tab-group>

      </div>
    } @else {
      <div class="p-7 text-[var(--text3)]">Curso no encontrado</div>
    }
  `,
  styles: [`
    ::ng-deep .course-tabs .mat-mdc-tab-header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0 28px;
    }
    ::ng-deep .course-tabs .mat-mdc-tab-body-wrapper {
      background: var(--bg);
    }
  `]
})
export class CourseDetailComponent implements OnInit {

  selectedTab = signal(0);

  readonly course = computed<Course | undefined>(() => {
    const u = this.auth.currentUser() as Teacher;
    if (!u) return undefined;
    return u.courses.find(c => c.id === this.courseId);
  });

  private courseId = 0;

  constructor(
    readonly router: Router,
    private route: ActivatedRoute,
    readonly auth: AuthService,
    readonly data: DataService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab === 'settings') this.selectedTab.set(3);
  }

  color()  { const c = this.course(); return c ? (COLORS[c.color] ?? COLORS[0]) : COLORS[0]; }
  icon()   { const c = this.course(); return c ? (ICONS[c.icon] ?? '📚') : '📚'; }
  avg()    { const c = this.course(); return c ? this.data.calcAvg(c) : 0; }

  attColor() { const c = this.course(); return c ? this.data.attColor(this.avg(), c.minatt) : '#2F9E44'; }
}
