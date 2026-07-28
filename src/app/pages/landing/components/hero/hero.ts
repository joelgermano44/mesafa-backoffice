import { Component, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import { animate, stagger } from 'motion';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements AfterViewInit {
  contentRef = viewChild<ElementRef<HTMLElement>>('content');
  imageRef = viewChild<ElementRef<HTMLElement>>('image');

  ngAfterViewInit(): void {
    const contentEl = this.contentRef()?.nativeElement;
    const imageEl = this.imageRef()?.nativeElement;

    const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

    if (contentEl) {
      const children = Array.from(contentEl.children) as HTMLElement[];
      
      animate(
        children,
        { 
          opacity: [0, 1], 
          y: [24, 0] 
        },
        { 
          duration: 0.8, 
          delay: stagger(0.15), 
          ease: customEase 
        }
      );
    }

    if (imageEl) {
      animate(
        imageEl,
        { 
          opacity: [0, 1], 
          scale: [0.95, 1],
          y: [16, 0]
        },
        { 
          duration: 0.9, 
          delay: 0.2, 
          ease: customEase 
        }
      );
    }
  }
}