// CAPTCHA Performance Review — a make.fun entry for
// "Funniest One-Line Performance Review".
//
// The program writes one line, and nothing else, to the absolute path
// /output/entry.txt: the review is framed as a CAPTCHA challenge, and
// the manager's quarterly decisions are so scarce that even the
// verification step gives up on them.
//
// Node 22.18+ runs this file's TypeScript as it is; the grader runs
// Node 22.23.4.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The entry: one line, 1-140 characters, no trailing newline.
const LINE =
  "Select all squares containing a decision your manager made this quarter: [ ] [ ] [ ] — verification failed, please try again next quarter.";

// The sealed scorer's gate: UTF-8 text of 1 to 140 characters.
const MAX_CHARS = 140;

// Absolute path: the grader runs this program in a read-only sandbox,
// so a relative output/ directory would fail with exit 1.
const OUTPUT_PATH = "/output/entry.txt";

function charCount(text: string): number {
  // Count Unicode code points, not UTF-16 code units, so the em-dash
  // counts as the one character the reader sees.
  return [...text].length;
}

function validate(line: string): void {
  const chars = charCount(line);
  if (line.trim().length === 0) {
    throw new Error("entry line must not be blank");
  }
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(
      `entry line is ${chars} characters, outside the 1-${MAX_CHARS} gate`,
    );
  }
}

validate(LINE);
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, LINE, "utf8");

// Read the file back and confirm it holds exactly the line: a stray
// newline or encoding slip would change what the judge reads.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== LINE) {
  throw new Error(
    `wrote ${charCount(written)} characters, expected exactly the ${charCount(LINE)}-character entry line`,
  );
}
console.log(`wrote ${charCount(LINE)} characters to ${OUTPUT_PATH}`);
