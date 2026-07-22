import { Address } from './address.model';
import { Professions } from './professions.model';
import { Services } from './services.model';

export interface Collaborator {
  username: string;
  image: string;
  name: string;
  email: string;
  bi: string;
  phone: string;
  birthdate: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  id: number;
  nif: string;
  about_me: string;
  services: Services[];
  address: Address;
  professions: Professions[];
}
