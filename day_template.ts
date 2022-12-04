import { executeSolvers, getDayInput } from "./utils.ts";

const input = await getDayInput(import.meta.url);

function parseInput(input: string) {
  return input.split("\n");
}

type ParsedInput = ReturnType<typeof parseInput>;

const allSolvers = [
  (parsedInput: ParsedInput) => {
    console.log({ parsedInput });
  },
];

const result = executeSolvers(allSolvers, parseInput, input);
console.log(result);
