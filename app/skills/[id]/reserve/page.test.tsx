import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { apiGet, apiPost } from "@/lib/api";

const navigationMocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    use: () => ({ id: "15" }),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: navigationMocks.push,
    replace: vi.fn(),
  }),
}));

vi.mock("@/lib/api", () => ({
  ApiError: class ApiError extends Error {
    constructor(
      message: string,
      public status: number,
    ) {
      super(message);
    }
  },
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

import ReservePage from "./page";

describe("予約作成ページ", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiGet).mockResolvedValue({
      data: {
        id: "15",
        ownerId: "u1",
        title: "Laravel pair programming",
        description: "Hands-on support",
        price: 8000,
        category: "PROGRAMMING",
        area: "Kanagawa",
      },
    });
  });

  it("スキルタイトルを表示し、予約リクエスト送信後に詳細画面へ遷移する", async () => {
    vi.mocked(apiPost).mockResolvedValue({
      data: { id: "rsv-1" },
    });

    render(<ReservePage params={Promise.resolve({ id: "15" })} />);

    expect(await screen.findByText("Laravel pair programming")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("希望日時"), {
      target: { value: "2026-02-27T10:00" },
    });
    fireEvent.change(screen.getByLabelText("メッセージ"), {
      target: { value: "よろしくお願いします。" },
    });
    fireEvent.click(screen.getByRole("button", { name: "予約する" }));

    await waitFor(() => {
      expect(apiPost).toHaveBeenCalledWith(
        "/skills/15/reservations",
        {
          date: "2026-02-27T10:00",
          message: "よろしくお願いします。",
        },
        {
          headers: {
            "X-User-Id": "demo-customer-1",
          },
        },
      );
    });

    expect(navigationMocks.push).toHaveBeenCalledWith("/skills/15?reserved=1");
  });

  it("予約リクエストに失敗したらサーバーエラー扱いのメッセージを表示する", async () => {
    vi.mocked(apiPost).mockRejectedValue(new Error("server error"));

    render(<ReservePage params={Promise.resolve({ id: "15" })} />);

    fireEvent.change(screen.getByLabelText("希望日時"), {
      target: { value: "2026-02-27T10:00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "予約する" }));

    expect(
      await screen.findByText(
        "予約に失敗しました。時間をおいて再度お試しください。",
      ),
    ).toBeTruthy();
  });
});
