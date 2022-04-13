import React from 'react';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';

import { ProductCart } from '../../components/ProductCart'

import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => {
    return {
      ...product,
      priceFormatted: formatPrice(product.price),
      subTotal: formatPrice(product.price * product.amount)
    }
  })
  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        return sumTotal + product.amount * product.price
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    updateProductAmount({
      amount: 1,
      productId: product.id
    })
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({
      amount: -1,
      productId: product.id
    })
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map(formatted => {
            return (
              <ProductCart key={formatted.id} onProductDecrement={handleProductDecrement} onProductIncrement={handleProductIncrement} onRemoveProduct={handleRemoveProduct} product={formatted} />
            )
          })}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
