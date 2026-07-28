import { Component, inject, OnInit, output, signal, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { animate } from 'motion';
import { ServicesService } from '../../../../../../core/features/services/services/services.service';
import { CollaboratorService } from '../../../../../../core/features/collaborators/services/collaborator.service';
import { CategoriesService } from '../../../../../../core/features/categories/services/category.service';
import { ProfessionalService } from '../../../../../../core/features/services/models/service.model';
import { Category } from '../../../../../../core/features/categories/models/category.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-create-service-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-service-modal-component.html',
})
export class CreateServiceModalComponent implements OnInit, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly servicesService = inject(ServicesService);
  private readonly collaboratorService = inject(CollaboratorService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly el = inject(ElementRef);

  public close = output<void>();
  public serviceCreated = output<void>();

  public activeTab = signal<'create' | 'associate'>('create');
  public isSubmitting = signal<boolean>(false);
  public availableServices = signal<ProfessionalService[]>([]);
  public categories = signal<Category[]>([]);
  public selectedMediaPreview = signal<string | null>(null);

  public collaborators = this.collaboratorService.collaborators;

  // Form ajustado aos requisitos exatos do Backend
  public createForm = this.fb.group({
    name: ['', [Validators.required]],
    categoryId: [null as number | null, [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    travelPrice: [null as number | null, [Validators.required, Validators.min(0)]],
    isPaidByInstallments: [false, [Validators.required]],
    description: ['', [Validators.required]],
    media: [null as File | null]
  });

  public associateForm = this.fb.group({
    professionalId: [null as number | null, [Validators.required]],
    serviceId: [null as number | null, [Validators.required]],
  });

  ngOnInit(): void {
    if (this.collaborators().length === 0) {
      this.collaboratorService.getAll().subscribe();
    }

    this.loadServices();
    this.loadCategories();
  }

  private loadServices(): void {
    this.servicesService.getAll().subscribe({
      next: (services) => this.availableServices.set(services),
      error: (err) => console.error('Erro ao carregar serviços:', err),
    });
  }

  private loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Erro ao carregar categorias:', err),
    });
  }

  ngAfterViewInit(): void {
    const backdrop = this.el.nativeElement.querySelector('.fixed');
    const modalCard = this.el.nativeElement.querySelector('.modal-card');

    if (backdrop) {
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.25 });
    }

    if (modalCard) {
      animate(
        modalCard,
        { opacity: [0, 1], scale: [0.9, 1], y: [20, 0] },
        { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      );
    }
  }

  public setTab(tab: 'create' | 'associate'): void {
    this.activeTab.set(tab);
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.createForm.patchValue({ media: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedMediaPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  public onClose(): void {
    this.close.emit();
  }

  public onCreateSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      toast.error('Preencha todos os campos obrigatórios do serviço.');
      return;
    }

    this.isSubmitting.set(true);

    const formData = new FormData();
    const formVal = this.createForm.value;

    formData.append('name', formVal.name || '');
    formData.append('category_id', String(formVal.categoryId));
    formData.append('price', String(formVal.price));
    formData.append('travel_price', String(formVal.travelPrice));
    formData.append('is_paid_by_installments', String(Boolean(formVal.isPaidByInstallments)));
    formData.append('description', formVal.description || '');
    
    if (formVal.media) {
      formData.append('image', formVal.media);
    }

    this.servicesService.createService(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        toast.success('Serviço criado com sucesso.');
        this.loadServices();
        this.serviceCreated.emit();
        this.setTab('associate');
      },
      error: (err) => {
        console.error('Erro ao criar serviço:', err);
        this.isSubmitting.set(false);
        toast.error('Ocorreu um erro ao criar o serviço.');
      },
    });
  }

  public onAssociateSubmit(): void {
    if (this.associateForm.invalid) {
      this.associateForm.markAllAsTouched();
      toast.error('Por favor, selecione o profissional e o serviço.');
      return;
    }

    const { professionalId, serviceId } = this.associateForm.value;

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