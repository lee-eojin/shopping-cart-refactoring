import { render, screen, fireEvent } from '@testing-library/react';
import ProductSection from './ProductSection';

beforeEach(() => {
    globalThis.fetch = vi.fn((url: string) => {
        if (url === '/products')
            return Promise.resolve({ json: () => Promise.resolve([]) });
        return Promise.resolve({ json: () => Promise.resolve({}) });
    }) as unknown as typeof fetch;
});

test('상품명이 비어있으면 에러 메시지가 표시된다', async () => {
    render(<ProductSection />);
    fireEvent.click(screen.getByText('추가'));
    expect(screen.getByText('상품명은 1~100자여야 합니다')).toBeInTheDocument();
});
