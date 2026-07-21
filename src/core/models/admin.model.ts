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
