import { Fetcher } from "../lib/fetcher";

export const httpClient = new Fetcher(
  new URL('https://jsonplaceholder.typicode.com'),
  {},
);
