export type OrderStatus = 'REQUESTED' | 'PENDING' | 'REJECTED' | 'CANCELED' | 'COMPLETED';

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
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
  lat_lng?: LatLng | null;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Professional {
  id: number;
  username: string;
  image?: string | null;
  name: string;
  email: string;
  bi: string;
  nif?: string;
  phone: string;
  birthdate: string;
  about_me?: string;
  address?: Address | null;
  professions?: any[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  is_paid_by_installments: boolean;
  travel_price: number;
  description: string;
  image?: string | null;
  professionals?: Professional[];
  category?: Category;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Client {
  id: string;
  username: string;
  image?: string | null;
  name: string;
  email: string;
  bi: string;
  phone: string;
  birthdate: string;
  address?: Address | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Payment {
  id: number;
  amount: number;
  client_id: string;
  payment_method_id?: number | null;
  reference?: string | null;
  status: string;
  payment_method?: any | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface OrderImage {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  type: string;
  item_id: number;
  item_type: string;
  createdAt: string;
  updatedAt: string;
  deleted_at?: string | null;
}

export interface Order {
  total_price: any;
  price: any;
  id: number;
  client_id: string;
  service_id: number;
  address_id: number;
  description: string;
  first_payment_id?: number | null;
  second_payment_id?: number | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  service?: Service;
  address?: Address;
  client?: Client;
  images?: OrderImage[];
  first_payment?: Payment | null;
  second_payment?: Payment | null;
}

export interface CreateOrderPayload {
  service_id: number;
  address_id: number;
  description: string;
  client_id?: string;
  images?: File[];
}

export interface DeleteResponse {
  raw: any[];
  affected: number;
}
