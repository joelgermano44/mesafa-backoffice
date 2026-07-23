import { Category } from '../../categories/models/category.model';
import { Collaborator } from '../../collaborators/models/collaborator.model';

export interface ServiceImage {
  id: number;
  image: string;
}

export interface ProfessionalService {
  id: number;

  name: string;
  description: string;

  price: number;
  travel_price: number;
  is_paid_by_installments: boolean;

  image: string | null;
  images: ServiceImage[];

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  category: Category;

  professionals: Collaborator[];
}
