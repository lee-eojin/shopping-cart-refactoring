export const validateProduct = (name: string, price: number) => {
  if (name.length === 0 || name.length > 100) {
    throw new Error("상품명은 1~100자여야 합니다");
  }
  if (Number(price) <= 0) {
    throw new Error("가격은 0보다 커야 합니다");
  }
  return true;
};
