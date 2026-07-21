import { Admin } from './admin.model';

export interface LoginResponse {
  access_token: string;
  user: Admin;
}
