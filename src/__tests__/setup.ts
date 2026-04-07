import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from 'msw/node'
import { handlers } from "../mocks/handlers";
import { fetch, Request, Response, Headers } from 'cross-fetch';

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;


export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error'}));

afterAll(() => server.close())

afterEach(() => server.resetHandlers());