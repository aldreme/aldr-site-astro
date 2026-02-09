import { persistentAtom, persistentMap } from "@nanostores/persistent";
import { atom } from "nanostores";

export type CartItem = {
  id: string; // Product Name
  name: string;
  quantity: number;
  deliveryDate?: string;
  image?: string;
};

export const isCartOpen = atom(false);

// Use persistentMap to save cart to localStorage
export const cartItems = persistentMap<Record<string, CartItem>>("cart:", {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export type RFQContactInfo = {
  name: string;
  email: string;
  company: string;
  notes: string;
  expectedDeliveryDate?: string;
};

const DEFAULT_CONTACT: RFQContactInfo = {
  name: "",
  email: "",
  company: "",
  notes: "",
};

export const rfqContactStore = persistentAtom<RFQContactInfo>(
  "rfq-contact",
  DEFAULT_CONTACT,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export const addCartItem = (item: CartItem) => {
  const existing = cartItems.get()[item.id];
  if (existing) {
    cartItems.setKey(item.id, {
      ...existing,
      quantity: existing.quantity + item.quantity,
    });
  } else {
    cartItems.setKey(item.id, item);
  }
  isCartOpen.set(true); // Open cart when item added
};

export const updateCartItemQuantity = (id: string, quantity: number) => {
  const existing = cartItems.get()[id];
  if (existing) {
    if (quantity <= 0) {
      removeCartItem(id);
    } else {
      cartItems.setKey(id, { ...existing, quantity });
    }
  }
};

export const removeCartItem = (id: string) => {
  cartItems.setKey(id, undefined!);
};

export const clearCart = () => {
  const keys = Object.keys(cartItems.get());
  keys.forEach((key) => cartItems.setKey(key, undefined!));
};
