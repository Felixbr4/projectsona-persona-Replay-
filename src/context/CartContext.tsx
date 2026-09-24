"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  edition: string;
  price: number;
  originalPrice?: number | null;
  platform: string;
  image?: string | null;
  availableStock?: number;
  game?: {
    name: string;
    slug: string;
    theme: string;
  };
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => { success: boolean; message?: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  itemsCount: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    try {
      const saved = localStorage.getItem("projecsona_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Falha ao restaurar carrinho:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Salvar no localStorage sempre que houver alteração
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("projecsona_cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (product: CartProduct, quantity = 1) => {
    const existingIndex = items.findIndex((i) => i.product.id === product.id);
    const available = product.availableStock !== undefined ? product.availableStock : 99;

    if (available <= 0) {
      return { success: false, message: "Produto esgotado no momento." };
    }

    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity;
      const newQty = currentQty + quantity;

      if (newQty > available) {
        return {
          success: false,
          message: `Limite de estoque atingido. Apenas ${available} unidades disponíveis.`,
        };
      }

      const updated = [...items];
      updated[existingIndex].quantity = newQty;
      setItems(updated);
      return { success: true, message: `Quantidade atualizada no carrinho (${newQty}).` };
    } else {
      if (quantity > available) {
        return {
          success: false,
          message: `Apenas ${available} unidades disponíveis para compra.`,
        };
      }

      setItems([...items, { product, quantity }]);
      return { success: true, message: `"${product.name}" adicionado ao carrinho!` };
    }
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return { success: true };
    }

    const item = items.find((i) => i.product.id === productId);
    if (!item) return { success: false, message: "Item não encontrado." };

    const available = item.product.availableStock !== undefined ? item.product.availableStock : 99;
    if (quantity > available) {
      return {
        success: false,
        message: `Estoque insuficiente. Máximo disponível: ${available}.`,
      };
    }

    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
    return { success: true };
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemsCount,
        subtotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser utilizado dentro de CartProvider");
  }
  return context;
}
