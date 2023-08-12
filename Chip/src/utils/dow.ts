// Helper types and functions for dealing with days of the week

// Types
export type Dow =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type DowObject = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

// Constants
export const dows: Dow[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
const dayMap = {
  monday: 1,
  tuesday: 2,
  wednesday: 4,
  thursday: 8,
  friday: 16,
  saturday: 32,
  sunday: 64,
};
const dayMapReversed = {
  1: 'monday',
  2: 'tuesday',
  4: 'wednesday',
  8: 'thursday',
  16: 'friday',
  32: 'saturday',
  64: 'sunday',
};
export const allDays = 127;
// eslint-disable-next-line no-bitwise
export const allWeekdays = 1 | 2 | 4 | 8 | 16;

// Functions
export function weekdaysObjectToBitField(weekdaysObject: DowObject) {
  let weekdaysBitField = 0;

  dows.forEach(day => {
    if (weekdaysObject[day]) {
      // eslint-disable-next-line no-bitwise
      weekdaysBitField |= dayMap[day];
    }
  });

  return weekdaysBitField;
}

export function bitFieldToCleanWeekdaysString(weekdaysBitfield: number) {
  let weekdaysList: Dow[] = [];

  if (weekdaysBitfield === allDays) {
    return 'every day of the week';
  }

  if (weekdaysBitfield === allWeekdays) {
    return 'on all weekdays (but not weekends)';
  }

  if (weekdaysBitfield) {
    Object.keys(dayMapReversed).forEach(key => {
      // eslint-disable-next-line no-bitwise
      if (Number(key) & weekdaysBitfield) {
        weekdaysList.push(dayMapReversed[key]);
      }
    });
  }

  return `on ${weekdaysList
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join(', ')}`;
}
