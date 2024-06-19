export interface FetcherResponse<T> {
  data: T | null;
  status: number;
  statusText: string;
}

export class Fetcher {
  private readonly _baseURL: URL;
  private readonly _headers: Record<string, string>;

  constructor(baseURL: URL, headers: Record<string, string>) {
    this._baseURL = baseURL;
    this._headers = headers;
  }

  public async get<T>(url: string, headers?: Record<string, string>) {
    return this._processResponse<T>(
      fetch(new URL(url, this._baseURL), {
        headers: { ...this._headers, ...(headers ?? {}) },
      }),
    );
  }

  public async post<T>(url: string, body?: Record<string, unknown> | FormData, headers?: Record<string, string>) {
    return this._processResponse<T>(
      fetch(new URL(url, this._baseURL), {
        method: 'POST',
        headers: { ...this._headers, ...(headers ?? {}) },
        body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
      }),
    );
  }

  public async put<T>(url: string, body?: Record<string, unknown>) {
    return this._processResponse<T>(
      fetch(new URL(url, this._baseURL), {
        method: 'PUT',
        headers: this._headers,
        body: body ? JSON.stringify(body) : undefined,
      }),
    );
  }

  public async delete<T>(url: string) {
    return this._processResponse<T>(
      fetch(new URL(url, this._baseURL), {
        method: 'DELETE',
        headers: this._headers,
      }),
    );
  }

  public async patch<T>(url: string, body?: Record<string, unknown>) {
    return this._processResponse<T>(
      fetch(new URL(url, this._baseURL), {
        method: 'PATCH',
        headers: this._headers,
        body: body ? JSON.stringify(body) : undefined,
      }),
    );
  }

  private async _processResponse<T>(responsePromise: Promise<Response>): Promise<FetcherResponse<T>> {
    const response = await responsePromise;
    const responseText = response.ok ? await response.text() : '';
    const data = responseText ? (JSON.parse(responseText) as T) : null;
    return { data, status: response.status, statusText: response.statusText };
  }
}
