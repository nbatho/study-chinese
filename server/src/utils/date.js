export const getDateKey = (timeZone = 'UTC', date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);

export const previousDateKey = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
};

export const daysBetweenDateKeys = (startDateKey, endDateKey) => {
  const start = new Date(`${startDateKey}T00:00:00.000Z`);
  const end = new Date(`${endDateKey}T00:00:00.000Z`);
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
};

export const addDays = (date, days) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
