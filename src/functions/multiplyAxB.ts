export const multiplyAxB = (inputs: number[]): number => {
  if (inputs.length !== 2) {
    throw new Error("multiplyAxB expects exactly two inputs.");
  }
  return inputs[0] * inputs[1];
};
