import { jwks } from "./helpers/auth";
import { beforeEach, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

const fetchMock = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.mockIf(
    "https://quanghuy1242.us.auth0.com/.well-known/jwks.json",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_) => {
      return {
        status: 200,
        body: JSON.stringify(jwks),
      };
    },
  );
});
