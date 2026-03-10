import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => 
        set((state) => {
          const isExist = state.items.find((item) => item.id === product.id);
          if (isExist) return state; // Hindari duplikat kursus
          return { items: [...state.items, product] };
        }),
      removeItem: (id) => 
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
);