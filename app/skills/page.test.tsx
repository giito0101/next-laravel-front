import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillsPage from "./page";
import { apiGet } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  apiGet: vi.fn(),
}));

describe("スキル一覧ページ", () => {
  it("APIレスポンスのスキル一覧を表示する", async () => {
    vi.mocked(apiGet).mockResolvedValue({
      current_page: 1,
      last_page: 1,
      total: 1,
      data: [
        {
          id: "1",
          ownerId: "u1",
          title: "React mentoring",
          description: "desc",
          price: 5000,
          category: "PC_SUPPORT",
          area: "Tokyo",
        },
      ],
    });

    const ui = await SkillsPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);

    expect(screen.getByText("React mentoring")).toBeTruthy();
    expect(screen.getAllByText("PC Support")).toHaveLength(2);
    expect(screen.getByText("Tokyo")).toBeTruthy();
    expect(screen.getByText("¥5000")).toBeTruthy();
    expect(screen.getByText("React mentoring").closest("a")).toHaveAttribute(
      "href",
      "/skills/1",
    );
    expect(apiGet).toHaveBeenCalledWith("/skills");
  });

  it("検索条件付きでAPIを呼び出す", async () => {
    vi.mocked(apiGet).mockResolvedValue({
      current_page: 2,
      last_page: 4,
      total: 21,
      data: [],
    });

    const ui = await SkillsPage({
      searchParams: Promise.resolve({
        q: " Laravel ",
        category: "PC_SUPPORT",
        area: " Tokyo ",
        page: "2",
      }),
    });
    render(ui);

    expect(apiGet).toHaveBeenCalledWith(
      "/skills?q=Laravel&category=PC_SUPPORT&area=Tokyo&page=2",
    );
    expect(
      screen.getByText("条件に合うスキルが見つかりませんでした"),
    ).toBeTruthy();
  });
});
