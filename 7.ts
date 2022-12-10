import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { sumOf } from "https://deno.land/std@0.167.0/collections/sum_of.ts";

type LsFile = {
  name: string;
  size: number;
};
type LsDir = {
  name: string;
};

type CdCommand = {
  command: "cd";
  path: string;
};

type LsCommand = {
  command: "ls";
  result: {
    dirs: Array<LsDir>;
    files: Array<LsFile>;
  };
};

type ExecutedCommand = CdCommand | LsCommand;

function parseCdArgs(args: Array<string>): CdCommand {
  const path = args.at(0)?.trim() || "";

  // No support for cd-ing to home dir etc.
  assert(path !== "", `cd: path must be specified: ${path}, ${args}`);

  return {
    command: "cd",
    path,
  };
}

function parseLsResult(resultLines: Array<string>): LsCommand {
  const [dirs, files] = [[] as Array<LsDir>, [] as Array<LsFile>];
  for (const resultLine of resultLines) {
    const [dirOrSize, name] = resultLine.split(" ", 2);
    assert(
      name.trim().length > 0,
      `ls: name must contain non-whitespaces char: ${name}, ${resultLines}`
    );

    if (dirOrSize === "dir") {
      dirs.push({ name });
    } else {
      const size = parseInt(dirOrSize, 10);
      assert(
        !Number.isNaN(size),
        `ls: size should be not NaN: ${dirOrSize},${resultLines}`
      );
      assert(
        Number.isFinite(size),
        `ls: size should be finite: ${dirOrSize},${resultLines}`
      );
      assert(
        size >= 0,
        `ls: size should be a positive integer or 0: ${dirOrSize},${resultLines}`
      );
      files.push({ name, size });
    }
  }

  return {
    command: "ls",
    result: {
      dirs,
      files,
    },
  };
}

function parseExecutedCommandString(commandWithResult: string) {
  const [commandWithArgs, ...result] = commandWithResult.split("\n");
  const [command, ...args] = commandWithArgs.split(" ");

  switch (command) {
    case "cd":
      return parseCdArgs(args);
    case "ls":
      return parseLsResult(result);
    default:
      throw new Error(`unknown command: ${command}`);
  }
}

const separator = /[\r\n|\r|\n]?\$ /g;
export function parseInput(input: string) {
  return input.split(separator).slice(1).map(parseExecutedCommandString);
}

type ParsedInput = ReturnType<typeof parseInput>;

type DirContent = {
  dirs: Map<string, FsDir>;
  files: Map<string, LsFile>;
};

type SharedDirStruct = {
  content: DirContent;
  meta: {
    totalSize: number;
  };
};

type FsDir = SharedDirStruct & {
  name: string;
  parent: FsDir | RootDir;
};

type RootDir = SharedDirStruct & {
  name: "/";
  parent: null;
};

function populateCurrentDirDirs(
  currentDir: FsDir | RootDir,
  dirs: Array<LsDir>
) {
  for (const dir of dirs) {
    if (currentDir.content.dirs.get(dir.name)) {
      console.log(
        `ls: found 2 dir with same name in ${currentDir.name}, ${dir.name}`
      );
    }
    currentDir.content.dirs.set(dir.name, {
      name: dir.name,
      content: {
        dirs: new Map(),
        files: new Map(),
      },
      meta: {
        totalSize: 0,
      },
      parent: currentDir,
    });
  }
}

function populateCurrentDirFiles(
  currentDir: FsDir | RootDir,
  files: Array<LsFile>
) {
  for (const file of files) {
    const { name, size } = file;
    if (currentDir.content.files.get(name)) {
      console.log(
        `ls: found 2 file with same name in ${currentDir.name}, ${name}`
      );
    }
    currentDir.content.files.set(name, { name, size });
    currentDir.meta.totalSize += size;
    let parent = currentDir.parent;
    while (parent != null) {
      parent.meta.totalSize += size;
      parent = parent.parent;
    }
  }
}

function buildFileSystemFromExecutedCommands(
  executedCommands: Array<ExecutedCommand>
): RootDir {
  const commands = [...executedCommands];

  const root: RootDir = {
    name: "/",
    content: {
      dirs: new Map(),
      files: new Map(),
    },
    meta: {
      totalSize: 0,
    },
    parent: null,
  };

  let currentDir: FsDir | RootDir = root;

  while (commands.length > 0) {
    const commandToExec = commands.shift()!;

    switch (commandToExec.command) {
      case "cd": {
        const { path } = commandToExec;
        switch (path) {
          case "/":
            currentDir = root;
            break;
          case "..":
            currentDir = currentDir.parent || root;
            break;
          default: {
            const targetDir: FsDir | undefined =
              currentDir.content.dirs?.get(path);
            assert(
              targetDir != null,
              `cd: target dir does not exist, ${targetDir}`
            );
            currentDir = targetDir;
            break;
          }
        }
        break;
      }
      case "ls": {
        const { result } = commandToExec;
        populateCurrentDirDirs(currentDir, result.dirs);
        populateCurrentDirFiles(currentDir, result.files);
        break;
      }
    }
  }

  return root;
}

function findAllDirWith(
  fs: RootDir | FsDir,
  predicate: (dir: RootDir | FsDir) => boolean
): Array<RootDir | FsDir> {
  const foundDirs = [];

  if (predicate(fs)) {
    foundDirs.push(fs);
  }

  if (fs.content.dirs.size > 0) {
    const foundContainedDirs = [...fs.content.dirs.values()].flatMap((dir) =>
      findAllDirWith(dir, predicate)
    );
    foundDirs.push(...foundContainedDirs);
  }

  return foundDirs;
}

export const allSolvers = [
  (executedCommands: ParsedInput) => {
    const fs = buildFileSystemFromExecutedCommands(executedCommands);

    // console.dir(fs, { depth: 100 });

    return sumOf(
      findAllDirWith(fs, (dir) => dir.meta.totalSize < 100000),
      (dir) => dir.meta.totalSize
    );
  },
  (executedCommands: ParsedInput) => {
    const totalDiskSpace = 70000000;
    const neededSpace = 30000000;
    const fs = buildFileSystemFromExecutedCommands(executedCommands);

    const freeSpace = totalDiskSpace - fs.meta.totalSize;
    const sizeToFreeUp = neededSpace - freeSpace;

    const deletionCandidate = findAllDirWith(
      fs,
      (dir) => dir.meta.totalSize > sizeToFreeUp
    ).sort((a, b) => a.meta.totalSize - b.meta.totalSize);

    const smallest = deletionCandidate.shift();

    return smallest?.meta.totalSize;
  },
];
