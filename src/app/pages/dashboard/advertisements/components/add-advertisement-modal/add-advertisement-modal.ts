import { Component, output, signal, AfterViewInit, ElementRef, inject } from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-add-advertisement-modal',
  standalone: true,
  templateUrl: './add-advertisement-modal.html',
  imports: [],
  styleUrl: './add-advertisement-modal.css',
})
export class AddAdvertisementModalComponent implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);

  closeModal = output<void>();
  saveBanner = output<{ link: string; image: File | null }>();

  protected readonly link = signal('');
  protected readonly selectedImage = signal<File | null>(null);
  protected readonly imagePreview = signal<string | null>(null);

  ngAfterViewInit(): void {
    const nativeEl = this.elementRef.nativeElement as HTMLElement;
    const backdrop = nativeEl.querySelector('.fixed.inset-0');
    const modalCard = nativeEl.querySelector('.bg-white.rounded-\\[10px\\]');

    if (backdrop) {
      animate(
        backdrop,
        { opacity: [0, 1] },
        { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      );
    }

    if (modalCard) {
      animate(
        modalCard,
        { opacity: [0, 1], scale: [0.9, 1], y: [20, 0] },
        { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      );
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage.set(file);

      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  protected onLinkInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.link.set(input.value);
  }

  protected onClose(): void {
    this.closeModal.emit();
  }

  protected onSave(): void {
    this.saveBanner.emit({
      link: this.link(),
      image: this.selectedImage(),
    });
  }
}