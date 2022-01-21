class StubUserClient {
  async login(id, password) {
    return { id, password };
  }
}
module.exports = StubUserClient;
