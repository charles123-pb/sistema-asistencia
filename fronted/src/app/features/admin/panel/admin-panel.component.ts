import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DataServiceBackend } from '../../../core/services/data-backend.service';
import { DataService } from '../../../core/services/data.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, FormsModule, MatInputModule, MatSelectModule, MatTooltipModule],
  template: `
    <div class="p-7 pb-10 fade-in">

      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">Panel de Administrador</h1>
          <p class="text-sm text-[var(--text2)] mt-1">Gestión centralizada de docentes del sistema</p>
        </div>
        <button mat-flat-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Nuevo docente
        </button>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-[var(--surface)] border border-[var(--border)] rounded-app p-4 flex items-center gap-3 shadow-app">
          <div class="w-10 h-10 rounded-xl bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center">
            <mat-icon>person</mat-icon>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ stats().active }}</div>
            <div class="text-xs text-[var(--text3)]">Docentes activos</div>
          </div>
        </div>
        <div class="bg-[var(--surface)] border border-[var(--border)] rounded-app p-4 flex items-center gap-3 shadow-app">
          <div class="w-10 h-10 rounded-xl bg-[var(--green-bg)] text-[var(--green)] flex items-center justify-center">
            <mat-icon>badge</mat-icon>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ stats().total }}</div>
            <div class="text-xs text-[var(--text3)]">Total docentes</div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="bg-[var(--surface)] border border-[var(--border)] rounded-app shadow-app overflow-hidden">

        <!-- Add/Edit form (collapsible) -->
        @if (showForm()) {
          <div class="border-b border-[var(--border)] bg-[var(--surface2)] p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="text-sm font-bold">{{ editingId() ? 'Editar docente' : 'Agregar nuevo docente' }}</div>
              <button mat-icon-button class="!w-7 !h-7" (click)="cancelForm()">
                <mat-icon class="!text-sm">close</mat-icon>
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <mat-form-field appearance="outline" class="!w-full">
                <mat-label>Nombres *</mat-label>
                <input matInput [(ngModel)]="tForm.first" placeholder="Juan">
              </mat-form-field>
              <mat-form-field appearance="outline" class="!w-full">
                <mat-label>Apellidos *</mat-label>
                <input matInput [(ngModel)]="tForm.last" placeholder="Pérez García">
              </mat-form-field>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <mat-form-field appearance="outline" class="!w-full">
                <mat-label>Correo</mat-label>
                <input matInput type="email" [(ngModel)]="tForm.email" placeholder="docente@uni.edu.pe">
              </mat-form-field>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <mat-form-field appearance="outline" class="!w-full">
                <mat-label>PIN (4 dígitos) *</mat-label>
                <input matInput [(ngModel)]="tForm.pin" maxlength="4" placeholder="1234"
                       class="font-mono tracking-widest text-lg">
              </mat-form-field>
              <mat-form-field appearance="outline" class="!w-full">
                <mat-label>Estado</mat-label>
                <mat-select [(ngModel)]="tForm.status">
                  <mat-option value="active">Activo</mat-option>
                  <mat-option value="inactive">Inactivo</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="flex gap-2 justify-end">
              <button mat-button (click)="cancelForm()">Cancelar</button>
              <button mat-flat-button color="accent" (click)="saveTeacher()">
                {{ editingId() ? 'Guardar cambios' : 'Agregar docente' }}
              </button>
            </div>
          </div>
        }

        <!-- Teachers list -->
        @if (teachers().length === 0) {
          <div class="empty-state py-12">
            <mat-icon class="text-4xl opacity-50">person_off</mat-icon>
            <p class="mt-2 font-medium">Sin docentes registrados</p>
            <small class="text-[var(--text3)]">Comienza agregando el primer docente</small>
          </div>
        } @else {
          <div class="divide-y divide-[var(--border)]">
            @for (t of teachers(); track t.id; let i = $index) {
              <div class="p-4 hover:bg-[var(--surface2)] transition-colors flex items-center justify-between">
                <div class="flex items-center gap-3 flex-1">
                  <!-- Avatar -->
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                              shadow-sm"
                       [style.background]="avColor(i).bg" [style.color]="avColor(i).c">
                    {{ initials(t.name) }}
                  </div>

                  <!-- Info -->
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold">{{ t.name }}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full"
                            [class.bg-green-100]="t.status === 'active'"
                            [class.text-green-700]="t.status === 'active'"
                            [class.bg-gray-100]="t.status !== 'active'"
                            [class.text-gray-700]="t.status !== 'active'">
                        {{ t.status === 'active' ? 'Activo' : 'Inactivo' }}
                      </span>
                    </div>
                    <div class="text-xs text-[var(--text3)] mt-0.5">
                      <span>{{ t.email || 'Sin email' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-1 ml-4">
                  <button mat-icon-button class="!w-9 !h-9 text-[var(--text2)]" [matTooltip]="'PIN: ' + t.pin"
                          (click)="editTeacher(t)">
                    <mat-icon class="!text-lg">edit</mat-icon>
                  </button>
                  <button mat-icon-button class="!w-9 !h-9 text-[var(--amber)]" matTooltip="Cambiar PIN"
                          (click)="resetPin(t)">
                    <mat-icon class="!text-lg">vpn_key</mat-icon>
                  </button>
                  <button mat-icon-button class="!w-9 !h-9 text-[var(--red)]" matTooltip="Eliminar"
                          (click)="deleteTeacher(t)">
                    <mat-icon class="!text-lg">delete_outline</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: var(--bg);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: var(--text2);
    }

    .empty-state mat-icon {
      color: var(--text3);
    }

    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  private dataBackend = inject(DataServiceBackend);
  private data = inject(DataService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  private teachersSignal = signal<any[]>([]);
  readonly teachers = this.teachersSignal.asReadonly();

  readonly stats = computed(() => {
    const allTeachers = this.teachers();
    return {
      active: allTeachers.filter((t: any) => t.status === 'active').length,
      total: allTeachers.length
    };
  });

  showForm = signal(false);
  editingId = signal<number | null>(null);
  tForm = { first: '', last: '', email: '', pin: '', status: 'active' as 'active' | 'inactive' };

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.dataBackend.getTeachers().subscribe({
      next: (teachers) => {
        this.teachersSignal.set(teachers);
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
        this.snack.open('Error cargando docentes', '', { duration: 2500 });
      }
    });
  }

  avColor(i: number) { return this.data.getAvatarColors(i); }
  initials(n: string) { return this.data.getInitials(n); }

  openForm(): void {
    this.tForm = { first: '', last: '', email: '', pin: '', status: 'active' };
    this.editingId.set(null);
    this.showForm.set(true);
  }

  editTeacher(t: any): void {
    const parts = t.name.split(' ');
    const half = Math.ceil(parts.length / 2);
    this.tForm = {
      first: parts.slice(0, half).join(' '),
      last: parts.slice(half).join(' '),
      email: t.email ?? '',
      pin: t.pin, status: t.status
    };
    this.editingId.set(t.id);
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  saveTeacher(): void {
    if (!this.tForm.first.trim() || !this.tForm.last.trim()) {
      this.snack.open('Nombre y apellido requeridos', '', { duration: 2500 }); return;
    }
    if (!/^\d{4}$/.test(this.tForm.pin)) {
      this.snack.open('PIN debe ser de 4 dígitos', '', { duration: 2500 }); return;
    }

    const allTeachers = this.teachers();
    const pinExists = allTeachers.some(t => t.pin === this.tForm.pin && t.id !== this.editingId());
    if (pinExists) {
      this.snack.open('Ese PIN ya está en uso', '', { duration: 2500 }); return;
    }

    const payload = {
      name: `${this.tForm.first.trim()} ${this.tForm.last.trim()}`,
      email: this.tForm.email,
      pin: this.tForm.pin,
      status: this.tForm.status,
      role: 'teacher'
    };

    if (this.editingId()) {
      this.dataBackend.updateTeacher(this.editingId()!, payload).subscribe({
        next: () => {
          this.snack.open('Docente actualizado', '', { duration: 2000 });
          this.loadTeachers();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error updating teacher:', err);
          this.snack.open('Error al actualizar docente', '', { duration: 2500 });
        }
      });
    } else {
      this.dataBackend.createTeacher(payload).subscribe({
        next: () => {
          this.snack.open('Docente agregado', '', { duration: 2000 });
          this.loadTeachers();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error creating teacher:', err);
          this.snack.open('Error al crear docente', '', { duration: 2500 });
        }
      });
    }
  }

  resetPin(t: any): void {
    const pin = prompt(`Nuevo PIN de 4 dígitos para ${t.name}:`);
    if (!pin) return;
    if (!/^\d{4}$/.test(pin)) {
      this.snack.open('PIN inválido', '', { duration: 2500 });
      return;
    }

    const allTeachers = this.teachers();
    const pinExists = allTeachers.some(teacher => teacher.pin === pin && teacher.id !== t.id);
    if (pinExists) {
      this.snack.open('PIN ya en uso', '', { duration: 2500 });
      return;
    }

    this.dataBackend.updateTeacher(t.id, { pin }).subscribe({
      next: () => {
        this.snack.open(`PIN de ${t.name} actualizado`, '', { duration: 2000 });
        this.loadTeachers();
      },
      error: (err) => {
        console.error('Error updating PIN:', err);
        this.snack.open('Error al actualizar PIN', '', { duration: 2500 });
      }
    });
  }

  deleteTeacher(t: any): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar docente', message: `¿Eliminar a "${t.name}"?`, confirmLabel: 'Eliminar', danger: true }
    }).afterClosed().subscribe(ok => {
      if (!ok) return;
      this.dataBackend.deleteTeacher(t.id).subscribe({
        next: () => {
          this.snack.open('Docente eliminado', '', { duration: 2000 });
          this.loadTeachers();
        },
        error: (err) => {
          console.error('Error deleting teacher:', err);
          this.snack.open('Error al eliminar docente', '', { duration: 2500 });
        }
      });
    });
  }
}
