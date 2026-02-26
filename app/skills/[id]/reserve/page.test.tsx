import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { apiPost } from "@/lib/api";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    use: () => ({ id: "15" }),
  };
});

import ReservePage from "./page";

vi.mock("@/lib/api", () => ({
  apiPost: vi.fn(),
}));

describe("予約作成ページ", () => {
  it("予約リクエスト送信後に成功メッセージを表示する", async () => {
    vi.mocked(apiPost).mockResolvedValue({
      data: { id: "rsv-1" },
    });

    render(<ReservePage params={Promise.resolve({ id: "15" })} />);

    fireEvent.change(screen.getByLabelText("希望日時"), {
      target: { value: "2026-02-27T10:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "予約する" }));

    await waitFor(() => {
      expect(apiPost).toHaveBeenCalledWith("/skills/15/reservations", {
        startAt: "2026-02-27T10:00",
      });
    });

    expect(screen.getByText("予約を作成しました: rsv-1")).toBeTruthy();
  });
});
