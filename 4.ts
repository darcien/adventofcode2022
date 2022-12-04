import { executeSolvers, getDayInput } from "./utils.ts";

const input = await getDayInput(import.meta.url);

type StringRange = `${number}-${number}`;
type StringRangePair = `${StringRange},${StringRange}`;
type Range = [number, number];
type RangePair = [Range, Range];

function parseInput(input: string) {
  return input.split("\n") as Array<StringRangePair>;
}

type ParsedInput = ReturnType<typeof parseInput>;

function parseStringRange(r: StringRange): Range {
  return r.split("-").map((n) => parseFloat(n)) as Range;
}

function splitPair(pair: StringRangePair): RangePair {
  const [a, b] = pair.split(",") as [StringRange, StringRange];
  return [parseStringRange(a), parseStringRange(b)];
}

function doesATotallyContainB(a: Range, b: Range) {
  const [aHead, aTail] = a;
  const [bHead, bTail] = b;
  if (aHead <= bHead && aTail >= bTail) {
    return true;
  }
  return false;
}

function doesAPartiallyContainB(a: Range, b: Range) {
  const [aHead, aTail] = a;
  const [bHead, bTail] = b;
  if (
    (bHead >= aHead && bHead <= aTail) ||
    (bTail <= aTail && bTail >= aHead)
  ) {
    return true;
  }
  return false;
}

function checkTotalOverlap(x: Range, y: Range) {
  return doesATotallyContainB(x, y) || doesATotallyContainB(y, x);
}

function checkPartialOverlap(x: Range, y: Range) {
  return doesAPartiallyContainB(x, y) || doesAPartiallyContainB(y, x);
}

const allSolvers = [
  // each line: 2-4,6-8
  (rangePairs: ParsedInput) => {
    return rangePairs.filter((rangePair) => {
      const [a, b] = splitPair(rangePair);
      return checkTotalOverlap(a, b);
    }).length;
  },
  (rangePairs: ParsedInput) => {
    return rangePairs.filter((rangePair) => {
      const [a, b] = splitPair(rangePair);
      return checkPartialOverlap(a, b);
    }).length;
  },
];

const result = executeSolvers(allSolvers, parseInput, input);
console.log(result);
