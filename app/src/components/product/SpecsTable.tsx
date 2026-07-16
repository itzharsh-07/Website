import type { Product } from '../../types/product';
import styles from './SpecsTable.module.css';

export default function SpecsTable({ product: p }: { product: Product }) {
  const rows: [string, string][] = [
    ['Material', p.material],
    ['Color', p.color],
    ['Dimensions', `${p.dimensions.width}"W x ${p.dimensions.depth}"D x ${p.dimensions.height}"H`],
    ['Weight', p.weight],
    ['Warranty', p.warranty],
    ['Shipping', p.shippingInfo],
    ['SKU', p.sku],
  ];

  return (
    <table className={styles.table}>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th>{label}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
