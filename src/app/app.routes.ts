import { Routes } from '@angular/router';

import { LandingLayout } from './layouts/landing-layout/landing-layout';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { guestGuard } from '../core/guards/guest.guard';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingLayout,
    children: [
      {
        path: '',
        component: Landing,
      },
    ],
    canActivate: [guestGuard],
  },

  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },

  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
