// Escape LIKE/ILIKE wildcards so user input matches literally
// (backslash is PostgreSQL's default ESCAPE character).
export const toLikePattern = (value) => `%${String(value).replace(/[\\%_]/g, '\\$&')}%`;
