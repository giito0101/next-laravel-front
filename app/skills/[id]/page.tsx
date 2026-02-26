import Link from "next/link";
import { apiGet, Skill } from "@/lib/api";

type SkillDetailResponse = { data: Skill };

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("params:" + params);
  const res = await apiGet<SkillDetailResponse>(`/skills/${id}`);
  const skill = res.data;

  return (
    <main style={{ padding: 24 }}>
      <h1>{skill.title}</h1>
      <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
        {skill.description}
      </p>

      <div style={{ marginTop: 12, fontSize: 14, opacity: 0.9 }}>
        <div>Category: {skill.category}</div>
        <div>Area: {skill.area}</div>
        <div>Price: ¥{skill.price}</div>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href={`/skills/${skill.id}/reserve`}>予約する</Link>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/skills">← 一覧へ</Link>
      </div>
    </main>
  );
}
