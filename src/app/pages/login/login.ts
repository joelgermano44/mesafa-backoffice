import { Component, ElementRef, AfterViewInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../core/features/auth/services/auth.service';

import { animate } from 'motion';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  loginForm: FormGroup;
  submitted = false;
  loading = signal<boolean>(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly el = inject(ElementRef);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngAfterViewInit(): void {
    const bgImg = this.el.nativeElement.querySelector('.bg-bg-img');
    if (bgImg) {
      animate(bgImg, { opacity: [0, 1] }, { duration: 0.8 });
    }

    const logo = this.el.nativeElement.querySelector('.bg-logo');
    if (logo) {
      animate(
        logo,
        { opacity: [0, 1], scale: [0.8, 1] },
        { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
      );
    }

    const formCard = this.el.nativeElement.querySelector('.login-card');
    if (formCard) {
      animate(
        formCard,
        { opacity: [0, 1], y: [30, 0] },
        { duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
      );
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      const formCard = this.el.nativeElement.querySelector('.login-card');
      if (formCard) {
        animate(formCard, { x: [-8, 8, -4, 4, 0] }, { duration: 0.4 });
      }
      return;
    }

    this.loading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        toast.error('Falha ao realizar login. Verifique suas credenciais.');
      },
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
