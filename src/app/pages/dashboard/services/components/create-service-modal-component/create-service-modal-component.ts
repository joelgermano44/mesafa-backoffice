import { Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService } from '../../../../../../core/features/services/services/services.service';
import { CollaboratorService } from '../../../../../../core/features/collaborators/services/collaborator.service';
import { ProfessionalService } from '../../../../../../core/features/services/models/service.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-create-service-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-service-modal-component.html',
})
export class CreateServiceModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly servicesService = inject(ServicesService);
  private readonly collaboratorService = inject(CollaboratorService);

  public close = output<void>();
  public serviceCreated = output<void>();

  public isSubmitting = signal<boolean>(false);
  public availableServices = signal<ProfessionalService[]>([]);

  public collaborators = this.collaboratorService.collaborators;

  public serviceForm = this.fb.group({
    professionalId: [null as number | null, [Validators.required]],
    serviceId: [null as number | null, [Validators.required]],
  });

  ngOnInit(): void {
    if (this.collaborators().length === 0) {
      this.collaboratorService.getAll().subscribe();
    }

    this.servicesService.getAll().subscribe({
      next: (services) => this.availableServices.set(services),
      error: (err) => console.error('Erro ao carregar serviços:', err),
    });
  }

  public onClose(): void {
    this.close.emit();
  }

  public onSubmit(): void {
  if (this.serviceForm.invalid) {
    this.serviceForm.markAllAsTouched();

    toast.error('Por favor, selecione o profissional e o serviço.');
    return;
  }

  const { professionalId, serviceId } = this.serviceForm.value;

  if (!professionalId || !serviceId) {
    toast.error('Selecione um profissional e um serviço.');
    return;
  }

  this.isSubmitting.set(true);

  const payload = {
    service_ids: [Number(serviceId)],
  };

  this.servicesService.subscribeProfessionalService(professionalId, payload as any).subscribe({
    next: () => {
      this.isSubmitting.set(false);

      toast.success('Serviço associado com sucesso.');

      this.serviceCreated.emit();
      this.onClose();
    },
    error: (err) => {
      console.error('Erro ao associar serviço:', err);

      this.isSubmitting.set(false);

      toast.error('Ocorreu um erro ao associar o serviço ao profissional.');
    },
  });
}
}
