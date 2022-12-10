import { globToRegExp } from "https://deno.land/std@0.167.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.167.0/fs/walk.ts";
import { loadDay } from "./utils.ts";

// +(xxx) -> matches 1 or more xxx pattern, requires extended: true.
// [[:digit:]] -> matches any digit(0-9).
// .ts -> no special behavior, glob for extension.
const solutionFilesGlob = "+([[:digit:]]).ts";
const solutionFilesRegex = globToRegExp(solutionFilesGlob, { extended: true });

async function registerBench(day: number) {
  const { allSolvers, parseInput, dayInput } = await loadDay(day, {
    useInputFile: true,
  });

  const lastSolver = allSolvers.pop();
  if (!lastSolver) {
    throw new Error("missing solver");
  }

  const parsed = parseInput(dayInput);

  Deno.bench({
    name: `${day}.ts`,
    fn: () => {
      lastSolver(parsed);
    },
  });
}

for await (const entry of walk(".", {
  maxDepth: 1,
  includeDirs: false,
  match: [solutionFilesRegex],
})) {
  const day = parseInt(entry.name.split(".ts").shift() || "", 10);
  await registerBench(day);
}
