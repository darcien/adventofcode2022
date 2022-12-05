import { executeSolvers, getDayInput } from "./utils.ts";

const input = await getDayInput(import.meta.url);

type OpString = `move ${number} from ${number} to ${number}`;
type Op = {
  quantity: number;
  from: number;
  to: number;
};

type Crate = string;
type Stack = Array<Crate>;
type CrateStacks = Map<number, Stack>;

function computeCrateIndexByStackNum(n: number): number {
  // each crate width = 3 char -> n * 3
  // offset from right edge to the crate name = 1 space + 1 closing bracket + 1 name
  // -> n - 3
  // (3*n)+(n-3)
  // factor out n
  return 4 * n - 3;
}

function parseCrateStacks(lines: Array<string>): CrateStacks {
  const stackNumLine = lines.pop();
  if (!stackNumLine) {
    return new Map();
  }

  // a bit dirty but get the job done
  const stackNumbers = stackNumLine
    .trim()
    .replaceAll("   ", " ")
    .split(" ")
    .map((n) => parseInt(n, 10));

  const stackNumbersWithCrateIndex = stackNumbers.map(
    (n) => [n, computeCrateIndexByStackNum(n)] as const
  );

  return lines.reduceRight((stacks, currentLine) => {
    stackNumbersWithCrateIndex.forEach(([stackNum, crateLineIndex]) => {
      const currentStack = stacks.get(stackNum) || [];
      const crate = currentLine[crateLineIndex];
      if (crate !== " ") {
        currentStack.push(currentLine[crateLineIndex]);
        stacks.set(stackNum, currentStack);
      }
    });
    return stacks;
  }, new Map() as CrateStacks);
}

function parseOpString(op: OpString): Op {
  const [sQuantity, sFrom, sTo] = op
    .replace("move ", "")
    .replace("from ", "")
    .replace("to ", "")
    .split(" ");
  return {
    quantity: parseInt(sQuantity, 10),
    from: parseInt(sFrom, 10),
    to: parseInt(sTo, 10),
  };
}

function parseInput(input: string) {
  const lines = input.split("\n");
  const firstOp = lines.findIndex((line) => line.startsWith("move "));

  const stackWithNumLineCount = firstOp - 1;
  const stackLines = lines.slice(0, stackWithNumLineCount);

  const stacks = parseCrateStacks(stackLines);
  const ops = lines.slice(firstOp) as Array<OpString>;
  return { ops: ops.map(parseOpString), stacks };
}

type ParsedInput = ReturnType<typeof parseInput>;

function executeOpOnStacks(stacks: CrateStacks, op: Op): CrateStacks {
  let { quantity, from, to } = op;
  // This could be optimized by executing the entire op
  // on single go by checking the source stack has enough
  // quantity and reversing the moved crates before moving to target
  // to keep the ordering.
  // Okay nvm, 2nd part of the puzzle actually move all crates
  // at once, not 1 by 1.
  while (quantity > 0) {
    const sourceStack = stacks.get(from);
    if (!sourceStack) {
      throw new Error(`no source stack ${from}`);
    }
    const targetStack = stacks.get(to);
    if (!targetStack) {
      throw new Error(`no target stack ${to}`);
    }
    const crateToMove = sourceStack.pop();
    if (!crateToMove) {
      throw new Error(
        `not enough crate to move from source ${from}, ${quantity}`
      );
    }
    targetStack.push(crateToMove);
    quantity -= 1;
  }
  return stacks;
}

const allSolvers = [
  ({ ops, stacks }: ParsedInput) => {
    // Modify stacks in place
    ops.forEach((op) => executeOpOnStacks(stacks, op));

    const topCrates = [] as Array<Crate>;
    stacks.forEach((stack) => topCrates.push(stack.slice(-1)?.[0] || ""));

    return topCrates.join("");
  },
];

const result = executeSolvers(allSolvers, parseInput, input);
console.log(result);
