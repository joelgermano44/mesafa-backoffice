import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, input, Output, effect, inject } from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-confirm-dialog-component',
  imports: [CommonModule],
  templateUrl: './confirm-dialog-component.html',
  styleUrl: './confirm-dialog-component.css',
  standalone: true,
})
export class ConfirmDialogComponent {
  private el = inject(ElementRef);

  isOpen = input<boolean>(false);
  title = input<string>('Confirmar ação');
  message = input<string>(
    'Tem a certeza de que deseja prosseguir? Esta ação não pode ser desfeita.',
  );
  confirmText = input<string>('Eliminar');
  cancelText = input<string>('Cancelar');
  isLoading = input<boolean>(false);

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        queueMicrotask(() => {
          const backdrop = this.el.nativeElement.querySelector('.fixed.inset-0') as HTMLElement;
          const modal = this.el.nativeElement.querySelector('.bg-white') as HTMLElement;

          if (backdrop) {
            animate(backdrop, { opacity: [0, 1] }, { duration: 0.2, ease: [0.16, 1, 0.3, 1] });
          }

          if (modal) {
            animate(
              modal,
              { opacity: [0, 1], scale: [0.92, 1], y: [8, 0] },
              { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
            );
          }
        });
      }
    });
  }

  onConfirm(): void {
    if (!this.isLoading()) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    if (!this.isLoading()) {
      this.cancel.emit();
    }
  }
}
