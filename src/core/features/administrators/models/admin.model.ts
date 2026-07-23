export interface Admin {
  id: number;
  username: string;
  image: string | null;
  name: string;
  email: string;
  bi: string;
  phone: string;
  birthdate: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateAdminDto {
  name: string;
  bi: string;
  email: string;
  phone: string;
  birthdate: string;
  password?: string;
}

export type UpdateAdminDto = Partial<
  Omit<Admin, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
>;

export interface DeleteAdminResponse {
  raw: any[];
  affected: number;
}
