import { executeSolvers, getDayInput } from "./utils.ts";

const input = await getDayInput(import.meta.url);

type OpponentMove = "A" | "B" | "C";
type MyMove = "X" | "Y" | "Z";
type Round = `${OpponentMove} ${MyMove}`;

// part 2 XYZ have different meaning with part 1
type RoundResult = "X" | "Y" | "Z";
type RoundFromPart2 = `${OpponentMove} ${RoundResult}`;
type RPS = "R" | "P" | "S";

function parseInput(input: string) {
  return input.split("\n") as Array<Round>;
}

function computeMyMoveScore(myMove: MyMove | RPS) {
  switch (myMove) {
    case "X":
    case "R":
      return 1;
    case "Y":
    case "P":
      return 2;
    case "Z":
    case "S":
      return 3;
  }
}

function mapMoveToRps(move: OpponentMove | MyMove | RPS): RPS {
  switch (move) {
    case "A":
    case "X":
    case "R":
      return "R";
    case "B":
    case "Y":
    case "P":
      return "P";
    case "C":
    case "Z":
    case "S":
      return "S";
  }
}

function computeWinningMove(move: RPS): RPS {
  switch (move) {
    case "R":
      return "P";
    case "P":
      return "S";
    case "S":
      return "R";
  }
}

function computeLosingMove(move: RPS): RPS {
  switch (move) {
    case "R":
      return "S";
    case "P":
      return "R";
    case "S":
      return "P";
  }
}

function computeRoundResultScore(oppMove: OpponentMove, myMove: MyMove | RPS) {
  const rpsOppMove = mapMoveToRps(oppMove);
  const rpsMyMove = mapMoveToRps(myMove);

  // a draw
  if (rpsOppMove === rpsMyMove) {
    return 3;
  }

  if (rpsMyMove === computeWinningMove(rpsOppMove)) {
    return 6;
  }

  return 0;
}

function computeRoundScore(round: Round) {
  const [oppMove, myMove] = round.split(" ") as [OpponentMove, MyMove];
  const myMoveScore = computeMyMoveScore(myMove);

  const roundResult = computeRoundResultScore(oppMove, myMove);
  return roundResult + myMoveScore;
}

function computeMyMove(rResult: RoundResult, oppMove: OpponentMove): RPS {
  const rpsOppMove = mapMoveToRps(oppMove);
  // draw
  if (rResult === "Y") {
    return rpsOppMove;
  }
  // winning
  if (rResult === "Z") {
    return computeWinningMove(rpsOppMove);
  }

  return computeLosingMove(rpsOppMove);
}

function computeRoundTotalScorePart2(round: RoundFromPart2) {
  const [oppMove, roundResult] = round.split(" ") as [
    OpponentMove,
    RoundResult
  ];
  const myMove = computeMyMove(roundResult, oppMove);
  const myMoveScore = computeMyMoveScore(myMove);

  const roundResultScore = computeRoundResultScore(oppMove, myMove);
  return roundResultScore + myMoveScore;
}

type ParsedInput = ReturnType<typeof parseInput>;

const allSolvers = [
  (parsedInput: ParsedInput) => {
    const totalScore = parsedInput.reduce(
      (total, current) => total + computeRoundScore(current),
      0
    );

    return totalScore;
  },
  (parsedInput: ParsedInput) => {
    const totalScore = parsedInput.reduce(
      (total, current) => total + computeRoundTotalScorePart2(current),
      0
    );

    return totalScore;
  },
];

const result = executeSolvers(allSolvers, parseInput, input);
console.log(result);
