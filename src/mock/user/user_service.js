class UserService {
  constructor(userClient) {
    this.userClient = userClient;
    this.isLoggedIn = false;
  }

  login(id, password) {
    if (!this.isLoggedIn) {
      // client와 서비스를 분리하여 단위테스트를 가능하도록 함
      return this.userClient.login(id, password).then((data) => {
        this.isLoggedIn = true;
      });
    }
  }
}
module.exports = UserService;
