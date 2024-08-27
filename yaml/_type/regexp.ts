// Ported and adapted from js-yaml-js-types v1.0.0:
// https://github.com/nodeca/js-yaml-js-types/tree/ac537e7bbdd3c2cbbd9882ca3919c520c2dc022b
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import type { Type } from "../_type.ts";

const REGEXP = /^\/(?<regexp>[\s\S]+)\/(?<modifiers>[gismuy]*)$/;

export const regexp: Type<"scalar", RegExp> = {
  tag: "tag:yaml.org,2002:js/regexp",
  kind: "scalar",
  resolve(data: string): boolean {
    if (typeof data !== "string" || !data.length) return false;

    const regexp = `${data}`;
    if (regexp.charAt(0) === "/") {
      // Ensure regex is properly terminated
      // Check no duplicate modifiers
      const groups = regexp.match(REGEXP)?.groups as { modifiers: string };
      if (!groups) return false;
      const modifiers = groups.modifiers.split("");
      if (new Set(modifiers).size < modifiers.length) return false;
    }
    return true;
  },
  construct(data: string) {
    const { regexp = `${data}`, modifiers = "" } =
      `${data}`.match(REGEXP)?.groups ?? {};
    return new RegExp(regexp, modifiers);
  },
  predicate(object: unknown) {
    return object instanceof RegExp;
  },
  represent(object: RegExp) {
    return object.toString();
  },
};
