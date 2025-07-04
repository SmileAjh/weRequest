import setSession from "../../src/api/setSession";
import getSession from "../../src/api/getSession";

describe("set Session", () => {
  test("session value is correct", () => {
    const someSession = {'sid': 'sample'};
    setSession(someSession);
    const session = getSession();
    expect(session.sid).toBe(someSession.sid);
  });
});
