import { Category } from './category.model';

export interface Services {
  id: number;
  name: string;
  price: number;
  is_paid_by_installments: boolean;
  travel_price: number;
  description: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  image: string;
  category: Category;
}
