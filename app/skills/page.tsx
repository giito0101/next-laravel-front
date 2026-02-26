import Link from "next/link";
import { apiGet, Skill } from "@/lib/api";

type SkillListResponse = {
  current_page: number;
  data: Skill[];
  last_page: number;
  total: number;
};

export default async function SkillsPage() {
  const res = await apiGet<SkillListResponse>(`/skills`);
  const skills = res.data ?? [];

  return (
    <main style={{ padding: 24 }}>
      <h1>Skills</h1>
      <ul style={{ marginTop: 16 }}>
        {skills.map((s) => (
          <li key={s.id} style={{ marginBottom: 10 }}>
            <Link href={`/skills/${s.id}`}>{s.title}</Link>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              {s.category} / {s.area} / ¥{s.price}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
