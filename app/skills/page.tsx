import Link from "next/link";
import { apiGet, SkillListResponse } from "@/lib/api";

type SearchParams = Promise<{
  q?: string | string[];
  category?: string | string[];
  area?: string | string[];
  page?: string | string[];
}>;

function pickFirst(value?: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function buildSkillListPath(params: {
  q?: string;
  category?: string;
  area?: string;
  page?: number;
}): string {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.area) {
    searchParams.set("area", params.area);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const query = searchParams.toString();

  return query ? `/skills?${query}` : "/skills";
}

function createApiPath(params: {
  q: string;
  category: string;
  area: string;
  page: string;
}): string {
  const normalizedKeyword = params.q.trim();
  const normalizedCategory = params.category.trim();
  const normalizedArea = params.area.trim();
  const normalizedPage = params.page.trim();

  return buildSkillListPath({
    q: normalizedKeyword.length >= 1 ? normalizedKeyword : undefined,
    category: normalizedCategory || undefined,
    area: normalizedArea || undefined,
    page: normalizedPage ? Number(normalizedPage) : undefined,
  });
}

function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ENGLISH: "English",
    DOG_TRAINING: "Dog Training",
    PC_SUPPORT: "PC Support",
    PHOTO: "Photo",
    OTHER: "Other",
  };

  return labels[category] ?? category;
}

export default async function SkillsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const q = pickFirst(resolvedSearchParams?.q);
  const category = pickFirst(resolvedSearchParams?.category);
  const area = pickFirst(resolvedSearchParams?.area);
  const page = pickFirst(resolvedSearchParams?.page);

  const apiPath = createApiPath({ q, category, area, page });
  const res = await apiGet<SkillListResponse>(apiPath);
  const skills = res.data ?? [];

  const previousPageHref = buildSkillListPath({
    q: q.trim() || undefined,
    category: category.trim() || undefined,
    area: area.trim() || undefined,
    page: Math.max(res.current_page - 1, 1),
  });

  const nextPageHref = buildSkillListPath({
    q: q.trim() || undefined,
    category: category.trim() || undefined,
    area: area.trim() || undefined,
    page: res.current_page + 1,
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3fbf9_0%,#f8f4ec_48%,#fffdf9_100%)] px-5 py-8 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
                Skill Marketplace
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                学びたいことを、
                <span className="block text-teal-700">見つけやすい一覧画面へ。</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                キーワード、カテゴリ、エリアで絞り込みながら、自分に合うスキルを探せます。
              </p>
            </div>

            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-[0_16px_40px_rgba(15,23,42,0.22)]">
              <div className="text-xs uppercase tracking-[0.22em] text-teal-200">
                Search Result
              </div>
              <div className="mt-2 text-3xl font-semibold">{res.total}</div>
              <div className="text-sm text-slate-300">matching skills</div>
            </div>
          </div>

          <form action="/skills" className="mt-8 grid gap-4 rounded-[28px] bg-slate-50/90 p-5 ring-1 ring-slate-200 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_auto]">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">キーワード</span>
              <input
                defaultValue={q}
                name="q"
                type="text"
                placeholder="例: Laravel, 英会話, UIレビュー"
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">カテゴリ</span>
              <select
                defaultValue={category}
                name="category"
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              >
                <option value="">すべて</option>
                <option value="ENGLISH">English</option>
                <option value="DOG_TRAINING">Dog Training</option>
                <option value="PC_SUPPORT">PC Support</option>
                <option value="PHOTO">Photo</option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">エリア</span>
              <input
                defaultValue={area}
                name="area"
                type="text"
                placeholder="例: Tokyo"
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <div className="flex flex-col justify-end gap-3 sm:flex-row xl:flex-col">
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                検索
              </button>
              <Link
                href="/skills"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                クリア
              </Link>
            </div>
          </form>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                スキル一覧
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {res.current_page} / {res.last_page} ページ
              </p>
            </div>
          </div>

          {skills.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white/75 p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-lg font-medium text-slate-900">
                条件に合うスキルが見つかりませんでした
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                キーワードやエリアを変えるか、条件をクリアしてもう一度探してみてください。
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/skills/${skill.id}`}
                  className="group flex h-full flex-col rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(20,184,166,0.18)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                        {categoryLabel(skill.category)}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-teal-700">
                        {skill.title}
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                      ¥{skill.price}
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                    {skill.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                    <span>{skill.area}</span>
                    <span className="font-medium text-slate-900">詳細を見る</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="text-sm text-slate-600">
              {res.total}件中{" "}
              <span className="font-semibold text-slate-950">{skills.length}</span>
              件を表示
            </div>

            <div className="flex items-center gap-3">
              {res.current_page > 1 ? (
                <Link
                  href={previousPageHref}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  前へ
                </Link>
              ) : (
                <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-medium text-slate-400">
                  前へ
                </span>
              )}

              {res.current_page < res.last_page ? (
                <Link
                  href={nextPageHref}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  次へ
                </Link>
              ) : (
                <span className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-200 px-4 text-sm font-medium text-slate-400">
                  次へ
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
