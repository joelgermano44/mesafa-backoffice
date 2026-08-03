export type QueryType = 'tudo' | 'professionals' | 'services';

export interface ProfessionalSummary {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  bi: string;
  nif: string | null;
  about_me: string | null;
  image: string | null;
  birthdate: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ServiceItem {
  id: number;
  name: string;
  price: number;
  travel_price: number;
  is_paid_by_installments: boolean;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  professionals: ProfessionalSummary[];
}

export interface LatLng {
  id: number;
  lat: string;
  lng: string;
}

export interface Address {
  id: number;
  province: string;
  municiple: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
  lat_lng: LatLng | null;
}

export interface Profession {
  id: number;
  name: string;
  start_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProfessionalItem extends ProfessionalSummary {
  address: Address | null;
  professions: Profession[];
}

export interface SearchResponse {
  services: ServiceItem[];
  professionals: ProfessionalItem[];
}