import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '../core/features/auth/services/auth.service';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('mesafa-backoffice');

  private readonly authService = inject(AuthService);

  constructor() {
    this.authService.restoreSession();
  }
}
