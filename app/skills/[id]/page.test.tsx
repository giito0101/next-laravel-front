import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillDetailPage from "./page";
import { apiGet } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("not found");
  }),
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe("スキル詳細ページ", () => {
  it("スキル詳細、レビュー、導線リンクを表示する", async () => {
    vi.mocked(apiGet)
      .mockResolvedValueOnce({
        data: {
          id: "10",
          ownerId: "u1",
          title: "Laravel pair programming",
          description: "Hands-on support",
          price: 8000,
          category: "PROGRAMMING",
          area: "Kanagawa",
          imageUrl: null,
          owner: {
            id: "u1",
            name: "Ito",
          },
          averageRating: 4.5,
          reviewCount: 2,
        },
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: "r1",
            owner: {
              id: "u2",
              name: "Sato",
            },
            rating: 5,
            comment: "とても分かりやすかったです",
            createdAt: "2026-05-11T10:00:00Z",
          },
        ],
      });

    const ui = await SkillDetailPage({
      params: Promise.resolve({ id: "10" }),
    });

    render(ui);

    expect(screen.getByText("Laravel pair programming")).toBeTruthy();
    expect(screen.getByText("Hands-on support")).toBeTruthy();
    expect(screen.getByText("Kanagawa")).toBeTruthy();
    expect(screen.getByText("¥8,000")).toBeTruthy();
    expect(screen.getByText("Ito")).toBeTruthy();
    expect(screen.getAllByText("4.5 / 5")).toHaveLength(2);
    expect(screen.getByText("2件")).toBeTruthy();
    expect(screen.getByText("Sato")).toBeTruthy();
    expect(screen.getByText("とても分かりやすかったです")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "このスキルを予約する" }),
    ).toHaveAttribute(
      "href",
      "/skills/10/reservations",
    );
    expect(
      screen.getByRole("link", { name: "レビュー投稿フォームへ" }),
    ).toHaveAttribute("href", "#review-form");
    expect(screen.getByRole("button", { name: "入力フォームを開く" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "← 一覧へ戻る" })).toHaveAttribute(
      "href",
      "/skills",
    );
  });

  it("owner や reviews が未取得でも仮置き表示で落ちない", async () => {
    vi.mocked(apiGet)
      .mockResolvedValueOnce({
        data: {
          id: "11",
          ownerId: "u9",
          title: "Temporary skill",
          description: "Backend not ready yet",
          price: 3000,
          category: "OTHER",
          area: "Tokyo",
        },
      })
      .mockResolvedValueOnce({
        data: [],
      });

    const ui = await SkillDetailPage({
      params: Promise.resolve({ id: "11" }),
    });

    render(ui);

    expect(screen.getByText("Temporary skill")).toBeTruthy();
    expect(screen.getByText("未設定")).toBeTruthy();
    expect(screen.getAllByText("0.0 / 5")).toHaveLength(2);
    expect(screen.getByText("0件")).toBeTruthy();
    expect(screen.getByText("まだレビューは投稿されていません")).toBeTruthy();
  });
});
