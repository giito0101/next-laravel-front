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
          category: "PROGRAMMING",
          area: "Tokyo",
        },
      ],
    });

    const ui = await SkillsPage();
    render(ui);

    expect(screen.getByText("React mentoring")).toBeTruthy();
    expect(screen.getByText("PROGRAMMING / Tokyo / ¥5000")).toBeTruthy();
    expect(screen.getByRole("link", { name: "React mentoring" })).toHaveAttribute(
      "href",
      "/skills/1",
    );
  });
});
