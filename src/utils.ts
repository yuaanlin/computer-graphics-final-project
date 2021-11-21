export function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0;
}
