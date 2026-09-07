

// -----------------------------------------------------------------------------
// Script ranges
// -----------------------------------------------------------------------------

import { hasDakuten, hasHandakuten } from "./kanadiacritics.js";
import { wrapInDoubleQuotes, wrapInSingleQuotes } from "./punctuation.js";

const HIRAGANA_LOWER = 0x3040;
const HIRAGANA_UPPER = 0x309f;

const KATAKANA_LOWER = 0x30a0;
const KATAKANA_UPPER = 0x30ff;

const KANJI_LOWER = 0x4e00;
const KANJI_UPPER = 0x9faf;


// -----------------------------------------------------------------------------
// Character utilities
// -----------------------------------------------------------------------------

export function isHiragana(c: string): boolean {
  const codePoint = c.codePointAt(0);

  if (codePoint === undefined) {
    return false;
  }

  return codePoint >= HIRAGANA_LOWER &&
    codePoint <= HIRAGANA_UPPER;
}

export function isKatakana(c: string): boolean {
  const codePoint = c.codePointAt(0);

  if (codePoint === undefined) {
    return false;
  }

  return codePoint >= KATAKANA_LOWER &&
    codePoint <= KATAKANA_UPPER;
}

export function isKanji(c: string): boolean {
  const codePoint = c.codePointAt(0);

  if (codePoint === undefined) {
    return false;
  }

  return codePoint >= KANJI_LOWER &&
    codePoint <= KANJI_UPPER;
}

export function hiraToKata(c: string): string {
  const codePoint = c.codePointAt(0);

  if (
    codePoint !== undefined &&
    codePoint >= 0x3041 &&
    codePoint <= 0x3096
  ) {
    return String.fromCodePoint(codePoint + 0x60);
  }

  return c;
}

export function kataToHira(c: string): string {
  const codePoint = c.codePointAt(0);

  if (
    codePoint !== undefined &&
    codePoint >= 0x30a1 &&
    codePoint <= 0x30f6
  ) {
    return String.fromCodePoint(codePoint - 0x60);
  }

  return c;
}


// -----------------------------------------------------------------------------
// String utilities
// -----------------------------------------------------------------------------

export function containsHiragana(s: string): boolean {
  for (const char of s) {
    if (isHiragana(char)) {
      return true;
    }
  }

  return false;
}

export function containsKatakana(s: string): boolean {
  for (const char of s) {
    if (isKatakana(char)) {
      return true;
    }
  }

  return false;
}

export function containsKanji(s: string): boolean {
  for (const char of s) {
    if (isKanji(char)) {
      return true;
    }
  }

  return false;
}

export function containsDakuten(s: string): boolean {
  return hasDakuten(s);
}

export function containsHandakuten(s: string): boolean {
  return hasHandakuten(s);
}

export function hiraToKataString(s: string): string {
  let result = "";

  for (const char of s) {
    result += hiraToKata(char);
  }

  return result;
}

export function kataToHiraString(s: string): string {
  let result = "";

  for (const char of s) {
    result += kataToHira(char);
  }

  return result;
}


// -----------------------------------------------------------------------------
// Wrapper
// -----------------------------------------------------------------------------

export interface JpnStr {
  readonly value: string;

  hasHiragana(): boolean;
  hasKatakana(): boolean;
  hasKanji(): boolean;
  hasDakuten(): boolean;
  hasHandakuten(): boolean;

  wrapInSingleQuotes(): string;
  wrapInDoubleQuotes(): string;

  hiraToKata(): string;
  kataToHira(): string;

  asRune(): string | undefined;
}

export function jpn(value: string): JpnStr {
  return {
    value,

    hasHiragana(): boolean {
      return containsHiragana(value);
    },

    hasKatakana(): boolean {
      return containsKatakana(value);
    },

    hasKanji(): boolean {
      return containsKanji(value);
    },

    hasDakuten(): boolean {
      return containsDakuten(value);
    },

    hasHandakuten(): boolean {
      return containsHandakuten(value);
    },

    wrapInSingleQuotes(): string {
      return wrapInSingleQuotes(value);
    },

    wrapInDoubleQuotes(): string {
      return wrapInDoubleQuotes(value);
    },

    hiraToKata(): string {
      return hiraToKataString(value);
    },

    kataToHira(): string {
      return kataToHiraString(value);
    },

    asRune(): string | undefined {
      return value[Symbol.iterator]().next().value;
    },
  };
}

export function asRune(value: any) {
  return value[Symbol.iterator]().next().value;
}

// -----------------------------------------------------------------------------
// Script analysis
// -----------------------------------------------------------------------------

export enum JpnScript {
  Hiragana,
  Katakana,
  Kanji,
  Other,
}

export function scriptOf(r: string): JpnScript {
  if (isHiragana(r)) {
    return JpnScript.Hiragana;
  }

  if (isKatakana(r)) {
    return JpnScript.Katakana;
  }

  if (isKanji(r)) {
    return JpnScript.Kanji;
  }

  return JpnScript.Other;
}

export function containsOnly(
  s: string,
  allowed: Set<JpnScript>,
): boolean {
  for (const char of s) {
    if (!allowed.has(scriptOf(char))) {
      return false;
    }
  }

  return true;
}


// -----------------------------------------------------------------------------
// Script summary
// -----------------------------------------------------------------------------

export interface JpnScriptSummary {
  hiragana: number;
  katakana: number;
  kanji: number;
  other: number;
}

export function scriptSummary(s: string): JpnScriptSummary {
  const result: JpnScriptSummary = {
    hiragana: 0,
    katakana: 0,
    kanji: 0,
    other: 0,
  };

  for (const char of s) {
    switch (scriptOf(char)) {
      case JpnScript.Hiragana:
        result.hiragana++;
        break;

      case JpnScript.Katakana:
        result.katakana++;
        break;

      case JpnScript.Kanji:
        result.kanji++;
        break;

      case JpnScript.Other:
        result.other++;
        break;
    }
  }

  return result;
}
