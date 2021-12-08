const check = require('../check');

describe('check', () => {
  let onSuccess;
  let onFail;

  beforeEach(() => {
    onSuccess = jest.fn();
    onFail = jest.fn();
  });

  it('should call onSuccess when predicate is true', () => {
    check(() => true, onSuccess, onFail);

    // onSuccess의 mock 데이터의 호출 횟수
    // expect(onSuccess.mock.calls.length).toBe(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);

    // onSuccess의 mock 데이터의 0번째 호출 함수의 0번째 파라미터
    expect(onSuccess.mock.calls[0][0]).toBe('yes');

    // expect(onFail.mock.calls.length).toBe(0);
    expect(onFail).toHaveBeenCalledTimes(0);
  });

  it('should call onFail when predicate is false', () => {
    check(() => false, onSuccess, onFail);

    expect(onFail).toHaveBeenCalledTimes(1);
    expect(onFail).toHaveBeenCalledWith('no');
    expect(onSuccess).toHaveBeenCalledTimes(0);
  });
});
