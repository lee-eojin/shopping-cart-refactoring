// src/ProductPage.tsx  — 모든 게 여기 있다
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleAdd = async () => {
    if (name.length === 0 || name.length > 100) {
      setError("상품명은 1~100자여야 합니다");
      return;
    }
    if (Number(price) <= 0) {
      setError("가격은 0보다 커야 합니다");
      return;
    }
    setError("");
    const res = await fetch("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price) }),
    });
    const product = await res.json();
    setProducts((prev) => [...prev, product]);
    setName("");
    setPrice("");
  };

  const handleDelete = async (id: number) => {
    await fetch(`/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="상품명"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="가격"
        type="number"
      />
      <button onClick={handleAdd}>추가</button>
      {error && <p>{error}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — {product.price.toLocaleString()}원
            <button onClick={() => handleDelete(product.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
