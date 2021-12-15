class StubProductClient {
  async fetchItems() {
    return [
      { item: 'milk', available: true },
      { item: 'bananba', available: false },
    ];
  }
}
module.exports = StubProductClient;
