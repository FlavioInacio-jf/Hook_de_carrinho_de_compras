import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

interface ProductType {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
  subTotal: string;
  priceFormatted: string;
}

interface ProductCartProps {
  product: ProductType;

  onProductIncrement: (product: Omit<ProductType, 'subtoal' | 'priceFormatted'>) => void;

  onProductDecrement: (product: Omit<ProductType, 'subtoal' | 'priceFormatted'>) => void;

  onRemoveProduct: (productId: number) => void;

}

export const ProductCart = ({ product, onProductIncrement, onProductDecrement, onRemoveProduct }: ProductCartProps) => {
  const { id, title, image, subTotal, priceFormatted, amount } = product;

  return (
    <tr data-testid="product">
      <td>
        <img src={image} alt={title} />
      </td>
      <td>
        <strong>{title}</strong>
        <span>{priceFormatted}</span>
      </td>
      <td>
        <div>
          <button
            type="button"
            data-testid="decrement-product"
            disabled={amount <= 1}
            onClick={() => onProductDecrement(product)}
          >
            <MdRemoveCircleOutline size={20} />
          </button>
          <input
            type="text"
            data-testid="product-amount"
            readOnly
            value={amount}
          />
          <button
            type="button"
            data-testid="increment-product"
            onClick={() => onProductIncrement(product)}
          >
            <MdAddCircleOutline size={20} />
          </button>
        </div>
      </td>
      <td>
        <strong>{subTotal}</strong>
      </td>
      <td>
        <button
          type="button"
          data-testid="remove-product"
          onClick={() => onRemoveProduct(id)}
        >
          <MdDelete size={20} />
        </button>
      </td>
    </tr >
  )
}