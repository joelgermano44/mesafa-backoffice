import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService } from '../../../../../../core/features/services/services/services.service';

@Component({
  selector: 'app-create-service-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-service-modal-component.html',
})
export class CreateServiceModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly servicesService = inject(ServicesService);

  public close = output<void>();
  public serviceCreated = output<void>();

  public isSubmitting = signal<boolean>(false);
  public previewImage = signal<string | null>(null);
  public selectedFile = signal<File | null>(null);

  public serviceForm = this.fb.group({
    title: ['', [Validators.required]],
    category: ['', [Validators.required]],
    type: ['hub', [Validators.required]],
    price: [null, [Validators.required, Validators.min(0)]],
    description: [''],
    professionalId: [null, [Validators.required]],
  });

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = () => this.previewImage.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  public onClose(): void {
    this.close.emit();
  }

  public onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const formValues = this.serviceForm.value;
    const professionalId = formValues.professionalId;

    if (!professionalId) {
      alert('Selecione ou informe o ID do profissional.');
      return;
    }

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('title', formValues.title || '');
    formData.append('category', formValues.category || '');
    formData.append('type', formValues.type || 'hub');
    formData.append('price', String(formValues.price || 0));
    formData.append('description', formValues.description || '');

    if (this.selectedFile()) {
      formData.append('image', this.selectedFile()!);
    }

    this.servicesService.subscribeProfessionalService(professionalId, formData as any).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.serviceCreated.emit();
        this.onClose();
      },
      error: (err) => {
        console.error('Erro ao criar serviço:', err);
        this.isSubmitting.set(false);
        alert('Ocorreu um erro ao cadastrar o serviço.');
      },
    });
  }
}
