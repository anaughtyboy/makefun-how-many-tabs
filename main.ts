// How Many Tabs Do You Have Open? — entry program.
// Writes exactly one number, in digits, to /output/entry.txt.
// The number is the honest count of browser tabs open on the day
// the entry was built: 137. Not a round number, not a guess —
// a tab hoarder's real count, counted tab by tab.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The gate's limits for this competition: exactly one number, 1-5 digits.
const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 5;

const TAB_COUNT = "137";

function isDigitsOnly(text: string): boolean {
  return /^[0-9]+$/.test(text);
}

function main(): void {
  // The gate wants exactly one number, 1-5 characters, digits only.
  if (TAB_COUNT.length < GATE_MIN_CHARS || TAB_COUNT.length > GATE_MAX_CHARS) {
    throw new Error(
      `tab count must be ${GATE_MIN_CHARS}-${GATE_MAX_CHARS} characters, got ${TAB_COUNT.length}`,
    );
  }
  if (!isDigitsOnly(TAB_COUNT)) {
    throw new Error(`tab count must be digits only, got ${JSON.stringify(TAB_COUNT)}`);
  }
  if (TAB_COUNT.trim() !== TAB_COUNT) {
    throw new Error("tab count must not have leading or trailing whitespace");
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });
  const entryPath = join(outputDir, "entry.txt");

  // No trailing newline: the file holds exactly the digits, nothing else.
  writeFileSync(entryPath, TAB_COUNT, "utf8");

  // Read it back as bytes and confirm it matches exactly: same digits,
  // and no trailing newline byte (0x0A) sneaking in at the end.
  const writtenBytes = readFileSync(entryPath);
  const expectedBytes = Buffer.from(TAB_COUNT, "utf8");
  if (!writtenBytes.equals(expectedBytes)) {
    throw new Error(
      `entry.txt mismatch: wrote ${JSON.stringify(TAB_COUNT)}, read back ${JSON.stringify(writtenBytes.toString("utf8"))}`,
    );
  }
  if (writtenBytes[writtenBytes.length - 1] === 0x0a) {
    throw new Error("entry.txt must not end with a newline");
  }
  console.log(`wrote ${TAB_COUNT.length} characters to ${entryPath}`);
}

main();
