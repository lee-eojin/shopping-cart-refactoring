import type { Product } from "../types/product";

export const requestGetProducts = async () => {
  const response = await fetch("/products", {
    method: "GET",
  });
  return response.json();
};

export const requestAddProduct = async ({ name, price }: Omit<Product, "id">) => {
  const response = await fetch("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price }),
  });
  return response.json();
};

export const requestDeleteProduct = async (id: number) => {
  await fetch(`/products/${id}`, { method: "DELETE" });
};
