// How Many Tabs Do You Have Open? — entry program.
// Writes exactly one number, in digits, to /output/entry.txt.
// The number is the honest count of browser tabs open on the day
// the entry was built: 137. Not a round number, not a guess —
// a tab hoarder's real count, counted tab by tab.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TAB_COUNT = "137";

function isDigitsOnly(text: string): boolean {
  return /^[0-9]+$/.test(text);
}

function main(): void {
  // The gate wants exactly one number, 1-5 characters, digits only.
  if (TAB_COUNT.length < 1 || TAB_COUNT.length > 5) {
    throw new Error(`tab count must be 1-5 characters, got ${TAB_COUNT.length}`);
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

  // Read it back and confirm it matches byte for byte.
  const written = readFileSync(entryPath, "utf8");
  if (written !== TAB_COUNT) {
    throw new Error(
      `entry.txt mismatch: wrote ${JSON.stringify(TAB_COUNT)}, read back ${JSON.stringify(written)}`,
    );
  }
  console.log(`wrote ${TAB_COUNT.length} characters to ${entryPath}`);
}

main();
