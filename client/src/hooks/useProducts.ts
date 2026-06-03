import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types/product";
import { validateProduct } from "../utils/validateProduct";
import { requestGetProducts, requestAddProduct, requestDeleteProduct } from "../api/productApi";

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const fetcher = useCallback(async () => {
    const response = await requestGetProducts();
    setProducts(response);
  }, []);

  const addProduct = useCallback(
    async ({ name, price }: Omit<Product, "id">) => {
      try {
        validateProduct(name, price);
        setError("");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          return;
        }
      }
      await requestAddProduct({ name, price });
      fetcher();
    },
    [fetcher],
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      await requestDeleteProduct(id);
      fetcher();
    },
    [fetcher],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetcher();
  }, [fetcher]);

  return {
    products,
    addProduct,
    deleteProduct,
    error,
  };
}
