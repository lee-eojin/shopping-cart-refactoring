import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductSection from "./ProductSection";

beforeEach(() => {
  globalThis.fetch = vi
    .fn()
    .mockImplementation((url: string, options?: RequestInit) => {
      if (url === "/products" && !options?.method) {
        return Promise.resolve({
          json: () => Promise.resolve([{ id: 1, name: "사과", price: 1000 }]),
        });
      }
      if (url === "/products" && options?.method === "POST") {
        const body = JSON.parse(options.body as string);
        return Promise.resolve({
          json: () => Promise.resolve({ id: 2, ...body }),
        });
      }
      if (url.startsWith("/products/") && options?.method === "DELETE") {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });
});

describe("초기 렌더", () => {
  it("서버에서 가져온 상품이 화면에 표시된다", async () => {
    // Given
    render(<ProductSection />);

    // When
    const product = await screen.findByText("사과 — 1,000원");

    // Then
    expect(product).toBeInTheDocument();
  });
});

describe("상품 추가 — 유효성 검사", () => {
  it("상품명을 입력하지 않으면 에러 메시지가 표시된다", async () => {
    const user = userEvent.setup();

    // Given
    render(<ProductSection />);
    await user.type(screen.getByPlaceholderText("가격"), "1000");

    // When
    await user.click(screen.getByText("추가"));

    // Then
    expect(screen.getByText("상품명은 1~100자여야 합니다")).toBeInTheDocument();
  });

  it("상품명이 100자를 초과하면 에러 메시지가 표시된다", async () => {
    const user = userEvent.setup();

    // Given
    render(<ProductSection />);
    await user.type(screen.getByPlaceholderText("상품명"), "a".repeat(101));
    await user.type(screen.getByPlaceholderText("가격"), "1000");

    // When
    await user.click(screen.getByText("추가"));

    // Then
    expect(screen.getByText("상품명은 1~100자여야 합니다")).toBeInTheDocument();
  });

  it("가격이 0이면 에러 메시지가 표시된다", async () => {
    const user = userEvent.setup();

    // Given
    render(<ProductSection />);
    await user.type(screen.getByPlaceholderText("상품명"), "배");
    await user.type(screen.getByPlaceholderText("가격"), "0");

    // When
    await user.click(screen.getByText("추가"));

    // Then
    expect(screen.getByText("가격은 0보다 커야 합니다")).toBeInTheDocument();
  });
});

describe("상품 추가 — 성공", () => {
  it("유효한 상품을 추가하면 목록에 나타난다", async () => {
    const user = userEvent.setup();

    // Given
    render(<ProductSection />);
    await user.type(screen.getByPlaceholderText("상품명"), "배");
    await user.type(screen.getByPlaceholderText("가격"), "500");

    // When
    await user.click(screen.getByText("추가"));

    // Then
    expect(await screen.findByText("배 — 500원")).toBeInTheDocument();
  });

  it("상품 추가 후 입력 필드가 초기화된다", async () => {
    const user = userEvent.setup();

    // Given
    render(<ProductSection />);
    await user.type(screen.getByPlaceholderText("상품명"), "배");
    await user.type(screen.getByPlaceholderText("가격"), "500");
    await user.click(screen.getByText("추가"));
    await screen.findByText("배 — 500원");

    // When
    const nameInput = screen.getByPlaceholderText("상품명");
    const priceInput = screen.getByPlaceholderText("가격");

    // Then
    expect(nameInput).toHaveValue("");
    expect(priceInput).toHaveValue(null);
  });
});

describe("상품 삭제", () => {
  it("삭제 버튼을 클릭하면 해당 상품이 목록에서 사라진다", async () => {
    const user = userEvent.setup();

    // Given
    render(<ProductSection />);
    expect(await screen.findByText("사과 — 1,000원")).toBeInTheDocument();

    // When
    await user.click(screen.getByText("삭제"));

    // Then
    expect(screen.queryByText("사과 — 1,000원")).not.toBeInTheDocument();
  });
});
