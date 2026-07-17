import { useCallback, useEffect, useRef, useState } from "react";
import {
    useAddActivityMutation,
    useScoreShadowingMutation,
    useShadowingPromptsQuery,
} from "../../../api";
import { Sparkles } from "lucide-react";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";
import LoadingCard from "../../../components/LoadingCard";
import TtsButton from "../../../components/TtsButton";
import { playAnswerSound } from "./practiceActivity";

import CharDiffDisplay from "./CharDiffDisplay";

const blobToDataUrl = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Could not read recorded audio."));
        reader.readAsDataURL(blob);
    });


const panelClass = "anim-pop rounded-lg border bg-card p-5 text-center shadow-sm sm:p-7";
const innerCardClass = "rounded-lg border bg-card shadow-sm";
const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-accent disabled:opacity-60";
const minVoicedFrames = 8;
const minVoicedFrameRatio = 0.04;
const minVoicePeak = 0.1;
const minVoiceRms = 0.018;


export default function ShadowingTool() {
    const { t } = useI18n();
    const promptsQuery = useShadowingPromptsQuery();
    const scoreMutation = useScoreShadowingMutation();
    const addActivity = useAddActivityMutation();
    const prompts = promptsQuery.data?.prompts ?? [];
    const [idx, setIdx] = useState(0);
    const [recording, setRecording] = useState(false);
    // Held as a key rather than resolved text so a language switch mid-error
    // re-renders the message in the new language.
    const [recordingError, setRecordingError] = useState<TranslationKey | null>(null);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
    const [score, setScore] = useState<Awaited<ReturnType<typeof scoreMutation.mutateAsync>>["score"] | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
    const voiceLevelRef = useRef({ frames: 0, peak: 0, maxRms: 0, voicedFrames: 0 });
    const audioChunksRef = useRef<Blob[]>([]);
    const autoStopRef = useRef<number | null>(null);
    const recordedAudioUrlRef = useRef<string | null>(null);
    const prompt = prompts[idx % Math.max(prompts.length, 1)];

    const clearAutoStop = useCallback(() => {
        if (autoStopRef.current) {
            window.clearTimeout(autoStopRef.current);
            autoStopRef.current = null;
        }
    }, []);

    const resetVoiceLevel = useCallback(() => {
        voiceLevelRef.current = { frames: 0, peak: 0, maxRms: 0, voicedFrames: 0 };
    }, []);

    const closeAudioMeter = useCallback(() => {
        audioSourceRef.current?.disconnect();
        audioSourceRef.current = null;
        analyserRef.current = null;
        audioDataRef.current = null;
        void audioContextRef.current?.close().catch(() => undefined);
        audioContextRef.current = null;
    }, []);

    const setupAudioMeter = useCallback((stream: MediaStream) => {
        closeAudioMeter();
        resetVoiceLevel();

        const AudioContextCtor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextCtor) return;

        try {
            const audioContext = new AudioContextCtor();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.35;
            source.connect(analyser);

            audioContextRef.current = audioContext;
            audioSourceRef.current = source;
            analyserRef.current = analyser;
            audioDataRef.current = new Uint8Array(new ArrayBuffer(analyser.fftSize));
        } catch {
            closeAudioMeter();
        }
    }, [closeAudioMeter, resetVoiceLevel]);

    const readVoiceLevel = useCallback(() => {
        const analyser = analyserRef.current;
        const audioData = audioDataRef.current;

        if (!analyser || !audioData) return 0;

        analyser.getByteTimeDomainData(audioData);

        let sumSquares = 0;
        let peak = 0;

        for (const sample of audioData) {
            const centered = Math.abs((sample - 128) / 128);
            sumSquares += centered * centered;
            peak = Math.max(peak, centered);
        }

        const rms = Math.sqrt(sumSquares / audioData.length);
        const stats = voiceLevelRef.current;
        stats.frames += 1;
        stats.peak = Math.max(stats.peak, peak);
        stats.maxRms = Math.max(stats.maxRms, rms);
        if (rms >= minVoiceRms && peak >= minVoicePeak) stats.voicedFrames += 1;

        return Math.max(rms, peak * 0.5);
    }, []);

    const hasCapturedSpeech = () => {
        const stats = voiceLevelRef.current;
        if (stats.frames === 0) return false;
        const voicedFrameRatio = stats.voicedFrames / stats.frames;
        return (
            stats.voicedFrames >= minVoicedFrames &&
            voicedFrameRatio >= minVoicedFrameRatio &&
            stats.peak >= minVoicePeak &&
            stats.maxRms >= minVoiceRms
        );
    };

    const releaseMicrophone = useCallback(() => {
        closeAudioMeter();
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
    }, [closeAudioMeter]);

    const clearRecordedAudio = useCallback((updateState = true) => {
        if (recordedAudioUrlRef.current) {
            URL.revokeObjectURL(recordedAudioUrlRef.current);
            recordedAudioUrlRef.current = null;
        }
        if (updateState) setRecordedAudioUrl(null);
    }, []);

    const showRecordedAudio = useCallback((audioBlob: Blob) => {
        clearRecordedAudio();
        const url = URL.createObjectURL(audioBlob);
        recordedAudioUrlRef.current = url;
        setRecordedAudioUrl(url);
    }, [clearRecordedAudio]);

    useEffect(() => {
        if (!recording || !canvasRef.current) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgb(217, 63, 71)";
            const level = readVoiceLevel();
            const barWidth = 4;
            const gap = 2;
            const count = Math.floor(canvas.width / (barWidth + gap));
            for (let i = 0; i < count; i += 1) {
                const wave = Math.sin((i / Math.max(count - 1, 1)) * Math.PI);
                const height = Math.max(4, wave * level * canvas.height * 2.8);
                const x = i * (barWidth + gap);
                const y = (canvas.height - height) / 2;
                ctx.fillRect(x, y, barWidth, height);
            }
            animationRef.current = requestAnimationFrame(draw);
        };
        draw();
    }, [readVoiceLevel, recording]);

    useEffect(() => () => {
        clearAutoStop();
        releaseMicrophone();
        clearRecordedAudio(false);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }, [clearAutoStop, clearRecordedAudio, releaseMicrophone]);

    if (promptsQuery.isLoading || !prompt) return <LoadingCard label={t("practice.shadow.loading")} />;

    const scoreRecordedAudio = async (audioBlob: Blob) => {
        const audio = await blobToDataUrl(audioBlob);
        const result = await scoreMutation.mutateAsync({
            expectedText: prompt.hanzi,
            audio,
            audioMimeType: audioBlob.type,
        });
        setScore(result.score);
        playAnswerSound(result.score.overall >= 80);
        await addActivity.mutateAsync({
            xp: 15,
            minutes: 1,
            exercisesCorrect: result.score.overall >= 80 ? 1 : 0,
            exercisesTotal: 1,
            skill: "shadow",
            skillScore: result.score.overall,
            mistake: result.score.overall < 80 ? {
                skill: "shadow",
                prompt: prompt.hanzi,
                userAnswer: result.score.transcribedText || `${result.score.overall}%`,
                correctAnswer: prompt.pinyin,
                simplified: prompt.hanzi,
                pinyin: prompt.pinyin,
                english: prompt.english,
                context: { tool: "shadowing", score: result.score },
            } : undefined,
        });
    };

    const stopRecord = () => {
        clearAutoStop();
        const recorder = mediaRecorderRef.current;

        if (recorder && recorder.state !== "inactive") {
            recorder.stop();
            return;
        }

        setRecording(false);
        releaseMicrophone();
    };

    const startRecord = async () => {
        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
            setRecordingError("practice.shadow.noSupport");
            return;
        }

        setScore(null);
        setRecordingError(null);
        clearRecordedAudio();

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setupAudioMeter(stream);
            const preferredMimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) =>
                MediaRecorder.isTypeSupported(type),
            );
            const recorder = preferredMimeType
                ? new MediaRecorder(stream, { mimeType: preferredMimeType })
                : new MediaRecorder(stream);

            audioChunksRef.current = [];
            mediaStreamRef.current = stream;
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onerror = () => {
                setRecording(false);
                setRecordingError("practice.shadow.failed");
                clearAutoStop();
                releaseMicrophone();
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: recorder.mimeType || "audio/webm",
                });
                const capturedSpeech = hasCapturedSpeech();
                setRecording(false);
                releaseMicrophone();

                if (!audioBlob.size) {
                    setRecordingError("practice.shadow.noAudio");
                    return;
                }

                if (!capturedSpeech) {
                    setRecordingError("practice.shadow.silent");
                    return;
                }

                showRecordedAudio(audioBlob);
                void scoreRecordedAudio(audioBlob).catch(() => {
                    setRecordingError("practice.shadow.scoreError");
                });
            };

            recorder.start();
            setRecording(true);
            autoStopRef.current = window.setTimeout(stopRecord, 3000);
        } catch {
            setRecording(false);
            releaseMicrophone();
            setRecordingError("practice.shadow.permission");
        }
    };

    const tryAgain = () => {
        setScore(null);
        setRecordingError(null);
        clearRecordedAudio();
    };

    const nextPrompt = () => {
        setIdx((value) => value + 1);
        setScore(null);
        setRecordingError(null);
        clearRecordedAudio();
    };

    const overallLabel =
        score && score.overall >= 90
            ? t("practice.shadow.excellent")
            : score && score.overall >= 75
                ? t("practice.shadow.great")
                : score && score.overall >= 50
                    ? t("practice.shadow.goodEffort")
                    : t("practice.shadow.keepPracticing");

    return (
        <div className={panelClass}>
            <h3 className="mb-4 text-[1.3rem] font-extrabold">{t("practice.shadow.title")}</h3>
            <div className={cn(innerCardClass, "mb-6 p-7 text-center")}>
                <h1 className="font-serif text-5xl font-extrabold text-primary">{prompt.hanzi}</h1>
                <p className="my-1 text-base font-medium text-muted-foreground">{prompt.pinyin}</p>
                <p className="text-[0.9rem] font-semibold">"{prompt.gloss}"</p>
                <TtsButton text={prompt.hanzi} className={cn(secondaryButtonClass, "mt-4 px-4 py-2 text-[0.8rem]")}>
                    {t("practice.shadow.listenSample")}
                </TtsButton>
            </div>
            {recording && (
                <div className="mb-5">
                    <canvas ref={canvasRef} width={280} height={60} className="h-15 w-full" />
                    <span className="text-xs font-bold text-primary">{t("practice.shadow.recording")}</span>
                </div>
            )}
            {scoreMutation.isPending && (
                <div className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    {t("practice.shadow.analyzing")}
                </div>
            )}
            {recordingError && (
                <div className="mb-5 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm font-semibold text-primary">
                    {t(recordingError)}
                </div>
            )}
            {recordedAudioUrl && (
                <div className="mb-5 rounded-lg border bg-card p-4 text-left shadow-sm">
                    <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">{t("practice.shadow.yourRecording")}</p>
                    <audio controls src={recordedAudioUrl} className="w-full" />
                </div>
            )}
            {score && (
                <div className="anim-pop mb-6 text-left">
                    <div className="rounded-lg border border-dashed border-jade bg-jade/5 p-5 shadow-sm">
                        <h4 className="mb-3 flex gap-2 text-[1.1rem] font-extrabold text-jade">
                            <Sparkles size={20} /> {t("practice.shadow.result", { label: overallLabel })}
                        </h4>

                        {score.transcribedText !== undefined && (
                            <div className="mb-4 rounded-lg border bg-card p-4">
                                <p className="mb-1.5 text-xs font-bold uppercase text-muted-foreground">{t("practice.shadow.youSaid")}</p>
                                <p className="font-serif text-2xl font-bold text-foreground">
                                    {score.transcribedText || <span className="italic text-muted-foreground">{t("practice.shadow.noSpeech")}</span>}
                                </p>
                            </div>
                        )}

                        {score.details?.charDiff && score.details.charDiff.length > 0 && (
                            <div className="mb-4">
                                <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">{t("practice.shadow.charBreakdown")}</p>
                                <CharDiffDisplay charDiff={score.details.charDiff} />
                                <div className="mt-2 flex flex-wrap gap-3 text-[0.7rem] font-semibold text-muted-foreground">
                                    <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-jade/40" /> {t("practice.shadow.legendCorrect")}</span>
                                    <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-primary/40" /> {t("practice.shadow.legendWrong")}</span>
                                    <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-sm bg-gold/40" /> {t("practice.shadow.legendMissing")}</span>
                                </div>
                            </div>
                        )}

                        {[
                            { label: t("practice.shadow.accuracy"), val: score.accuracy, cls: "bg-tone-1" },
                            { label: t("practice.shadow.tones"), val: score.tones, cls: "bg-tone-3" },
                            { label: t("practice.shadow.fluency"), val: score.fluency, cls: "bg-tone-2" },
                        ].map((bar) => (
                            <div key={bar.label} className="mb-2.5">
                                <div className="mb-0.5 flex justify-between text-xs font-bold">
                                    <span>{bar.label}</span>
                                    <span>{bar.val}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-[3px] bg-border">
                                    <div className={cn("h-full rounded-[3px] transition-all duration-500", bar.cls)} style={{ width: `${bar.val}%` }} />
                                </div>
                            </div>
                        ))}
                        <p className="text-[0.85rem] italic text-muted-foreground">{score.tip}</p>
                    </div>
                </div>
            )}
            <div className="flex gap-3">
                {!recording ? (
                    <button className={cn(primaryButtonClass, "recording-pulse flex-1")} onClick={() => void startRecord()} disabled={scoreMutation.isPending}>
                        {score ? t("practice.shadow.recordAgain") : t("practice.shadow.start")}
                    </button>
                ) : (
                    <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-jade px-6 py-3 text-sm font-semibold text-white transition hover:bg-jade/90" onClick={stopRecord}>
                        {t("practice.shadow.stop")}
                    </button>
                )}
                {score && (
                    <>
                        <button className={cn(secondaryButtonClass, "flex-[0.4]")} onClick={tryAgain}>
                            {t("practice.shadow.tryAgain")}
                        </button>
                        <button className={cn(secondaryButtonClass, "flex-[0.4]")} onClick={nextPrompt}>
                            {t("practice.next")}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}