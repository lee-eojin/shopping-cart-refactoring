import { useState } from "react";
import useProducts from "./useProducts";

export default function ProductSection() {
  const { products, addProduct, deleteProduct, error } = useProducts();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = async () => {
    await addProduct({ name: name, price: Number(price) });
    setName("");
    setPrice("");
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="상품명" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="가격" type="number" />
      <button onClick={handleAdd}>추가</button>
      {error && <p>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — {product.price.toLocaleString()}원
            <button onClick={() => deleteProduct(product.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
