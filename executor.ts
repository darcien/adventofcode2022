import { executeSolvers, loadDay } from "./utils.ts";

const dayParam = "--day=";
const dayArg = Deno.args.find((arg) => arg.startsWith(dayParam));
const day = parseInt(dayArg?.split("").pop() || "", 10);

if (Number.isNaN(day)) {
  throw new Error(
    `invalid ${dayArg}, specify day with int, e.g. ${dayParam}${6}`
  );
}

const useInputFile = Deno.args.includes("--submit");
const { allSolvers, parseInput, dayInput } = await loadDay(day, {
  useInputFile,
});

const result = executeSolvers(allSolvers, parseInput, dayInput);
console.log(result);
