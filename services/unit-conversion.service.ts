export function decimetersToFeetAndInches(decimeters: number): string {
  // 1 decimeter is equal to 0.328084 feet
  const feet = decimeters * 0.328084;

  // 1 foot is equal to 12 inches
  const totalInches = feet * 12;

  // Calculate the number of whole feet
  const wholeFeet = Math.floor(feet);

  // Calculate the remaining inches
  const remainingInches = totalInches - wholeFeet * 12;

  return `${wholeFeet} ft. ${Math.ceil(remainingInches)} in`;
}

export function hectogramsToPounds(hectograms: number): number {
  // 1 hectogram is equal to 0.220462 pounds
  const pounds = hectograms * 0.220462;

  return Math.ceil(pounds);
}
