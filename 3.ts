import { chunk } from "https://deno.land/std@0.167.0/collections/chunk.ts";
import { intersect } from "https://deno.land/std@0.167.0/collections/intersect.ts";
import { sumOf } from "https://deno.land/std@0.167.0/collections/sum_of.ts";
import { executeSolvers, getDayInput } from "./utils.ts";

const input = await getDayInput(import.meta.url);

function parseInput(input: string) {
  return input.split("\n");
}

type ParsedInput = ReturnType<typeof parseInput>;

const compartmentSymbol = Symbol("compartment");

type Rucksack = string;
type Compartment = string & {
  readonly [compartmentSymbol]: unique symbol;
};

function splitRucksack(rucksack: Rucksack): [Compartment, Compartment] {
  const middle = rucksack.length / 2;
  return [rucksack.slice(0, middle), rucksack.slice(middle)] as [
    Compartment,
    Compartment
  ];
}

function computeCommonItem(aPart: Compartment, bPart: Compartment) {
  const aPartSet = new Set(aPart.split(""));
  const bPartSet = new Set(bPart.split(""));
  return [...bPartSet.values()].filter((b) => aPartSet.has(b));
}

function computeItemPriority(item: string) {
  const charCode = item.charCodeAt(0);
  // a-z -> 97-122
  if (charCode >= 97 && charCode <= 122) {
    // 1-26
    return charCode - 96;
  }
  if (charCode >= 65 && charCode <= 90) {
    // 27-52
    return charCode - 38;
  }
  throw new Error("unknown item priority");
}

function computeCommonItemPriorities(rucksack: Rucksack) {
  const [firstPart, secondPart] = splitRucksack(rucksack);
  // not mentioned in puzzle, but puzzle input only has 1 common item per rucksack
  const commonItems = computeCommonItem(firstPart, secondPart);

  return sumOf(commonItems, computeItemPriority);
}

function computeCommonItemIn3([a, b, c]: [Rucksack, Rucksack, Rucksack]) {
  const aSet = new Set(a.split(""));
  const bSet = new Set(b.split(""));
  const cSet = new Set(c.split(""));
  return [...cSet.values()].filter((c) => aSet.has(c) && bSet.has(c));
}

// intersect from deno is specific for tuple of 2 intersection
// we need intersection of 3 here, so custom implementation will be more efficient
function _computeCommonItemIn3([a, b, c]: [Rucksack, Rucksack, Rucksack]) {
  return intersect(intersect(a.split(""), b.split("")), c.split(""));
}

function compute3GroupCommonItemPriorities(
  group: [Rucksack, Rucksack, Rucksack]
) {
  const commonItems = computeCommonItemIn3(group);
  return sumOf(commonItems, computeItemPriority);
}

// deno has chunk(all, number) instead
function _groupEach3Rucksack(
  allRuckacks: Array<Rucksack>
): Array<[Rucksack, Rucksack, Rucksack]> {
  return allRuckacks.reduce((grouped, current, index) => {
    const groupIndex = Math.floor(index / 3);
    const group = grouped[groupIndex] ?? [];
    group.push(current);
    grouped[groupIndex] = group;
    return grouped;
  }, [] as Array<[Rucksack, Rucksack, Rucksack]>);
}

const allSolvers = [
  (allRuckacks: ParsedInput) => {
    return sumOf(allRuckacks, computeCommonItemPriorities);
  },
  (allRuckacks: ParsedInput) => {
    return sumOf(
      chunk(allRuckacks, 3) as Array<[Rucksack, Rucksack, Rucksack]>,
      compute3GroupCommonItemPriorities
    );
  },
];

const result = executeSolvers(allSolvers, parseInput, input);
console.log(result);
