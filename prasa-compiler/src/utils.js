export function pattern_matcher(sequence, patterns) {
  for (const [key, { pattern, len }] of Object.entries(patterns)) {
    if (sequence.includes(pattern)) {
      return { key, pattern };
    }
  }
  return null;
}

export function count_syllables(content, cmu_dict) {
  const words = content.split(/\s+/);
  let syllableCount = 0;

  for (const word of words) {
    const phonemes = cmu_dict[word];
    if (phonemes) {
      // Count the number of digits in the phonemes, as each digit represents a syllable
      const word_syllables = phonemes.join(" ").match(/\d/g) || [];
      syllableCount += word_syllables.length;
    } else {
      // Handle words not found in the dictionary
      // console.warn(`Word not found in CMU dictionary: ${word}`);
      // Fallback syllable count could be implemented here
    }
  }

  return syllableCount;
}

export function get_syllable_seq(word, cmu_dict) {
  const phonemes = cmu_dict[word];
  if (!phonemes) {
    // console.warn(`Word not found in CMU dictionary: ${word}`);
    return "";
  }

  // get the sequence
  const syllable_seq = phonemes.join(" ").match(/\d/g) || [];

  // convert to Is and Us
  return syllable_seq
    .map((syllableCount) => (syllableCount === "1" ? "U" : "I"))
    .join("");
}

export function get_bracket_tokens(cell) {
  let in_brackets = false;
  let temp_array = [];
  const results = [];

  cell.tokens.forEach((token) => {
    if (token.type === "BRACKET_BEGIN") {
      in_brackets = true;
    } else if (token.type === "BRACKET_END") {
      if (in_brackets && temp_array.length > 0) {
        results.push([...temp_array]); // Push a copy of the temp_array
      }
      in_brackets = false;
      temp_array = []; // Reset temp_array after pushing
    } else if (in_brackets) {
      temp_array.push(token);
    }
  });

  return results;
}

export function check_patterns_in_seq(arr, ptns) {
  // Concatenate all syllable sequences from the array of objects
  const concatenated_seq = arr.map((obj) => obj.syllable_seq).join("");

  // Check each pattern for a match
  for (const [key, value] of Object.entries(ptns)) {
    if (concatenated_seq.includes(value.pattern)) {
      return { is_matching: true, match_name: value.name };
    }
  }

  return { is_matching: false, match_name: null };
}

function parse_to_html(tokens, dictionary) {
  const spans = tokens
    .map((t) => {
      if (t in dictionary) {
        return dictionary[t].seg
          .map((segment) => {
            if (segment.pattern === "U") {
              return `<span class="${
                g_highlight ? "guruvu" : "bg-none text-white"
              } transition-all ">${segment.syllable}</span>`;
            } else if (segment.pattern === "I") {
              return `<span class="${
                l_highlight ? "laghuvu" : "bg-none text-white"
              } transition-all">${segment.syllable}</span>`;
            }
          })
          .join("");
      } else if (t === "\n") {
        return "<br>";
      } else if (t === "    ") {
        return '<span class="tab">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
      } else if (t === " ") {
        return t;
      } else if (/\W/.test(t) && t !== " ") {
        return `<span class="text-white">${t}</span>`;
      } else {
        return `<span class="token-error">${t}</span>`;
      }
    })
    .join("");
  return spans;
}

export { parse_to_html };
