export function datePlainFormat(date: Date, locale = 'en-US') {
  const options = {dateStyle: 'full'};

  const day = new Intl.DateTimeFormat(locale, options).format(date);

  return `${day}`;
}

interface Time {
  hours: number;
  minutes: number;
}

export function timePlainFormat(time: Time, locale = 'en-US') {
  const options = {hour: 'numeric', minute: 'numeric', dayPeriod: 'short'};
  const date = new Date();
  date.setHours(time.hours);
  date.setMinutes(time.minutes);

  const newTime = new Intl.DateTimeFormat(locale, options).format(date);
  return newTime;
}
