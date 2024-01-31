import { lexer } from "./lexer";
import { parser } from "./parser";
import { evaluator } from "./evaluator";
import { syllable_patterns } from "./patterns";

export function run_interpreter(
  input,
  dictionary_object,
  patterns = syllable_patterns
) {
  const tokens = lexer(input, dictionary_object);
  const cells = parser(tokens);
  const evaluated_cells = evaluator(cells, patterns);
  return evaluated_cells;
}

export { syllable_patterns };
export { parse_to_html } from "./utils";
