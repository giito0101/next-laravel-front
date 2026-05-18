"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiPost, SkillReviewResponse } from "@/lib/api";

const ratingOptions = [
  { label: "評価を選択", value: "" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

const demoUserId = process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "provider-pc-1";

type SubmitStatus =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function ReviewForm({ skillId }: { skillId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>({
    type: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const rating = Number(formData.get("rating"));
    const comment = String(formData.get("comment") ?? "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setStatus({
        type: "error",
        message: "評価を選択してください。",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      await apiPost<
        { rating: number; comment: string | null },
        SkillReviewResponse
      >(
        `/skills/${skillId}/reviews`,
        {
          rating,
          comment: comment === "" ? null : comment,
        },
        {
          headers: {
            "X-User-Id": demoUserId,
          },
        },
      );

      form.reset();
      setStatus({
        type: "success",
        message: "レビューを投稿しました。",
      });
      router.refresh();
    } catch {
      setStatus({
        type: "error",
        message: "レビューを投稿できませんでした。",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="review-form"
      className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
            Review
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            レビューを投稿する
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            受講後の感想や学びを共有できます。
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOpen((current) => !current);
          }}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {isOpen ? "入力フォームを閉じる" : "入力フォームを開く"}
        </button>
      </div>

      {isOpen ? (
        <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">評価</span>
            <select
              name="rating"
              defaultValue=""
              required
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              {ratingOptions.map((option) => (
                <option key={option.value || "empty"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">コメント</span>
            <textarea
              name="comment"
              rows={5}
              maxLength={2000}
              placeholder="コメントを入力"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-teal-700 px-5 text-sm font-medium text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "投稿中..." : "レビューを投稿する"}
          </button>

          {status.message ? (
            <p
              className={
                status.type === "success"
                  ? "text-sm font-medium text-teal-700"
                  : "text-sm font-medium text-rose-600"
              }
            >
              {status.message}
            </p>
          ) : null}
        </form>
      ) : null}
    </section>
  );
}
