const ProductService = require('../product_service');
// 클라이언트를 테스트용 클라이언트로 교체
const StubProductClient = require('../test/stub_product_client');

describe('ProductService - Stub', () => {
  let productService;

  beforeEach(() => {
    productService = new ProductService(new StubProductClient());
  });

  it('should filter out only available items', async () => {
    const items = await productService.fetchAvailableItems();
    expect(items.length).toBe(1);
    expect(items).toEqual([{ item: 'milk', available: true }]);
  });
});
