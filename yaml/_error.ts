// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

const INDENT = 4;
const MAX_LENGTH = 75;
const DELIMITERS = "\x00\r\n\x85\u2028\u2029";

function getSnippet(buffer: string, position: number): string | null {
  if (!buffer) return null;
  let start = position;
  let end = position;
  let head = "";
  let tail = "";

  while (start > 0 && !DELIMITERS.includes(buffer.charAt(start - 1))) {
    start--;
    if (position - start > MAX_LENGTH / 2 - 1) {
      head = " ... ";
      start += 5;
      break;
    }
  }

  while (
    end < buffer.length && !DELIMITERS.includes(buffer.charAt(end))
  ) {
    end++;
    if (end - position > MAX_LENGTH / 2 - 1) {
      tail = " ... ";
      end -= 5;
      break;
    }
  }

  const snippet = buffer.slice(start, end);
  const indent = " ".repeat(INDENT);
  const caretIndent = " ".repeat(
    INDENT + position - start + head.length,
  );
  return `${indent + head + snippet + tail}\n${caretIndent}^`;
}

function stringifyMark(mark: Mark) {
  let where = `at line ${mark.line + 1}, column ${mark.column + 1}`;
  const snippet = getSnippet(mark.buffer, mark.position);
  if (snippet) where += `:\n${snippet}`;
  return where;
}

interface Mark {
  buffer: string;
  position: number;
  line: number;
  column: number;
}

export class YamlError extends Error {
  constructor(message: string, mark?: Mark) {
    super(mark ? `${message} ${stringifyMark(mark)}` : message);
    this.name = this.constructor.name;
  }
}
