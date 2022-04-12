import { MdAddShoppingCart } from 'react-icons/md';

interface ProductProps {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
    priceFormatted: string;
  };
  onAddProductCart: (id: number) => void;
}

export function Product({ product, onAddProductCart }: ProductProps) {
  return (
    <li>
      <img src={product.image} alt={product.title} />
      <strong>{product.title}</strong>
      <span>{product.priceFormatted}</span>
      <button
        type="button"
        data-testid="add-product-button"
        onClick={() => onAddProductCart(product.id)}
      >
        <div data-testid="cart-product-quantity">
          <MdAddShoppingCart size={16} color="#FFF" />
          {/* {cartItemsAmount[product.id] || 0} */} 2
        </div>

        <span>ADICIONAR AO CARRINHO</span>
      </button>
    </li>
  )
}