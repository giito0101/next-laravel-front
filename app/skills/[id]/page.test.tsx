import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillDetailPage from "./page";
import { apiGet } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  apiGet: vi.fn(),
}));

describe("スキル詳細ページ", () => {
  it("スキル詳細と導線リンクを表示する", async () => {
    vi.mocked(apiGet).mockResolvedValue({
      data: {
        id: "10",
        ownerId: "u1",
        title: "Laravel pair programming",
        description: "Hands-on support",
        price: 8000,
        category: "PROGRAMMING",
        area: "Kanagawa",
      },
    });

    const ui = await SkillDetailPage({
      params: Promise.resolve({ id: "10" }),
    });

    render(ui);

    expect(screen.getByText("Laravel pair programming")).toBeTruthy();
    expect(screen.getByText("Hands-on support")).toBeTruthy();
    expect(screen.getByText("Category: PROGRAMMING")).toBeTruthy();
    expect(screen.getByText("Area: Kanagawa")).toBeTruthy();
    expect(screen.getByText("Price: ¥8000")).toBeTruthy();
    expect(screen.getByRole("link", { name: "予約する" })).toHaveAttribute(
      "href",
      "/skills/10/reserve",
    );
    expect(screen.getByRole("link", { name: "← 一覧へ" })).toHaveAttribute(
      "href",
      "/skills",
    );
  });
});
