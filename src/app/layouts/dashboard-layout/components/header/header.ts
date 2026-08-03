import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  effect,
  HostListener,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../../core/features/administrators/services/admin.service';
import { animate } from 'motion';
import { AuthService } from '../../../../../core/features/auth/services/auth.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SearchService } from '../../../../../core/features/search/service/search.service';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly adminService = inject(AdminService);
  private readonly authservice = inject(AuthService);
  private readonly searchService = inject(SearchService);
  private readonly el = inject(ElementRef);

  readonly admin = this.adminService.admin;
  readonly isDropdownOpen = signal(false);

  // ViewChildren do Dropdown do usuário
  readonly dropdownMenu = viewChild<ElementRef<HTMLElement>>('dropdownMenu');
  readonly chevronIcon = viewChild<ElementRef<HTMLElement>>('chevronIcon');

  // ViewChild dos resultados da Busca
  readonly searchResultsContainer = viewChild<ElementRef<HTMLElement>>('searchResultsContainer');

  readonly searchTerm = signal('');

  readonly searchResults = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term.trim()) {
          return of({ services: [], professionals: [] });
        }
        return this.searchService.search(term, 'tudo');
      }),
    ),
    { initialValue: { services: [], professionals: [] } },
  );

  constructor() {
    // Animação da Chevron e do Menu Dropdown do Usuário
    effect(() => {
      const isOpen = this.isDropdownOpen();
      const dropdownEl = this.dropdownMenu()?.nativeElement;
      const chevronEl = this.chevronIcon()?.nativeElement;

      if (chevronEl) {
        animate(
          chevronEl,
          { rotate: isOpen ? 180 : 0 },
          { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        );
      }

      if (isOpen && dropdownEl) {
        animate(
          dropdownEl,
          {
            opacity: [0, 1],
            scale: [0.95, 1],
            y: [-8, 0],
          },
          {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          },
        );
      }
    });

    // Animação de Entrada para os Resultados da Busca
    effect(() => {
      const searchEl = this.searchResultsContainer()?.nativeElement;
      if (searchEl) {
        animate(
          searchEl,
          {
            opacity: [0, 1],
            scale: [0.97, 1],
            y: [-6, 0],
          },
          {
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          },
        );
      }
    });
  }

  // Fecha os dropdowns ao clicar em qualquer lugar fora do componente
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeDropdownWithAnimation();
      
      // Fecha a busca limpando o termo (se desejar manter o termo, basta remover esta linha)
      this.closeSearchWithAnimation();
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  toggleDropdown(): void {
    if (this.isDropdownOpen()) {
      this.closeDropdownWithAnimation();
    } else {
      this.isDropdownOpen.set(true);
    }
  }

  closeDropdownWithAnimation(): void {
    const dropdownEl = this.dropdownMenu()?.nativeElement;

    if (dropdownEl && this.isDropdownOpen()) {
      // Executa animação de saída suave antes de desmontar o elemento (*ngIf / @if)
      const controls = animate(
        dropdownEl,
        {
          opacity: [1, 0],
          scale: [1, 0.95],
          y: [0, -6],
        },
        {
          duration: 0.15,
          ease: [0.16, 1, 0.3, 1],
        },
      );

      controls.finished.then(() => {
        this.isDropdownOpen.set(false);
      });
    } else {
      this.isDropdownOpen.set(false);
    }
  }

  closeSearchWithAnimation(): void {
    const searchEl = this.searchResultsContainer()?.nativeElement;

    if (searchEl && this.searchTerm().trim().length > 0) {
      const controls = animate(
        searchEl,
        {
          opacity: [1, 0],
          scale: [1, 0.97],
          y: [0, -4],
        },
        {
          duration: 0.15,
          ease: [0.16, 1, 0.3, 1],
        },
      );

      controls.finished.then(() => {
        this.searchTerm.set('');
      });
    } else {
      this.searchTerm.set('');
    }
  }

  logout(): void {
    this.authservice.logout();
  }
}