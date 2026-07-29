import { Category } from '../../categories/models/category.model';
import { Collaborator } from '../../collaborators/models/collaborator.model';
import { ServiceImage } from './service.model';

export interface ProfessionalService {
  id: number;
  name: string;
  price: number;
  is_paid_by_installments: boolean;
  travel_price: number;
  description: string;
  image: ServiceImage;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  category: Category;
}

export interface ProfessionalWithServices extends Collaborator {
  services: ProfessionalService[];
}
