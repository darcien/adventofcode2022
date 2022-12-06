export function parseInput(input: string) {
  return input.split("\n").at(0) || "";
}

type ParsedInput = ReturnType<typeof parseInput>;

function isEveryCharDifferent(window: string) {
  return window.length === new Set(window).size;
}

const startOfPacketWindowSize = 4;
const startOfMessageWindowSize = 14;

function findCharCountAfterFirstMarker(
  stream: string,
  windowSize: number
): number {
  if (stream.length < windowSize) {
    return -1;
  }

  let charCount = windowSize;
  while (charCount < stream.length) {
    const from = charCount - windowSize;
    const to = charCount;
    const currWindow = stream.slice(from, to);

    if (isEveryCharDifferent(currWindow)) {
      return charCount;
    }

    charCount += 1;
  }

  return -1;
}

export const allSolvers = [
  (stream: ParsedInput) => {
    return findCharCountAfterFirstMarker(stream, startOfPacketWindowSize);
  },
  (stream: ParsedInput) => {
    return findCharCountAfterFirstMarker(stream, startOfMessageWindowSize);
  },
];
