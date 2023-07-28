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
export const allDays = 127;

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
