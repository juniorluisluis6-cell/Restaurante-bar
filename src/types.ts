export type UserRole = 'customer' | 'staff' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  points: number;
  createdAt: string;
}

export type MenuCategory = 'Chicken' | 'Burgers' | 'Pizzas' | 'Sides' | 'Drinks';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  imageUrl?: string;
  prepTime?: number;
  available: boolean;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'mpesa';

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  address?: string;
  location?: { lat: number; lng: number };
  paymentMethod: PaymentMethod;
  paymentPhone?: string;
  createdAt: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  createdAt: string;
}
