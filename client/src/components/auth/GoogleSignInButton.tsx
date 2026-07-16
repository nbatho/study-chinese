import { useEffect, useRef } from "react";
import { useI18n } from "../../i18n";
import type { Language } from "../../i18n";

// Google Identity Services (GIS). We load the official script on demand and render
// Google's own "Sign in with Google" button, which hands us an ID token (credential)
// that the backend verifies. No client secret lives in the browser.
const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

/**
 * Google renders the button's label itself. Left alone it picks the browser's
 * locale, which shows e.g. Vietnamese text inside an English UI, so pass the app
 * language across in the locale codes Google expects.
 */
const GSI_LOCALES: Record<Language, string> = {
    en: "en",
    vi: "vi",
    "zh-Hans": "zh_CN",
    "zh-Hant": "zh_TW",
};

interface GoogleCredentialResponse {
    credential?: string;
}

interface GoogleAccountsId {
    initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
    }) => void;
    renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: GoogleAccountsId;
            };
        };
    }
}

// Shared across mounts so the script is only injected once per locale. GSI reads
// `hl` when it loads and ignores `renderButton`'s locale afterwards, so switching
// language means re-loading the script rather than just re-rendering.
let scriptPromise: Promise<void> | null = null;
let loadedLocale: string | null = null;

const loadGsiScript = (locale: string) => {
    if (scriptPromise && loadedLocale === locale) {
        return scriptPromise;
    }

    if (loadedLocale !== null && loadedLocale !== locale) {
        document
            .querySelectorAll(`script[src^="${GSI_SRC}"]`)
            .forEach((script) => script.remove());
        delete window.google;
    }

    loadedLocale = locale;
    scriptPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${GSI_SRC}?hl=${encodeURIComponent(locale)}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => {
            scriptPromise = null;
            loadedLocale = null;
            reject(new Error("Failed to load Google Identity Services."));
        };
        document.head.appendChild(script);
    });

    return scriptPromise;
};

interface GoogleSignInButtonProps {
    onCredential: (credential: string) => void;
    text?: "signin_with" | "signup_with" | "continue_with";
}

export function GoogleSignInButton({ onCredential, text = "continue_with" }: GoogleSignInButtonProps) {
    const { language } = useI18n();
    const containerRef = useRef<HTMLDivElement>(null);
    // Keep the latest callback without re-running the effect (which would re-render the button).
    const callbackRef = useRef(onCredential);
    callbackRef.current = onCredential;

    useEffect(() => {
        if (!CLIENT_ID) {
            return;
        }

        let cancelled = false;

        loadGsiScript(GSI_LOCALES[language])
            .then(() => {
                const container = containerRef.current;

                if (cancelled || !container || !window.google) {
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: (response) => {
                        if (response.credential) {
                            callbackRef.current(response.credential);
                        }
                    },
                });

                container.replaceChildren();
                window.google.accounts.id.renderButton(container, {
                    theme: "outline",
                    size: "large",
                    text,
                    shape: "pill",
                    logo_alignment: "center",
                    locale: GSI_LOCALES[language],
                    width: Math.min(container.offsetWidth || 360, 400),
                });
            })
            .catch(() => {
                // Network/script failure: the button simply won't appear; email login stays available.
            });

        return () => {
            cancelled = true;
        };
    }, [text, language]);

    // Without a configured client id there is nothing to render.
    if (!CLIENT_ID) {
        return null;
    }

    return <div ref={containerRef} className="flex justify-center" />;
}
