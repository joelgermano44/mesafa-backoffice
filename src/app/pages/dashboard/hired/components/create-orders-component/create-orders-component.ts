import { Component, ElementRef, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate } from 'motion';
import { toast } from 'ngx-sonner';
import { AddressService } from '../../../../../../core/features/address/services/addresses.service';
import { Address } from '../../../../../../core/features/address/models/address.model';
import { CollaboratorService } from '../../../../../../core/features/collaborators/services/collaborator.service';
import { OrdersService } from '../../../../../../core/features/orders/services/orders.service';
import { ProfessionalService } from '../../../../../../core/features/services/models/professional-with-services.model';
import { ServicesService } from '../../../../../../core/features/services/services/services.service';
import { ClientService } from '../../../../../../core/features/clients/services/client.service';
import { Client } from '../../../../../../core/features/clients/models/client.model';
import { Collaborator } from '../../../../../../core/features/collaborators/models/collaborator.model';

@Component({
  selector: 'app-create-orders-component',
  imports: [],
  templateUrl: './create-orders-component.html',
  styleUrl: './create-orders-component.css',
})
export class CreateOrdersComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ordersService = inject(OrdersService);
  private readonly servicesService = inject(ServicesService);
  private readonly collaboratorService = inject(CollaboratorService);
  private readonly clientService = inject(ClientService);
  private readonly addressService = inject(AddressService);
  private readonly el = inject(ElementRef);

  public close = output<void>();
  public orderCreated = output<void>();

  public isSubmitting = signal<boolean>(false);
  public services = signal<ProfessionalService[]>([]);
  public addresses = signal<Address[]>([]);
  public galleryPreviews = signal<string[]>([]);

  public clients = this.clientService.clients;
  public professionals = this.collaboratorService.collaborators;

  public orderForm: FormGroup = this.fb.group({
    service_id: [null as number | null, [Validators.required]],
    client_id: ['', [Validators.required]],
    professional_id: [null as number | null, [Validators.required]],
    address_id: [null as number | null, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    images: [[] as File[]],
  });

  ngOnInit(): void {
    if (this.professionals().length === 0) {
      this.collaboratorService.getAll().subscribe();
    }
    if (this.clients().length === 0) {
      this.clientService.loadClients();
    }
    this.loadServices();
    this.loadAddresses();
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
        { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }

  private loadServices(): void {
    this.servicesService.getAll().subscribe({
      next: (data) => this.services.set(data),
      error: (err) => console.error('Erro ao carregar serviços:', err),
    });
  }

  private loadAddresses(): void {
    this.addressService.getAddresses().subscribe({
      next: (data) => this.addresses.set(data),
      error: (err) => console.error('Erro ao carregar endereços:', err),
    });
  }

  public isControlInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public hasError(form: FormGroup, controlName: string, errorCode: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.hasError(errorCode) && (control.dirty || control.touched));
  }

  public onGalleryChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      const currentFiles = this.orderForm.get('images')?.value || [];
      const updatedFiles = [...currentFiles, ...newFiles];

      this.orderForm.patchValue({ images: updatedFiles });

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.galleryPreviews.update((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  public removeGalleryImage(index: number): void {
    const currentFiles: File[] = this.orderForm.get('images')?.value || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    this.orderForm.patchValue({ images: updatedFiles });

    this.galleryPreviews.update((prev) => prev.filter((_, i) => i !== index));
  }

  public onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.orderForm.value;
    const payload = {
      service_id: Number(formValue.service_id),
      professional_id: Number(formValue.professional_id),
      client_id: formValue.client_id,
      address_id: Number(formValue.address_id),
      description: formValue.description,
      images: formValue.images,
    };

    this.ordersService.createOrder(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        toast.success('Pedido de serviço criado com sucesso!');
        this.orderCreated.emit();
        this.onClose();
      },
      error: (err) => {
        console.error('Erro ao criar pedido:', err);
        this.isSubmitting.set(false);
        toast.error('Ocorreu um erro ao criar o pedido de serviço.');
      },
    });
  }

  public onClose(): void {
    const backdrop = this.el.nativeElement.querySelector('.fixed');
    const modalCard = this.el.nativeElement.querySelector('.modal-card');

    if (backdrop && modalCard) {
      Promise.all([
        animate(modalCard, { opacity: [1, 0], scale: [1, 0.95] }, { duration: 0.2 }).finished,
        animate(backdrop, { opacity: [1, 0] }, { duration: 0.2 }).finished,
      ]).then(() => this.close.emit());
    } else {
      this.close.emit();
    }
  }
}
