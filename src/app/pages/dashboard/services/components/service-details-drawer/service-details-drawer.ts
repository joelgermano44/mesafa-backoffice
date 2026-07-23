import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../../../../../core/features/services/models/service.model';
import { API_CONFIG } from '../../../../../../core/config/api.config';
@Component({
  selector: 'app-service-details-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-details-drawer.html',
  styleUrl: './service-details-drawer.css',
})
export class ServiceDetailsDrawer {
  readonly service = input.required<ProfessionalService>();
  readonly close = output<void>();

  public readonly api = API_CONFIG;
}