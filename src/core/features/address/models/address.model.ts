export interface LatLng {
  id?: number;
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

export interface CreateAddressPayload {
  province: string;
  municiple: string;
  address: string;
}
