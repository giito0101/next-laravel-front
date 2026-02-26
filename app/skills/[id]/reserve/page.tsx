"use client";

import { use, useState } from "react";
import Link from "next/link";
import { apiPost } from "@/lib/api";

type ReservationCreateResponse = { data: { id: string } }; // 実レスポンスに合わせて調整

export default function ReservePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [startAt, setStartAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      // ここはLaravelの期待ボディに合わせてキー名を揃える
      const res = await apiPost<{ startAt: string }, ReservationCreateResponse>(
        `/skills/${id}/reservations`,
        { startAt },
      );
      setMsg(`予約を作成しました: ${res.data.id}`);
    } catch (err: any) {
      setMsg(err?.message ?? "予約に失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>予約作成</h1>

      <form
        onSubmit={onSubmit}
        style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 360 }}
      >
        <label>
          希望日時
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginTop: 6 }}
          />
        </label>

        <button disabled={busy} type="submit">
          {busy ? "送信中…" : "予約する"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 16 }}>{msg}</p>}

      <div style={{ marginTop: 24 }}>
        <Link href={`/skills/${id}`}>← 詳細へ戻る</Link>
      </div>
    </main>
  );
}
