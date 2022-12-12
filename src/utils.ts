export interface ThemeConfigs {
  readonly abc: number
}

export function numberic(defaultValue: number = 0) {
  return (value: string) => {
    if (!value) return defaultValue;
    return Number(value);
  }
}

export function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth'
    })
  }
}