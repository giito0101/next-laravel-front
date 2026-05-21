"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, use, useEffect, useState } from "react";
import { apiGet, apiPost, SkillDetailResponse } from "@/lib/api";

type ReservationCreateBody = {
  skillId: string;
  date: string;
  message: string;
};

type ReservationCreateResponse = {
  data: {
    id: string;
  };
};

export default function ReservePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [skillTitle, setSkillTitle] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    apiGet<SkillDetailResponse>(`/skills/${id}`)
      .then((response) => {
        if (isActive) {
          setSkillTitle(response.data.title);
        }
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage("スキル情報を取得できませんでした。");
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage(null);
    setBusy(true);

    try {
      await apiPost<ReservationCreateBody, ReservationCreateResponse>(
        `/skills/${id}/reservations`,
        {
          skillId: id,
          date,
          message,
        },
      );

      router.push(`/skills/${id}?reserved=1`);
    } catch {
      setErrorMessage("予約に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3fbf9_0%,#f8f4ec_48%,#fffdf9_100%)] px-5 py-8 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/skills/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-teal-700"
        >
          ← 詳細へ戻る
        </Link>

        <section className="mt-5 overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
                Reservation
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                予約作成
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                希望日時と任意のメッセージを入力して、予約を送信します。
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
              <div className="text-xs uppercase tracking-[0.18em] text-teal-200">
                Skill ID
              </div>
              <div className="mt-1 text-sm font-semibold">{id}</div>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] bg-slate-50/90 p-5 ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">タイトル</p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              {skillTitle || "読み込み中..."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 grid gap-5">
            <input name="skillId" type="hidden" value={id} readOnly />

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">希望日時</span>
              <input
                type="datetime-local"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">メッセージ</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={2000}
                rows={7}
                className="resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </label>

            {errorMessage && (
              <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {busy ? "送信中..." : "予約する"}
              </button>

              <Link
                href={`/skills/${id}`}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                キャンセル
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
