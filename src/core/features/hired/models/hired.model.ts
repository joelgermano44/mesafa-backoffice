export type HiredStatus = 'Pendente' | 'Aceito' | 'Rejeitado';

export interface HiredService {
  id: string;
  title: string;
  providerName: string;
  providerAvatar?: string;
  price: number;
  currency: string;
  imageUrl: string;
  status: HiredStatus;
}
