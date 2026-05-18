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
  imageUrl?: string | null;
};

export type SkillListResponse = {
  current_page: number;
  data: Skill[];
  last_page: number;
  total: number;
};

export type SkillReview = {
  id: string;
  owner?: {
    id: string;
    name: string;
  } | null;
  rating: number;
  comment?: string | null;
  createdAt: string;
};

export type SkillDetail = Skill & {
  owner?: {
    id: string;
    name: string;
  } | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  reviews?: SkillReview[] | null;
};

export type SkillDetailResponse = {
  data: SkillDetail;
};

export type SkillReviewsResponse = {
  data: SkillReview[];
};

export type SkillReviewResponse = {
  data: SkillReview;
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
  init?: RequestInit,
): Promise<TRes> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
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
