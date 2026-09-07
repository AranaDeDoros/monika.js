
# Monika.js

Port from the nim library [Monika](https://github.com/AranaDeDoros/Monika/).

## Usage

```typescript
import {
  containsHiragana,
  containsKatakana,
  containsKanji,
  toHalfWidth,
  hasDakuten,
  wrapInSingleQuotes,
  wrapInDoubleQuotes,
  asRune,
  hiraToKata,
  kataToHira,
  containsOnly,
  scriptSummary,
  JpnScript,
  jpn,
} from "monika";

if (containsHiragana("こんにちは")) {
  console.log("Contains Hiragana!");
}

if (containsKatakana("モニカ")) {
  console.log("Contains Katakana!");
}

if (containsKanji("学校")) {
  console.log("Contains Kanji!");
}

// Full-width to half-width
console.log(toHalfWidth("ハロー、ワールド！"));
// Output: ﾊﾛｰ､ﾜｰﾙﾄﾞ!

// Check for voiced marks
if (hasDakuten("が")) {
  console.log("This character is voiced.");
}

console.log(wrapInSingleQuotes("Hello"));
// Output: 「Hello」

console.log(wrapInDoubleQuotes("Hello"));
// Output: 『Hello』

const h = asRune("が");
const k = asRune("エ");

if (h !== undefined) {
  console.log(hiraToKata(h));
  // Output: ガ
} else {
  console.log("empty string");
}

if (k !== undefined) {
  console.log(kataToHira(k));
  // Output: え
} else {
  console.log("empty string");
}

const str = "日本語abcカナ";

console.log(
  containsOnly(
    str,
    new Set([
      JpnScript.Kanji,
      JpnScript.Katakana,
    ]),
  ),
);
// Output: false

const summary = scriptSummary(str);

console.log(summary.hiragana); // 0
console.log(summary.katakana); // 2
console.log(summary.kanji);    // 3
console.log(summary.other);    // 3
````

## Fluent API

For a more object-oriented style, you can wrap a string with `jpn()`.

```typescript
const text = jpn("日本語abcカナ");

text.hasHiragana();    // false
text.hasKatakana();    // true
text.hasKanji();       // true
text.hasDakuten();     // false
text.hasHandakuten();  // false

text.hiraToKata();     // "日本語abcカナ"
text.kataToHira();     // "日本語abcかな"

text.wrapInSingleQuotes(); // "「日本語abcカナ」"
text.wrapInDoubleQuotes(); // "『日本語abcカナ』"

text.asRune();         // "日"
```

The factory is useful when performing multiple operations on the same string:

```typescript
const japanese = jpn("がっこう");

if (japanese.hasHiragana()) {
  console.log(japanese.hiraToKata());
  // ガッコウ
}
```

The wrapped value is available through `.value`:

```typescript
const japanese = jpn("こんにちは");

console.log(japanese.value);
// こんにちは
```

For one-off operations, the standalone functions are usually simpler:

```typescript
containsHiragana("こんにちは");
scriptSummary("日本語abcカナ");
toHalfWidth("ハロー！");
```

Use `jpn()` when you prefer a fluent API or want to perform several operations on the same string.
 