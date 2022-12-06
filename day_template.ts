export function parseInput(input: string) {
  return input.split("\n");
}

type ParsedInput = ReturnType<typeof parseInput>;

export const allSolvers = [
  (parsedInput: ParsedInput) => {
    console.log({ parsedInput });
  },
];
