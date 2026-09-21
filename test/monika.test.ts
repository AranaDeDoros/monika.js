import {
    containsHiragana,
    containsKatakana,
    containsKanji,
    toHalfWidth,
    hasDakuten,
    hasHandakuten,
    wrapInSingleQuotes,
    wrapInDoubleQuotes,
    asRune,
    hiraToKata,
    kataToHira,
    containsOnly,
    scriptSummary,
    JpnScript,
    jpn,
} from "monika.js";

describe("Japanese string utilities", () => {
    describe("containsHiragana", () => {
        test("returns true when string contains Hiragana", () => {
            expect(containsHiragana("こんにちは")).toBe(true);
            expect(containsHiragana("abcこんにちはxyz")).toBe(true);
        });

        test("returns false when string contains no Hiragana", () => {
            expect(containsHiragana("モニカ")).toBe(false);
            expect(containsHiragana("日本語")).toBe(false);
            expect(containsHiragana("abc")).toBe(false);
        });

        test("handles empty strings", () => {
            expect(containsHiragana("")).toBe(false);
        });
    });

    describe("containsKatakana", () => {
        test("returns true when string contains Katakana", () => {
            expect(containsKatakana("モニカ")).toBe(true);
            expect(containsKatakana("abcモニカxyz")).toBe(true);
        });

        test("returns false when string contains no Katakana", () => {
            expect(containsKatakana("こんにちは")).toBe(false);
            expect(containsKatakana("日本語")).toBe(false);
            expect(containsKatakana("abc")).toBe(false);
        });

        test("handles empty strings", () => {
            expect(containsKatakana("")).toBe(false);
        });
    });

    describe("containsKanji", () => {
        test("returns true when string contains Kanji", () => {
            expect(containsKanji("学校")).toBe(true);
            expect(containsKanji("日本語abc")).toBe(true);
        });

        test("returns false when string contains no Kanji", () => {
            expect(containsKanji("こんにちは")).toBe(false);
            expect(containsKanji("モニカ")).toBe(false);
            expect(containsKanji("abc")).toBe(false);
        });

        test("handles empty strings", () => {
            expect(containsKanji("")).toBe(false);
        });
    });

    describe("toHalfWidth", () => {
        test("converts full-width ASCII characters", () => {
            expect(toHalfWidth("ＡＢＣ")).toBe("ABC");
            expect(toHalfWidth("１２３")).toBe("123");
            expect(toHalfWidth("！＠＃")).toBe("!@#");
        });

        test("converts full-width Japanese punctuation", () => {
            expect(toHalfWidth("、。")).toBe("､｡");
            expect(toHalfWidth("「」")).toBe("｢｣");
            expect(toHalfWidth("・ー")).toBe("･ｰ");
        });

        test("converts Katakana", () => {
            expect(toHalfWidth("ハロー")).toBe("ﾊﾛｰ");
            expect(toHalfWidth("モニカ")).toBe("ﾓﾆｶ");
        });

        test("converts voiced Katakana", () => {
            expect(toHalfWidth("ガギグゲゴ")).toBe("ｶﾞｷﾞｸﾞｹﾞｺﾞ");
            expect(toHalfWidth("ザジズゼゾ")).toBe("ｻﾞｼﾞｽﾞｾﾞｿﾞ");
            expect(toHalfWidth("ダヂヅデド")).toBe("ﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞ");
            expect(toHalfWidth("バビブベボ")).toBe("ﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞ");
            expect(toHalfWidth("パピプペポ")).toBe("ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ");
            expect(toHalfWidth("ヴ")).toBe("ｳﾞ");
        });

        test("converts small Katakana", () => {
            expect(toHalfWidth("ァィゥェォ")).toBe("ｧｨｩｪｫ");
            expect(toHalfWidth("ッャュョ")).toBe("ｯｬｭｮ");
        });

        test("leaves Hiragana unchanged", () => {
            expect(toHalfWidth("こんにちは")).toBe("こんにちは");
        });

        test("leaves Kanji unchanged", () => {
            expect(toHalfWidth("日本語")).toBe("日本語");
        });

        test("leaves already half-width text unchanged", () => {
            expect(toHalfWidth("ABC123!")).toBe("ABC123!");
        });

        test("matches the README example", () => {
            expect(toHalfWidth("ハロー、ワールド！")).toBe("ﾊﾛｰ､ﾜｰﾙﾄﾞ!");
        });

        test("handles empty strings", () => {
            expect(toHalfWidth("")).toBe("");
        });
    });

    describe("hasDakuten", () => {
        test("detects voiced characters", () => {
            expect(hasDakuten("が")).toBe(true);
            expect(hasDakuten("ガ")).toBe(true);
            expect(hasDakuten("ぎ")).toBe(true);
            expect(hasDakuten("ヴ")).toBe(true);
        });

        test("detects dakuten in longer strings", () => {
            expect(hasDakuten("がっこう")).toBe(true);
            expect(hasDakuten("モニカ")).toBe(false);
        });

        test("returns false when no dakuten is present", () => {
            expect(hasDakuten("かきくけこ")).toBe(false);
            expect(hasDakuten("こんにちは")).toBe(false);
            expect(hasDakuten("")).toBe(false);
        });
    });

    describe("hasHandakuten", () => {
        test("detects handakuten characters", () => {
            expect(hasHandakuten("ぱ")).toBe(true);
            expect(hasHandakuten("パ")).toBe(true);
            expect(hasHandakuten("ぴ")).toBe(true);
        });

        test("returns false for dakuten-only strings", () => {
            expect(hasHandakuten("が")).toBe(false);
            expect(hasHandakuten("ガ")).toBe(false);
        });

        test("returns false when no handakuten is present", () => {
            expect(hasHandakuten("はひふへほ")).toBe(false);
            expect(hasHandakuten("")).toBe(false);
        });
    });

    describe("wrapInSingleQuotes", () => {
        test("wraps text in Japanese single quotes", () => {
            expect(wrapInSingleQuotes("Hello")).toBe("「Hello」");
        });

        test("wraps Japanese text", () => {
            expect(wrapInSingleQuotes("こんにちは")).toBe("「こんにちは」");
        });

        test("handles empty strings", () => {
            expect(wrapInSingleQuotes("")).toBe("「」");
        });
    });

    describe("wrapInDoubleQuotes", () => {
        test("wraps text in Japanese double quotes", () => {
            expect(wrapInDoubleQuotes("Hello")).toBe("『Hello』");
        });

        test("wraps Japanese text", () => {
            expect(wrapInDoubleQuotes("こんにちは")).toBe("『こんにちは』");
        });

        test("handles empty strings", () => {
            expect(wrapInDoubleQuotes("")).toBe("『』");
        });
    });

    describe("asRune", () => {
        test("returns the first character", () => {
            expect(asRune("が")).toBe("が");
            expect(asRune("エ")).toBe("エ");
            expect(asRune("日本語")).toBe("日");
        });

        test("returns the first Unicode code point", () => {
            expect(asRune("😀hello")).toBe("😀");
        });

        test("returns undefined for an empty string", () => {
            expect(asRune("")).toBeUndefined();
        });

        test("only returns the first code point", () => {
            expect(asRune("こんにちは")).toBe("こ");
        });
    });

    describe("hiraToKata", () => {
        test("converts Hiragana to Katakana", () => {
            expect(hiraToKata("が")).toBe("ガ");
            expect(hiraToKata("あ")).toBe("ア");
            expect(hiraToKata("ん")).toBe("ン");
        });

        test("matches the README example", () => {
            expect(hiraToKata("が")).toBe("ガ");
        });

        test("leaves non-Hiragana characters unchanged", () => {
            expect(hiraToKata("A")).toBe("A");
            expect(hiraToKata("日")).toBe("日");
            expect(hiraToKata("カ")).toBe("カ");
        });
    });

    describe("kataToHira", () => {
        test("converts Katakana to Hiragana", () => {
            expect(kataToHira("ガ")).toBe("が");
            expect(kataToHira("ア")).toBe("あ");
            expect(kataToHira("ン")).toBe("ん");
        });

        test("matches the README example", () => {
            expect(kataToHira("エ")).toBe("え");
        });

        test("leaves non-Katakana characters unchanged", () => {
            expect(kataToHira("A")).toBe("A");
            expect(kataToHira("日")).toBe("日");
            expect(kataToHira("か")).toBe("か");
        });
    });

    describe("containsOnly", () => {
        test("accepts strings containing only allowed scripts", () => {
            const allowed = new Set([
                JpnScript.Kanji,
                JpnScript.Katakana,
            ]);

            expect(containsOnly("日本語カナ", allowed)).toBe(true);
        });

        test("rejects strings containing disallowed scripts", () => {
            const allowed = new Set([
                JpnScript.Kanji,
                JpnScript.Katakana,
            ]);

            expect(containsOnly("日本語abcカナ", allowed)).toBe(false);
        });

        test("accepts Hiragana when Hiragana is allowed", () => {
            const allowed = new Set([
                JpnScript.Hiragana,
                JpnScript.Katakana,
            ]);

            expect(containsOnly("こんにちはカナ", allowed)).toBe(true);
        });

        test("rejects empty strings when no scripts are allowed", () => {
            expect(containsOnly("", new Set())).toBe(true);
        });

        test("accepts any text when all script categories are allowed", () => {
            const allowed = new Set([
                JpnScript.Hiragana,
                JpnScript.Katakana,
                JpnScript.Kanji,
                JpnScript.Other,
            ]);

            expect(containsOnly("日本語こんにちはカナabc", allowed)).toBe(true);
        });
    });

    describe("scriptSummary", () => {
        test("counts each script correctly", () => {
            const summary = scriptSummary("日本語abcカナ");

            expect(summary.hiragana).toBe(0);
            expect(summary.katakana).toBe(2);
            expect(summary.kanji).toBe(3);
            expect(summary.other).toBe(3);
        });

        test("counts Hiragana", () => {
            const summary = scriptSummary("こんにちは");

            expect(summary.hiragana).toBe(5);
            expect(summary.katakana).toBe(0);
            expect(summary.kanji).toBe(0);
            expect(summary.other).toBe(0);
        });

        test("counts Katakana", () => {
            const summary = scriptSummary("モニカ");

            expect(summary.hiragana).toBe(0);
            expect(summary.katakana).toBe(3);
            expect(summary.kanji).toBe(0);
            expect(summary.other).toBe(0);
        });

        test("counts Kanji", () => {
            const summary = scriptSummary("日本語");

            expect(summary.hiragana).toBe(0);
            expect(summary.katakana).toBe(0);
            expect(summary.kanji).toBe(3);
            expect(summary.other).toBe(0);
        });

        test("counts Other characters", () => {
            const summary = scriptSummary("abc123!");

            expect(summary.hiragana).toBe(0);
            expect(summary.katakana).toBe(0);
            expect(summary.kanji).toBe(0);
            expect(summary.other).toBe(7);
        });

        test("handles mixed Japanese and non-Japanese text", () => {
            expect(scriptSummary("日本語こんにちはカナabc")).toEqual({
                hiragana: 5,
                katakana: 2,
                kanji: 3,
                other: 3,
            });
        });

        test("handles empty strings", () => {
            expect(scriptSummary("")).toEqual({
                hiragana: 0,
                katakana: 0,
                kanji: 0,
                other: 0,
            });
        });
    });

    describe("jpn()", () => {
        test("exposes the original value", () => {
            const text = jpn("こんにちは");

            expect(text.value).toBe("こんにちは");
        });

        test("provides hasHiragana()", () => {
            expect(jpn("こんにちは").hasHiragana()).toBe(true);
            expect(jpn("モニカ").hasHiragana()).toBe(false);
        });

        test("provides hasKatakana()", () => {
            expect(jpn("モニカ").hasKatakana()).toBe(true);
            expect(jpn("こんにちは").hasKatakana()).toBe(false);
        });

        test("provides hasKanji()", () => {
            expect(jpn("日本語").hasKanji()).toBe(true);
            expect(jpn("こんにちは").hasKanji()).toBe(false);
        });

        test("provides hasDakuten()", () => {
            expect(jpn("がっこう").hasDakuten()).toBe(true);
            expect(jpn("こんにちは").hasDakuten()).toBe(false);
        });

        test("provides hasHandakuten()", () => {
            expect(jpn("ぱん").hasHandakuten()).toBe(true);
            expect(jpn("がっこう").hasHandakuten()).toBe(false);
        });

        test("provides hiraToKata()", () => {
            expect(jpn("がっこう").hiraToKata()).toBe("ガッコウ");
            expect(jpn("日本語abcカナ").hiraToKata()).toBe("日本語abcカナ");
        });

        test("provides kataToHira()", () => {
            expect(jpn("日本語abcカナ").kataToHira()).toBe("日本語abcかな");
        });

        test("provides wrapInSingleQuotes()", () => {
            expect(jpn("Hello").wrapInSingleQuotes()).toBe("「Hello」");
            expect(jpn("日本語").wrapInSingleQuotes()).toBe("「日本語」");
        });

        test("provides wrapInDoubleQuotes()", () => {
            expect(jpn("Hello").wrapInDoubleQuotes()).toBe("『Hello』");
            expect(jpn("日本語").wrapInDoubleQuotes()).toBe("『日本語』");
        });

        test("provides asRune()", () => {
            expect(jpn("日本語").asRune()).toBe("日");
            expect(jpn("😀hello").asRune()).toBe("😀");
            expect(jpn("").asRune()).toBeUndefined();
        });

        test("supports multiple operations on the same string", () => {
            const japanese = jpn("がっこう");

            expect(japanese.hasHiragana()).toBe(true);
            expect(japanese.hiraToKata()).toBe("ガッコウ");
            expect(japanese.hasDakuten()).toBe(true);
            expect(japanese.asRune()).toBe("が");
        });

        test("matches the README fluent API example", () => {
            const text = jpn("日本語abcカナ");

            expect(text.hasHiragana()).toBe(false);
            expect(text.hasKatakana()).toBe(true);
            expect(text.hasKanji()).toBe(true);
            expect(text.hasDakuten()).toBe(false);
            expect(text.hasHandakuten()).toBe(false);

            expect(text.hiraToKata()).toBe("日本語abcカナ");
            expect(text.kataToHira()).toBe("日本語abcかな");

            expect(text.wrapInSingleQuotes()).toBe("「日本語abcカナ」");
            expect(text.wrapInDoubleQuotes()).toBe("『日本語abcカナ』");

            expect(text.asRune()).toBe("日");
            expect(text.value).toBe("日本語abcカナ");
        });
    });
});
