export interface ClientAddress {
  province?: string;
  municiple?: string;
}

export interface Client {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  bi: string;
  image?: string;
  address?: ClientAddress; 

  requestedServicesCount?: number;
  pendingRequestsCount?: number;
}