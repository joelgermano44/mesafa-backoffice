import { ProfessionalService } from '../../services/models/professional-with-services.model';
import { Address } from './address.model';
import { Professions } from './professions.model';

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
  services: ProfessionalService[];
  address: Address;
  professions: Professions[];
}
