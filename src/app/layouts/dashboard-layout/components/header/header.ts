import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  effect,
  HostListener,
  untracked,
  DestroyRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  private readonly destroyRef = inject(DestroyRef);

  readonly admin = this.adminService.admin;
  readonly isDropdownOpen = signal(false);

  readonly dropdownMenu = viewChild<ElementRef<HTMLElement>>('dropdownMenu');
  readonly chevronIcon = viewChild<ElementRef<HTMLElement>>('chevronIcon');

  readonly searchResultsContainer = viewChild<ElementRef<HTMLElement>>('searchResultsContainer');

  readonly searchTerm = signal('');

  /*   readonly searchResults = toSignal(
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
  ); */

  private readonly router = inject(Router);

  private readonly search$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) => {
      if (!term.trim()) return of(null);
      return this.searchService.search(term, 'tudo');
    }),
  );

  readonly searchResults = toSignal(this.search$, { initialValue: null });

  constructor() {
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

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onSelectResult(item: any): void {
    this.closeSearchWithAnimation();

    if (item.type === 'service' || item.price !== undefined) {
      this.router.navigate(['/dashboard/services'], {
        queryParams: { serviceId: item.id },
      });
    } else if (item.type === 'professional' || item.role === 'collaborator' || item.username) {
      this.router.navigate(['/dashboard/professionals-users'], {
        queryParams: { search: item.name || item.id },
      });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  closeSearchWithAnimation(): void {
    const searchEl = this.searchResultsContainer()?.nativeElement;

    if (searchEl && this.searchTerm().trim().length > 0) {
      const controls = animate(
        searchEl,
        { opacity: [1, 0], scale: [1, 0.98], y: [0, -4] },
        { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
      );

      controls.finished.then(() => {
        this.searchTerm.set('');
      });
    } else {
      this.searchTerm.set('');
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.searchTerm().length > 0) {
        this.closeSearchWithAnimation();
      }
    }
  }

  /*   @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeDropdownWithAnimation();

      this.closeSearchWithAnimation();
    }
  } */

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

  /* 
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
  } */

  logout(): void {
    this.authservice.logout();
  }
}
