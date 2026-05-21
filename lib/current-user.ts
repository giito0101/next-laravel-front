import type { Skill } from "@/lib/api";

export const currentUserId =
  process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "demo-customer-1";

export const currentProviderId =
  process.env.NEXT_PUBLIC_DEMO_PROVIDER_ID ?? "provider-pc-1";

export function getSkillOwnerId(skill: Pick<Skill, "ownerId" | "owner_id">): string {
  return skill.ownerId ?? skill.owner_id ?? "";
}
