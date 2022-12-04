export function getFileName(
  path: string,
  { trimExt = false }: { trimExt?: boolean } = {}
) {
  const fileNameWithExt = path.split("/").pop();
  if (!fileNameWithExt) {
    return null;
  }
  if (trimExt) {
    const lastDot = fileNameWithExt.lastIndexOf(".");
    return fileNameWithExt.slice(0, lastDot);
  }

  return fileNameWithExt;
}

async function readTextFile(path: string | URL) {
  const textFile = await Deno.readTextFile(path);
  if (textFile.endsWith("\n")) {
    return textFile.slice(0, -1);
  }
  return textFile;
}

export async function loadInput(day: string) {
  const useSampleData = !Deno.args.includes("--submit");

  if (useSampleData) {
    const sample = `./${day}.sample.txt`;
    return readTextFile(sample);
  }

  const input = `./${day}.input.txt`;
  try {
    return await readTextFile(input);
  } catch (error) {
    console.log(`No input for #${day}`);
    throw error;
  }
}

export async function getDayInput(metaUrl: string) {
  const day = getFileName(metaUrl, { trimExt: true }) ?? "";
  const input = await loadInput(day);
  return input;
}

export function executeSolvers<T>(
  solvers: Array<(parsedInput: T) => unknown>,
  parseInput: (input: string) => T,
  input: string
) {
  const lastSolver = solvers.pop();
  if (lastSolver) {
    const parsed = parseInput(input);
    return lastSolver(parsed);
  }
  return null;
}
