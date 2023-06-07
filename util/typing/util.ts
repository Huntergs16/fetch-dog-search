export function convertAgeToString(age: number | string): number | string {
    if (typeof age === 'number' && age === 0) {
      return "<1";
    }
    return age;
};