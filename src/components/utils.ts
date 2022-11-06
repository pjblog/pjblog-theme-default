export function numberic(defaultValue: number = 0) {
  return (value: string) => {
    if (!value) return defaultValue;
    return Number(value);
  }
}