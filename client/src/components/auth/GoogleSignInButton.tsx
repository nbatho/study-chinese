import { useEffect, useRef } from "react";

// Google Identity Services (GIS). We load the official script on demand and render
// Google's own "Sign in with Google" button, which hands us an ID token (credential)
// that the backend verifies. No client secret lives in the browser.
const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

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

// Shared across mounts so the script is only ever injected once.
let scriptPromise: Promise<void> | null = null;

const loadGsiScript = () => {
    if (scriptPromise) {
        return scriptPromise;
    }

    scriptPromise = new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);

        if (existing) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = GSI_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => {
            scriptPromise = null;
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
    const containerRef = useRef<HTMLDivElement>(null);
    // Keep the latest callback without re-running the effect (which would re-render the button).
    const callbackRef = useRef(onCredential);
    callbackRef.current = onCredential;

    useEffect(() => {
        if (!CLIENT_ID) {
            return;
        }

        let cancelled = false;

        loadGsiScript()
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
                    width: Math.min(container.offsetWidth || 360, 400),
                });
            })
            .catch(() => {
                // Network/script failure: the button simply won't appear; email login stays available.
            });

        return () => {
            cancelled = true;
        };
    }, [text]);

    // Without a configured client id there is nothing to render.
    if (!CLIENT_ID) {
        return null;
    }

    return <div ref={containerRef} className="flex justify-center" />;
}
