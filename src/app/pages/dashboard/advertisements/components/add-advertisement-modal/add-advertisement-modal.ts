import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-add-advertisement-modal',
  standalone: true,
  templateUrl: './add-advertisement-modal.html',
  imports: [],
  styleUrl: './add-advertisement-modal.css',
})
export class AddAdvertisementModalComponent {
  closeModal = output<void>();

  saveBanner = output<{ link: string; image: File | null }>();

  protected readonly link = signal('');
  protected readonly selectedImage = signal<File | null>(null);
  protected readonly imagePreview = signal<string | null>(null);

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
    this.onClose();
  }
}
