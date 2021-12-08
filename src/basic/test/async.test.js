const fetchProduct = require('../async');

describe('product', () => {
  it('async - done', (done) => {
    fetchProduct().then((item) => {
      expect(item).toEqual({ item: 'Milk', price: 200 });
      done(); // 콜백 실행 전 테스트 종료 방지
    });
  });

  it('async - return', () => {
    return fetchProduct().then((item) => {
      expect(item).toEqual({ item: 'Milk', price: 200 });
    });
  });

  it('async - await', async () => {
    const product = await fetchProduct();
    expect(product).toEqual({ item: 'Milk', price: 200 });
  });

  it('async - resolves', () => {
    return expect(fetchProduct()).resolves.toEqual({ item: 'Milk', price: 200 });
  });

  it('async - reject', () => {
    return expect(fetchProduct('error')).rejects.toBe('network error');
  });
});
