export const requestGetProducts = async () => {
  const response = await fetch("/products", {
    method: "GET",
  });
  return response.json();
};

export const requestAddProdroduct = async ({ name, price }: { name: string; price: number }) => {
  const response = await fetch("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price }),
  });

  return response.json();
};

export const requestDeleteProdroduct = async (id: number) => {
  const response = await fetch(`/products/${id}`, { method: "DELETE" });
  return response.json();
};

