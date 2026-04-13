import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6 min-w-[320px]">
      <h2 class="text-base font-bold mb-2">{{ data.title }}</h2>
      <p class="text-sm text-[var(--text2)] mb-6">{{ data.message }}</p>
      <div class="flex gap-2 justify-end">
        <button mat-button mat-dialog-close>{{ data.cancelLabel ?? 'Cancelar' }}</button>
        <button mat-flat-button
                [color]="data.danger ? 'warn' : 'primary'"
                (click)="confirm()">
          {{ data.confirmLabel ?? 'Confirmar' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: ConfirmDialogData,
    private ref: MatDialogRef<ConfirmDialogComponent>
  ) {}
  confirm() { this.ref.close(true); }
}
