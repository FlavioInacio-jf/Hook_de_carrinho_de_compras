import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });
  const addProduct = async (productId: number) => {
    try {
      const { data } = await api.get(`http://localhost:3333/products/${productId}`)

      const { data: stock } = await api.get(`http://localhost:3333/stock/${productId}`)

      if (stock.amount > 0) {

        const hasProductInCart = cart.some(elemt => elemt.id === data.id);
        if (hasProductInCart) {
          const products = cart.map(product => {
            if (product.id === data.id) {
              return { ...product, amount: product.amount + 1 }
            }
            return product
          })
          setCart(products)
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(products))
        }
        else {
          const products = [...cart, { ...data, amount: 1 }]
          setCart(products);
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(products))
        }
      }
      else {
        toast.error('Quantidade solicitada fora de estoque')
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const hasProductInCart = cart.some(elemt => elemt.id === productId);

      if (hasProductInCart) {
        const products = cart.filter(product => product.id !== productId)
        setCart(products);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(products))
      }

      else {
        toast.error('Erro na remoção do produto');
      }

    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const { data: stock } = await api.get(`http://localhost:3333/stock/${productId}`)

      if (stock.amount > 0) {
        const products = cart.map(product => {
          if (product.id === productId) {
            return { ...product, amount: product.amount + amount }
          }
          return product
        })
        setCart(products)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(products))
      }
      else {
        toast.error('Quantidade solicitada fora de estoque');
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
