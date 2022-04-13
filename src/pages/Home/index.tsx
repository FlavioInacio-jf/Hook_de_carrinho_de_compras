import React, { useState, useEffect } from 'react';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Product } from '../../components/Product';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    return { ...sumAmount, [product.id]: product.amount }
  }, {} as CartItemsAmount)


  useEffect(() => {
    async function loadProducts() {
      await api.get('http://localhost:3333/products').then(({ data }) => {
        const productsFormatted = data.map((product: Product) => {
          return {
            ...product,
            priceFormatted: formatPrice(product.price)
          }
        })
        setProducts(productsFormatted);
      })
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map(product => (
        <Product key={product.id} product={product} onAddProductCart={handleAddProduct} cartItemsAmount={cartItemsAmount} />
      ))}
    </ProductList>
  );
};

export default Home;
