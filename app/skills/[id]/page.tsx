import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ApiError,
  apiGet,
  SkillDetailResponse,
  SkillReview,
} from "@/lib/api";
import { ReviewForm } from "./review-form";
import { SkillImage } from "./skill-image";

function formatPrice(price: number): string {
  return `¥${price.toLocaleString("ja-JP")}`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function ratingLabel(rating: number): string {
  return `${rating.toFixed(1)} / 5`;
}

function fallbackAverageRating(skillAverageRating?: number | null): number {
  if (typeof skillAverageRating === "number") {
    return skillAverageRating;
  }

  return 0;
}

function fallbackReviewCount(skillReviewCount?: number | null, reviewLength = 0): number {
  if (typeof skillReviewCount === "number") {
    return skillReviewCount;
  }

  return reviewLength;
}

function ReviewCard({ review }: { review: SkillReview }) {
  return (
    <article className="rounded-[24px] border border-slate-100 bg-slate-50/85 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-950">
            {review.owner?.name ?? "投稿者未設定"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {formatDate(review.createdAt)}
          </p>
        </div>
        <div className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
          {review.rating} / 5
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {review.comment?.trim() ? review.comment : "コメントはまだありません。"}
      </p>
    </article>
  );
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiGet<SkillDetailResponse>(`/skills/${id}`).catch((err) => {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }

    throw err;
  });
  const skill = res.data;
  const reviews = skill.reviews ?? [];
  const averageRating = fallbackAverageRating(skill.averageRating);
  const reviewCount = fallbackReviewCount(skill.reviewCount, reviews.length);
  const ownerName = skill.owner?.name ?? "未設定";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3fbf9_0%,#f8f4ec_48%,#fffdf9_100%)] px-5 py-8 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/skills"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-teal-700"
        >
          ← 一覧へ戻る
        </Link>

        <section className="mt-5 overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="order-2 p-6 sm:p-8 lg:order-1 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  {skill.area}
                </span>
                <span className="inline-flex rounded-full bg-slate-950 px-4 py-1 text-sm font-semibold text-white">
                  {formatPrice(skill.price)}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {skill.title}
              </h1>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-8 text-slate-600 sm:text-base">
                {skill.description}
              </p>

              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] bg-slate-50/90 p-4 ring-1 ring-slate-200">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    スキル作成者
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-950">
                    {ownerName}
                  </dd>
                </div>

                <div className="rounded-[24px] bg-slate-50/90 p-4 ring-1 ring-slate-200">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    平均評価
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-950">
                    {ratingLabel(averageRating)}
                  </dd>
                </div>

                <div className="rounded-[24px] bg-slate-50/90 p-4 ring-1 ring-slate-200">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    レビュー数
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-950">
                    {reviewCount}件
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/skills/${skill.id}/reservations`}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  このスキルを予約する
                </Link>

                <a
                  href="#review-form"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  レビューを投稿する
                </a>
              </div>
            </div>

            <div className="order-1 min-h-[280px] bg-slate-100 lg:order-2 lg:min-h-full">
              <SkillImage alt={`${skill.title} の画像`} src={skill.imageUrl} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
                  Reviews
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  受講者のレビュー
                </h2>
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-right text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-teal-200">
                  Rating
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {ratingLabel(averageRating)}
                </div>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/85 p-8 text-center">
                <p className="text-base font-medium text-slate-900">
                  まだレビューは投稿されていません
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  最初の受講者レビューを投稿して、このスキルの魅力を伝えましょう。
                </p>
              </div>
            )}
          </div>

          <ReviewForm />
        </section>
      </div>
    </main>
  );
}
