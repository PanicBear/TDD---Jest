const UserService = require('../user_service');
const StubUserClient = require('./stub_user_client');

describe('userService login() - stub', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService(new StubUserClient());
  });

  it('should logged in without userdata', async () => {
    await userService.login('id', 'login');
    return expect(userService.isLoggedIn).toBe(true);
  });

  it('should fail to login with userdata', async () => {
    await userService.login('id', 'login');
    return expect(await userService.login('id', 'login')).toBe(undefined);
  });
});
