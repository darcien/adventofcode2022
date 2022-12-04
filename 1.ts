import { executeSolvers, getDayInput } from "./utils.ts";

const input = await getDayInput(import.meta.url);

function parseInput(input: string) {
  return input.split("\n\n");
}

type ParsedInput = ReturnType<typeof parseInput>;

const allSolvers = [
  (parsedInput: ParsedInput) => {
    const elfCalsList = parsedInput;

    let maxCals = 0;
    elfCalsList.forEach((elfCals) => {
      const total = elfCals
        .split("\n")
        .reduce((total, current) => total + parseInt(current, 10), 0);
      if (total > maxCals) {
        maxCals = total;
      }
    });

    return maxCals;
  },
  (parsedInput: ParsedInput) => {
    const elfCalsList = parsedInput;

    let top3 = [] as number[];
    elfCalsList.forEach((elfCals) => {
      const total = elfCals
        .split("\n")
        .reduce((total, current) => total + parseInt(current, 10), 0);

      if (top3.length < 3) {
        top3.push(total);
      } else if (top3.some((top) => top < total)) {
        const localTop = [...top3, total].sort((a, b) => b - a).slice(0, 3);
        top3 = localTop;
      }
    });

    return top3.reduce((total, current) => total + current, 0);
  },
];

const result = executeSolvers(allSolvers, parseInput, input);
console.log(result);
