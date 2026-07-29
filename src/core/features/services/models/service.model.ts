import { Category } from '../../categories/models/category.model';
import { Collaborator } from '../../collaborators/models/collaborator.model';

export interface ServiceImage {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date;
  item_id: number;
  item_type: string;
}

export interface ProfessionalService {
  id: number;

  name: string;
  description: string;

  price: number;
  travel_price: number;
  is_paid_by_installments: boolean;

  image: ServiceImage;
  images: ServiceImage[];

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  category: Category;

  professionals: Collaborator[];
}
