import { Component, ElementRef, EventEmitter, Output, inject, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { animate } from 'motion';
import { toast } from 'ngx-sonner';
import { AdminService } from '../../../../../../core/features/administrators/services/admin.service';

@Component({
  selector: 'app-register-admin-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-admin-modal-component.html',
})
export class RegisterAdminModalComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private elementRef = inject(ElementRef);

  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();
  
  loading = signal<boolean>(false);
  submitted = false;

  imagePreview = signal<string | null>(null);

  adminForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{9,15}$/)]],
    bi: ['', [Validators.required, Validators.pattern(/^[0-9]{9}[A-Za-z]{2}[0-9]{3}$/)]],
    birthdate: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    image: [null],
  });

  ngAfterViewInit(): void {
    const overlay = this.elementRef.nativeElement.querySelector('.fixed.inset-0');
    const container = this.elementRef.nativeElement.querySelector('.bg-white');

    if (overlay) {
      animate(overlay, { opacity: [0, 1] }, { duration: 0.25, ease: 'easeOut' });
    }

    if (container) {
      animate(
        container,
        { opacity: [0, 1], scale: [0.92, 1], y: [15, 0] },
        { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  closeModal(): void {
    const overlay = this.elementRef.nativeElement.querySelector('.fixed.inset-0');
    const container = this.elementRef.nativeElement.querySelector('.bg-white');

    if (overlay && container) {
      Promise.all([
        animate(container, { opacity: [1, 0], scale: [1, 0.95] }, { duration: 0.2, ease: 'easeIn' }).finished,
        animate(overlay, { opacity: [1, 0] }, { duration: 0.2, ease: 'easeIn' }).finished,
      ]).then(() => {
        this.close.emit();
      });
    } else {
      this.close.emit();
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      toast.error('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.loading.set(true);

    this.adminService.register(this.adminForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        toast.success('Administrador cadastrado com sucesso!');
        this.success.emit();
        this.closeModal();
      },
      error: (err) => {
        this.loading.set(false);
        toast.error(err?.error?.message || 'Erro ao cadastrar administrador.');
      }
    });
  }
}