export type Tool = "menu" | "weak" | "tones" | "pairs" | "typing" | "shadow" | "hanzi" | "listening" | "list";

export function isPracticeTool(value: string | null): value is Tool {
  return ["weak", "tones", "pairs", "typing", "shadow", "hanzi", "listening", "list"].includes(value || "");
}
