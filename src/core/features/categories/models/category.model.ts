import { Collaborator } from '../../collaborators/models/collaborator.model';

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CategoryService {
  id: number;
  name: string;
  price: number;
  is_paid_by_installments: boolean;
  travel_price: number;
  description: string;

  image: string | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  professionals: Collaborator[];

  category: Category;
}

export interface CategoryWithServices extends Category {
  services: CategoryService[];
}
