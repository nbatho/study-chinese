import { useI18n } from "../../../i18n";
import { HanziText } from "../../../components/HanziLookup";
import { localized, type FoundationStage } from "../foundationCourse";
import ToneContourIcon from "./ToneContourIcon";
import ListenButton from "./ListenButton";
import StageQuiz from "./StageQuiz";

export default function StageBody({ stage, onDone }: { stage: FoundationStage; onDone: (accuracy: number) => void }) {
  const { language } = useI18n();

  if (stage.kind === "tones" && stage.tones) {
    return (
      <div className="grid gap-2">
        {stage.tones.map((tone) => (
          <article key={tone.hanzi} className="rounded-xl border bg-background p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-primary/10">
                  <ToneContourIcon contour={tone.contour} />
                </span>
                <div className="min-w-0">
                  <div className="font-extrabold leading-tight">{localized(tone.name, language)}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <HanziText className="font-serif text-2xl font-extrabold text-primary">{tone.hanzi}</HanziText>
                    <span className="text-sm font-bold text-muted-foreground">{tone.pinyin}</span>
                  </div>
                </div>
              </div>
              <ListenButton text={tone.hanzi} />
            </div>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">{localized(tone.description, language)}</p>
          </article>
        ))}
      </div>
    );
  }

  if (stage.kind === "sounds" && stage.sounds) {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {stage.sounds.map((sound) => (
          <article key={sound.hanzi + sound.pinyin} className="flex items-start justify-between gap-3 rounded-xl border bg-background p-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <HanziText className="font-serif text-2xl font-extrabold text-primary">{sound.hanzi}</HanziText>
                <span className="text-sm font-bold text-muted-foreground">{sound.pinyin}</span>
              </div>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">{localized(sound.hint, language)}</p>
            </div>
            <ListenButton text={sound.hanzi} />
          </article>
        ))}
      </div>
    );
  }

  if (stage.kind === "quiz" && stage.questions) {
    return <StageQuiz stage={stage} onDone={onDone} />;
  }

  return null;
}
