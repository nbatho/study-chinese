import type { ToneContour } from "../foundationCourse";

export default function ToneContourIcon({ contour }: { contour: ToneContour }) {
  if (contour === "neutral") {
    return (
      <svg aria-hidden="true" viewBox="0 0 72 56" className="size-12 overflow-visible">
        <path d="M10 48H62" className="stroke-primary/15" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="28" r="9" className="fill-primary" />
      </svg>
    );
  }
  const path = {
    level: "M14 18H58",
    rising: "M16 42L58 14",
    dipping: "M14 22C24 45 43 45 58 18",
    falling: "M16 14L58 42",
  }[contour];
  return (
    <svg aria-hidden="true" viewBox="0 0 72 56" className="size-12 overflow-visible">
      <path d="M10 48H62" className="stroke-primary/15" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d={path} className="stroke-primary" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
