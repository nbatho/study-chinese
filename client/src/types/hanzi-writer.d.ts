declare module "hanzi-writer" {
  export type HanziWriterQuizOptions = {
    onMistake?: (summary: unknown) => void;
    onCorrectStroke?: (summary: unknown) => void;
    onComplete?: (summary: unknown) => void;
  };

  export type HanziWriterOptions = {
    width?: number;
    height?: number;
    padding?: number;
    showOutline?: boolean;
    showCharacter?: boolean;
    strokeAnimationSpeed?: number;
    delayBetweenStrokes?: number;
    drawingWidth?: number;
    drawingColor?: string;
    strokeColor?: string;
    outlineColor?: string;
    radicalColor?: string;
  };

  export type HanziWriterInstance = {
    animateCharacter: () => Promise<void>;
    quiz: (options?: HanziWriterQuizOptions) => void;
    showCharacter: () => Promise<void>;
    hideCharacter: () => Promise<void>;
    showOutline: () => Promise<void>;
    hideOutline: () => Promise<void>;
  };

  const HanziWriter: {
    create: (
      element: string | HTMLElement,
      character: string,
      options?: HanziWriterOptions
    ) => HanziWriterInstance;
  };

  export default HanziWriter;
}
