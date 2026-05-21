import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MyReservationsPage from "./page";
import { apiGet } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  apiGet: vi.fn(),
}));

describe("自分の予約一覧ページ", () => {
  it("所有スキルに入った予約を表示する", async () => {
    vi.mocked(apiGet).mockResolvedValue({
      data: [
        {
          id: "reservation-1",
          owner_id: "demo-customer-1",
          skill_id: "skill-1",
          date: "2026-05-29T16:48:00.000000Z",
          status: "PENDING",
          message: "test",
          created_at: "2026-05-21T07:53:57.000000Z",
          updated_at: "2026-05-21T07:53:57.000000Z",
          owner: {
            id: "demo-customer-1",
            name: "Demo Customer",
          },
          skill: {
            id: "skill-1",
            title: "Laravel API 設計レビュー",
            owner_id: "provider-pc-1",
          },
        },
      ],
    });

    const ui = await MyReservationsPage();
    render(ui);

    expect(apiGet).toHaveBeenCalledWith("/reservations/my", {
      headers: {
        "X-User-Id": "provider-pc-1",
      },
    });
    expect(screen.getByText("Laravel API 設計レビュー")).toBeTruthy();
    expect(screen.getByText("予約者: Demo Customer")).toBeTruthy();
    expect(screen.getByText("承認待ち")).toBeTruthy();
    expect(screen.getByText("test")).toBeTruthy();
  });

  it("予約がない場合は空表示を出す", async () => {
    vi.mocked(apiGet).mockResolvedValue({
      data: [],
    });

    const ui = await MyReservationsPage();
    render(ui);

    expect(screen.getByText("まだ予約はありません")).toBeTruthy();
  });
});
