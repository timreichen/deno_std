// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { INVALID } from "./constants.ts";
import { SemVer } from "./types.ts";

export const OPERATORS = [
  "",
  "=",
  "==",
  "===",
  "!==",
  "!=",
  ">",
  ">=",
  "<",
  "<=",
] as const;

export function isInvalid(semver: SemVer) {
  return (
    semver.major === INVALID.major &&
    semver.minor === INVALID.minor &&
    semver.patch === INVALID.patch &&
    semver.prerelease?.length === 0 &&
    semver.build?.length === 0
  );
}
export function isAny(semver: SemVer) {
  return (
    isNaN(semver.major) &&
    isNaN(semver.minor) &&
    isNaN(semver.patch) &&
    semver.prerelease?.length === 0 &&
    semver.build?.length === 0
  );
}
