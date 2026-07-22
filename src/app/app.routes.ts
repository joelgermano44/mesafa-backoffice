import { Routes } from '@angular/router';

import { LandingLayout } from './layouts/landing-layout/landing-layout';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { guestGuard } from '../core/guards/guest.guard';
import { authGuard } from '../core/guards/auth.guard';
import { Home } from './pages/dashboard/home/home';
import { Administrators } from './pages/dashboard/administrators/administrators';
import { Services } from './pages/dashboard/services/services';
import { Hired } from './pages/dashboard/hired/hired';
import { Advertisements } from './pages/dashboard/advertisements/advertisements';
import { ClientsUsers } from './pages/dashboard/clients-users/clients-users';
import { ProfessionalsUsers } from './pages/dashboard/professionals-users/professionals-users';

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
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'administrators',
        component: Administrators,
      },
      {
        path: 'services',
        component: Services,
      },
      {
        path: 'hired',
        component: Hired,
      },
      {
        path: 'advertisements',
        component: Advertisements,
      },
      {
        path: 'clients-users',
        component: ClientsUsers,
      },
      {
        path: 'professionals-users',
        component: ProfessionalsUsers,
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
