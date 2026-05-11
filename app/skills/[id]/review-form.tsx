"use client";

import { useState } from "react";

const ratingOptions = [
  { label: "評価を選択", value: "" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

export function ReviewForm() {
  const [isOpen, setIsOpen] = useState(false);

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
          レビューを投稿する
        </button>
      </div>

      {isOpen ? (
        <form className="mt-6 grid gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">評価</span>
            <select
              name="rating"
              defaultValue=""
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

          <p className="text-sm text-slate-500">
            エラーがある場合は、このフォームの下に表示されます。
          </p>
        </form>
      ) : null}
    </section>
  );
}
