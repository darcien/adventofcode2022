import { executeSolvers, getDayInput } from "./utils.ts";

const input = await getDayInput(import.meta.url);

function parseInput(input: string) {
  return input;
}

type ParsedInput = ReturnType<typeof parseInput>;

const allSolvers = [(_parsedInput: ParsedInput) => {}];

const result = executeSolvers(allSolvers, parseInput, input);
console.log(result);
