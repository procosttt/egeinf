import part1 from "./part1.mjs";
import part2 from "./part2.mjs";
import communityTemplates from "./community-templates.mjs";
import problemOverrides from "./problem-overrides.mjs";

export const initialTemplates = [...part1, ...part2, ...communityTemplates].map((item) => ({
  ...item,
  problem: problemOverrides[item.slug] ?? item.problem,
}));
