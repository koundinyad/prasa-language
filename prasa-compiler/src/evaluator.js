import { check_patterns_in_seq, get_bracket_tokens } from "./utils";

export function evaluator(cells, patterns) {
  let evaluated_cells = [];
  let in_brackets = false; // Flag to track if the current token is within brackets

  cells.forEach((cell) => {
    // Check if a cell with the same level already exists in the evaluated_cells array
    let cell_exists = evaluated_cells.some(
      (evaled_cell) => evaled_cell.level == cell.level
    );

    // Retrieve tokens that are within brackets for the current cell
    const bracket_tokens = get_bracket_tokens(cell);
    // Calculate the sum of syllable counts for the first group of bracketed tokens, if any
    const cell_bracket_tokens_sum =
      bracket_tokens.length > 0 &&
      bracket_tokens[0].reduce((sum, word) => sum + word.syllable_count, 0);

    if (!cell_exists) {
      const mapped_cell = {}; // Object to store the evaluated properties of the cell
      let cell_value = 0; // Initialize cell value to 0
      let bracket_sum = 0; // Initialize sum of syllables within brackets to 0

      let concat_syllable_seq = ""; // String to concatenate syllable sequences of all tokens

      // Iterate over tokens to calculate cell value and concatenate syllable sequences
      cell.tokens.forEach((token) => {
        if (token.type == "WORD") {
          cell_value += token.syllable_count;
          concat_syllable_seq += token.syllable_sequence;
        }
      });
      // Assign calculated values to the mapped_cell object
      mapped_cell["level"] = cell.level;
      mapped_cell["cell_value"] = cell_value;
      mapped_cell["tokens"] = cell.tokens;
      mapped_cell["syllable_seq"] = concat_syllable_seq;

      // Iterate over tokens again to handle bracketed sections
      cell.tokens.forEach((token) => {
        if (token.type == "BRACKET_BEGIN") {
          in_brackets = true;
        } else if (token.type == "BRACKET_END") {
          in_brackets = false;
        }

        if (in_brackets) {
          if (token.type == "WORD") {
            bracket_sum += token.syllable_count;
          }

          mapped_cell["cell_value"] *= bracket_sum; // Multiply cell value by the bracket sum
        }
      });

      evaluated_cells.push(mapped_cell); // Add the evaluated cell to the array
    } else {
      // If a cell with the same level already exists, update its value
      let in_brackets = false; // Reset in_brackets flag for the new iteration

      // Find the index of the existing cell with the same level
      const cell_index = evaluated_cells.findIndex(
        (evaled_cell) => evaled_cell.level == cell.level
      );

      // Iterate over tokens to update the cell value and tokens array
      cell.tokens.forEach((token) => {
        if (token.type === "BRACKET_BEGIN") {
          in_brackets = true;
          evaluated_cells[cell_index]["cell_value"] *= cell_bracket_tokens_sum;
        } else if (token.type == "WORD" && !in_brackets) {
          evaluated_cells[cell_index]["cell_value"] += token.syllable_count;
        }
      });
      evaluated_cells[cell_index]["tokens"].push(...cell.tokens); // Append new tokens to the existing cell
    }
  });

  // Map over evaluated_cells to finalize the structure and check for pattern matches
  const final_map = evaluated_cells.map((cell) => {
    cell["syllable_seq"] = ""; // Reset syllable sequence
    cell["error"] = cell.tokens.some((token) => token.error === true); // Check for any token errors
    // Concatenate syllable sequences for all WORD tokens
    cell.tokens.forEach((token) => {
      if (token.type == "WORD" && token.syllable_sequence) {
        cell["syllable_seq"] += token.syllable_sequence;
      }
    });
    // Check if the cell matches any provided patterns
    const pattern_result = check_patterns_in_seq([cell], patterns);

    // Assign pattern match results to the cell
    cell["is_match"] = pattern_result.is_matching;
    cell["match_name"] = pattern_result.match_name;
    cell["ascii"] = String.fromCharCode(cell.cell_value); // Convert cell value to ASCII character
    return cell;
  });

  return final_map; // Return the final array of evaluated cells
}
