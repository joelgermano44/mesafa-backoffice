export interface PortfolioImage {
  id: number;
  filename: string;
  path: string;
  mimetype: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
  item_id: number;
  item_type: string;
}

export interface Portfolio {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
  cover: PortfolioImage;
  images: PortfolioImage[];
}