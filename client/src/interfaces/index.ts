export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  inventory_count: number;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
}

export interface AuthContextType {
  user: IUser | null;
  login: (userData: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ICartItem {
  id: number;
  product: IProduct;
  quantity: number;
  unit_price?: number;
}
