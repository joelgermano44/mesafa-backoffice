import { Admin } from '../../administrators/models/admin.model';

export interface LoginResponse {
  access_token: string;
  user: Admin;
}
