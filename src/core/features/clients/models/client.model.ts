// client.model.ts
export interface ClientAddress {
  province?: string;
  municiple?: string;
}

export interface Client {
  id: string | number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bi: string;
  image?: string;
  address?: ClientAddress;
  // Propriedades calculadas/opcionais para exibição
  requestedServicesCount?: number;
  pendingRequestsCount?: number;
}