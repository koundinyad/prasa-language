export function lexer(input, cmu_dict) {
  const tokens = [];

  let lines = input.split("\n");

  lines = lines.filter((line) => line.trim() !== "");

  lines.forEach((line, line_index) => {
    let cleaned_line = line
      .replace(/-/g, " ")
      .replace(/[^\(\)a-zA-Z\s']+/g, "");

    let indentLevel = Math.round(cleaned_line.match(/^ */)[0].length / 4);
    tokens.push({ type: "INDENT", value: indentLevel, line: line_index });

    // Process the rest of the line
    const line_without_indent = cleaned_line.trim();
    const words = line_without_indent.split(/\s+/);

    words.forEach((word, word_index, wordsArray) => {
      if (word.startsWith("(")) {
        // Identify the opening bracket
        tokens.push({
          type: "BRACKET_BEGIN",
          line: line_index,
        });

        // Match everything from the first ( to the last ) on the line
        const bracket_content = line_without_indent.match(/\((.*)\)/);

        if (bracket_content && bracket_content[1]) {
          const bracket_words = bracket_content[1].split(/\s+/);

          bracket_words.forEach((bracketWord) => {
            tokens.push({
              type: "WORD",
              value: bracketWord,
              line: line_index,
              error: !(bracketWord in cmu_dict),
              syllable_sequence:
                bracketWord in cmu_dict ? cmu_dict[bracketWord].sp : undefined,
              syllable_count:
                bracketWord in cmu_dict
                  ? cmu_dict[bracketWord]["sc"]
                  : undefined,
            }); // Add the word token
          });

          // Skip the rest of the words in the brackets
          const endIndex = wordsArray.findIndex((w) => w.endsWith(")"));
          wordsArray.splice(word_index, endIndex - word_index + 1);

          // Identify the closing bracket
          tokens.push({
            type: "BRACKET_END",
            line: line_index,
          });
        }
      } else {
        tokens.push({
          type: "WORD",
          value: word,
          line: line_index,
          error: !(word in cmu_dict),
          syllable_sequence: word in cmu_dict ? cmu_dict[word].sp : undefined,
          syllable_count: word in cmu_dict ? cmu_dict[word]["sc"] : undefined,
        });
      }
    });
  });

  return tokens;
}
