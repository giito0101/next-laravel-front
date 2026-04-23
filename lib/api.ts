const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type Skill = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  area: string;
};

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    // cookie認証してないなら不要。必要になったらコメント外す
    // credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(`GET ${path} failed: ${res.status} ${text}`, res.status);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<TBody, TRes>(
  path: string,
  body: TBody,
): Promise<TRes> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(
      `POST ${path} failed: ${res.status} ${text}`,
      res.status,
    );
  }
  return res.json() as Promise<TRes>;
}
