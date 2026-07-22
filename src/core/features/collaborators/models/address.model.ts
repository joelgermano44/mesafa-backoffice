export interface Address {
  id: number;
  province: string;
  municiple: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date;
  lat_lng: {
    lat: string;
    lng: string;
    id: number;
  };
}
