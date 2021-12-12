function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0;
}

export default isPowerOf2;
