// Single source of truth for password strength rules. Mirrored on the client
// (client/src/utils/passwordPolicy.ts) so both sides show the same requirements.

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const passwordRules = [
  { test: (value) => value.length >= PASSWORD_MIN_LENGTH, key: 'length' },
  { test: (value) => value.length <= PASSWORD_MAX_LENGTH, key: 'maxLength' },
  { test: (value) => /[a-z]/.test(value), key: 'lowercase' },
  { test: (value) => /[A-Z]/.test(value), key: 'uppercase' },
  { test: (value) => /\d/.test(value), key: 'digit' }
];

// Returns true only when the value is a string satisfying every rule.
export const isStrongPassword = (value) =>
  typeof value === 'string' && passwordRules.every((rule) => rule.test(value));
