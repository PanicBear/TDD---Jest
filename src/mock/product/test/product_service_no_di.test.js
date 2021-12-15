const ProductService = require('../product_service_no_di');
const ProductClient = require('../product_client');
jest.mock('../product_client'); // 모듈 전체를 mock처리

describe('ProductService', () => {
  // 모듈에 사용되는 함수를 mock 함수로 구현
  const fetchItems = jest.fn(async () => [
    { item: 'milk', available: true },
    { item: 'bananba', available: false },
  ]);

  ProductClient.mockImplementation(() => {
    return {
      fetchItems,
    };
  });

  let productService;

  beforeEach(() => {
    productService = new ProductService();
    // jest.config.js에서 clearMocks가 false일 경우 모든 테스트 시작 전 mock 초기화 필요
    // fetchItems.mockClear();
    // ProductClient.mockClear();
  });

  it('should filter out only available items', async () => {
    const items = await productService.fetchAvailableItems();
    expect(items.length).toBe(1);
    expect(items).toEqual([{ item: 'milk', available: true }]);
  });

  it('test', async () => {
    const items = await productService.fetchAvailableItems();
    expect(fetchItems).toHaveBeenCalledTimes(1);
  });
});
