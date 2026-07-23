import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  background: string;
  type: 'free' | 'premium';
  price: number;
  clicks: number;
}

@Component({
  selector: 'app-banner-card',
  standalone: true,
  imports: [],
  templateUrl: './banner-card.html',
  styleUrl: './banner-card.css',
})
export class BannerCardComponent {
  @Input({ required: true }) banner!: Banner;

  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();

  onDelete() {
    this.delete.emit(this.banner.id);
  }

  onEdit() {
    this.edit.emit(this.banner.id);
  }
}