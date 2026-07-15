// Mirrors the server policy (server/src/utils/password-policy.js). Keep both in sync.

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export type PasswordRuleKey = "length" | "lowercase" | "uppercase" | "digit";

export const passwordRules: { key: PasswordRuleKey; test: (value: string) => boolean }[] = [
    { key: "length", test: (value) => value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH },
    { key: "lowercase", test: (value) => /[a-z]/.test(value) },
    { key: "uppercase", test: (value) => /[A-Z]/.test(value) },
    { key: "digit", test: (value) => /\d/.test(value) },
];

export const isStrongPassword = (value: string): boolean =>
    passwordRules.every((rule) => rule.test(value));

// Which rules the current value fails, in declaration order.
export const failedPasswordRules = (value: string): PasswordRuleKey[] =>
    passwordRules.filter((rule) => !rule.test(value)).map((rule) => rule.key);
