import Link from "next/link";
import { apiGet, ReservationsResponse } from "@/lib/api";
import { currentProviderId } from "@/lib/current-user";

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "承認待ち",
    CONFIRMED: "確定",
    CANCELED: "キャンセル",
  };

  return labels[status] ?? status;
}

export default async function MyReservationsPage() {
  const response = await apiGet<ReservationsResponse>("/reservations/my", {
    headers: {
      "X-User-Id": currentProviderId,
    },
  });
  const reservations = response.data;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3fbf9_0%,#f8f4ec_48%,#fffdf9_100%)] px-5 py-8 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/skills"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-teal-700"
        >
          ← スキル一覧へ戻る
        </Link>

        <section className="mt-5 overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
                Reservations
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                予約一覧
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                自分が作成したスキルに入った予約を確認できます。
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
              <div className="text-xs uppercase tracking-[0.18em] text-teal-200">
                User ID
              </div>
              <div className="mt-1 text-sm font-semibold">{currentProviderId}</div>
            </div>
          </div>
        </section>

        {reservations.length === 0 ? (
          <section className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white/75 p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-lg font-medium text-slate-900">
              まだ予約はありません
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              自分のスキルに予約が入ると、ここに表示されます。
            </p>
          </section>
        ) : (
          <section className="mt-8 grid gap-5">
            {reservations.map((reservation) => (
              <article
                key={reservation.id}
                className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.08)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                      {statusLabel(reservation.status)}
                    </div>
                    <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                      {reservation.skill?.title ?? reservation.skill_id}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      予約者: {reservation.owner?.name ?? reservation.owner_id}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
                    {formatDateTime(reservation.date)}
                  </div>
                </div>

                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {reservation.message?.trim()
                    ? reservation.message
                    : "メッセージはありません。"}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
