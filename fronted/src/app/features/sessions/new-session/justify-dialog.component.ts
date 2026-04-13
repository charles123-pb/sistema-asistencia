import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Justification } from '../../../core/models';

@Component({
  selector: 'app-justify-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatSelectModule],
  template: `
    <div class="p-6 min-w-[360px]">
      <h2 class="text-base font-bold mb-1">Justificar ausencia</h2>
      <p class="text-xs text-[var(--text2)] mb-4">
        {{ data.studentName }} · {{ data.sessionName }}
      </p>

      <mat-form-field appearance="outline" class="w-full mb-3">
        <mat-label>Motivo</mat-label>
        <mat-select [(ngModel)]="form.reason">
          <mat-option value="Enfermedad (con constancia médica)">Enfermedad (con constancia médica)</mat-option>
          <mat-option value="Trámite institucional">Trámite institucional</mat-option>
          <mat-option value="Duelo familiar">Duelo familiar</mat-option>
          <mat-option value="Accidente">Accidente</mat-option>
          <mat-option value="Otro">Otro</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full mb-4">
        <mat-label>Observaciones</mat-label>
        <textarea matInput [(ngModel)]="form.obs" rows="3"
                  placeholder="Notas adicionales..."></textarea>
      </mat-form-field>

      <div class="flex gap-2 justify-end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" (click)="save()">Guardar justificación</button>
      </div>
    </div>
  `
})
export class JustifyDialogComponent {
  form: Justification = {
    reason: 'Enfermedad (con constancia médica)',
    obs: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: { studentName: string; sessionName: string; existing?: Justification },
    private ref: MatDialogRef<JustifyDialogComponent>
  ) {
    this.form = {
      reason: this.data.existing?.reason ?? 'Enfermedad (con constancia médica)',
      obs: this.data.existing?.obs ?? ''
    };
  }

  save(): void {
    this.ref.close(this.form);
  }
}
