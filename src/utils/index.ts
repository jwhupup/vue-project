export * from "./is";

export function runAsync(cb: () => any) {
  const timer = setTimeout(() => {
    clearTimeout(timer);
    cb();
  }, 0);
}

export function first2UpperCase(word?: string) {
  if (!word) return word;
  return word
    .toLowerCase()
    .replace(/[a-z]{1}/, (letter) => letter.toUpperCase());
}

export function range(start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
}
