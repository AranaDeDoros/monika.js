
function replacePunctuation(str: string): string {
    return str.replaceAll(".", "。").replaceAll(",", "、").replaceAll("?", "？").replaceAll("!", "！").replaceAll("(", "（").replaceAll(")", "）")

}
function wrapInSingleQuotes(str: string): string {
    return "「" + str + "」"
}

function wrapInDoubleQuotes(str: string): string {
    return "『" + str + "』"
}

export {replacePunctuation, wrapInDoubleQuotes, wrapInSingleQuotes}