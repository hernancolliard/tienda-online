export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[]; // Assuming images are stored as an array of URLs
  category_id: number;
  category_name?: string; // Optional, as it's joined from categories table
  is_featured: boolean;
  stock_quantity: number;
  sizes: string[]; // Assuming sizes are stored as an array of strings
  created_at: string;
  updated_at: string;
}
