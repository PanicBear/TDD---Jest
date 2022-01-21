# 유닛테스트(Jest 사용법)

## 레포지토리 정보

- 메모: Mock 구현방법, Stub과의 차이
- 복습: No
- 수강일: 2022년 1월 21일
- 유형: 실습
- 참고자료 및 링크: https://jestjs.io/docs/getting-started

## 유닛 테스트의 구성

- Test Runner
  - 테스트를 실행 후 결과 보고
- Assertion
  - 테스트 코드 내부에서 예상 결과와 실제 결과의 비교 실행
- 라이브러리 종류
  - Test Runner
    - Mocha
  - Assertion
    - Chai
    - expect.js
    - better-assert
  - 통합
    - Jest

## Jest

- 환경설정

  - 공식 도큐먼트 [Get Started](https://jestjs.io/docs/getting-started) 참조
  - 설치
    ```bash
    npm init --yes
    npm install jest --global
    npm install --save-dev jest
    npm install @types/jest // 자동완성, 타입정보
    ```
  - 실행 결과

    - collectCoverage = true 인 경우
      - 테스트 코드의 파일별 커버리지를 표로 출력

  - 테스트 코드 변경 시 전체 갱신

    - package.json에서 스크립트를 'jest —watchAll'로 변경
    - 이는 프로젝트가 커질 경우 전체 파일 갱신으로 늦어짐

  - 테스트 코드 변경 시 수정 한 파일만 갱신

    - package.json에서 스크립트를 'jest —watch'로 변경
    - 단, 이 경우 git을 사용해야한다
      - 다른 파일 커밋 후 jest —watch 실행 시 수정하는 파일에 대해서만 테스트 진행

  - 테스트 명 미출력 해결방법

    - jest에 —verbose 추가

## 유닛 테스트 기초

- 각 테스트의 독립성을 유지하는 것이 중요하다

  - 서로다른 테스트를 묶으려면 describe(str, ()⇒{})
    - describe는 중첩가능
  - 공통 변수 선언 시 beforeEach
    - 각 테스트 시작 전 호출
    - 공통 사용 변수 등을 이곳에서 초기화
  - beforeAll은 테스트 코드 시작 전이라 아예 다른 것(각 테스트에 초기화 안됨)

  - 비동기 코드 실행 방법

    ```js
    interface It{(name: string, fn?: ProvidesCallback, timeout?: number): void; ... }
    type ProvidesCallback = ((cb: DoneCallback) => void | undefined) | (() => Promise<unknown>);
    ```

    1. 콜백이 끝남을 알려주는 DoneCallback을 파라미터로 전달 후, 종료 시점에서 호출
    2. 파라미터 없이 프로미스 자체를 반환

       ```js
       describe("product", () => {
         it("async - done", (done) => {
           fetchProduct().then((item) => {
             expect(item).toEqual({ item: "Milk", price: 200 });
             done(); // 콜백 실행 전 테스트 종료 방지
           });
         });

         it("async - return", () => {
           return fetchProduct().then((item) => {
             expect(item).toEqual({ item: "Milk", price: 200 });
           });
         });

         it("async - await", async () => {
           const product = await fetchProduct();
           expect(product).toEqual({ item: "Milk", price: 200 });
         });
       });
       ```

    - 두 방식 모두 정상적으로 작동하나, 성능 상 프로미스 리턴 방식을 사용할 것

  - 프로미스 resolve, reject 테스트

    ```jsx
    it("async - resolves", () => {
      return expect(fetchProduct()).resolves.toEqual({
        item: "Milk",
        price: 200,
      });
    });

    it("async - reject", () => {
      return expect(fetchProduct("error")).rejects.toBe("network error");
    });
    ```

## Mock 코드 실습

  - 함수 구현없이 간편하게 테스트 가능
    - 호출 횟수
    - 호출 시 사용된 파라미터
  - 피해야하는 사용법
    - 단위테스트로 모듈 간의 상호작용이 테스트 되는 경우
  - Mock과 Stub의 차이
    - Mock
      - 구현사항이 없다
      - 실제 코드를 대체할 수 없음
    - Stub
      - 실제 코드와 대체 가능
      - 더미 데이터



## Mock과 Stub의 차이, 활용 방안

- Stub
  - 실제 구현체를 가진 더미데이터
  - 유닛테스트에 필요하지 않은 구현체를 더미데이터로 교체
  - 유닛 내부에 종속성이 존재할 경우 사용할 수 없다(DI가 적용되지 않은 경우)
    - 해당 코드가 유닛테스트에 적합하지 않은 것
      ```jsx
      // DI => Stub 적용가능
      class Service {
        constructor(client) {
          this.client = client;
        }
      }
      const service = new Service(new StubClient());
      ```
      ```jsx
      // DI X => Stub 적용불가
      // 애초에 단위테스트가 가능한 코드가 아님
      class Service {
        constructor() {
          this.client = new Client(); //
        }
      }
      ```
- Mock

  - 구현체를 흉내(Mocking)내는 함수
  - 유닛테스트에 필요하지 않은 구현체를 Mock 함수로 교체
  - **호출 횟수, 파라미터 ,결과 등 함수 자체의 정보를 반환할 수 있다(가장 큰 차이)**
  - 유닛테스트에 필요하지 않은 구현체가 해당 유닛 내에 존재하는 경우에도 유닛테스트가 가능하다

    - 이경우, 좋은 코드가 아니기에 꼭 DI를 적용할 것

      ```jsx
      const UserService = require("../user_service");
      const UserClient = require("../user_client");

      jest.mock("../user_client");

      describe("UserService", () => {
        const login = jest.fn(async () => "success");
        UserClient.mockImplementation(() => {
          return {
            login,
          };
        });
        let userService;

        beforeEach(() => {
          userService = new UserService(new UserClient());
          // jest.clearAllMocks();
        });

        it("calls login() on UserClient when tries to login", async () => {
          await userService.login("abc", "abc");
          expect(login).toHaveBeenCalledTimes(1);
          expect(login).toHaveBeenCalledWith("abc", "abc");
        });

        it("should not call login() on UserClient again if already logged in", async () => {
          await userService.login("abc", "abc");
          await userService.login("abc", "abc");

          expect(login.mock.calls.length).toBe(1);
          expect(login).toHaveBeenCalledTimes(1);
        });
      });
      ```
