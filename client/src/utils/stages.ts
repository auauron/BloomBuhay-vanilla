export const STAGES = [
  { key: "pregnant", label: "Pregnant" },
  { key: "postpartum", label: "Postpartum" },
  { key: "childcare", label: "Early Childcare" },
];
export const keyToLabel = (k?: string|null) => STAGES.find(s=>s.key===k)?.label ?? null;
