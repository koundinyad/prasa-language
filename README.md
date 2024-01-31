# prāsa language

Prāsa is an esoteric programming language to write poems as code.

Project Website - [prasa.software](https://prasa.software)

### Project Structure

```
.
├── prasa-compiler // JS compiler for the language
│   ├── src
│   ├── package.json
├── dictionary // building a dictionary for syllable approximation
└── README.md
```

### Usage

```javascript
@param {string} poem - input string to be interpreted.
@param {Object} dictionary - The dictionary used for syllable approximation.
@param {Array} [patterns=patterns] - The patterns used in the interpretation. Defaults to the patterns defined in `patterns.js`.

result = run_interpreter("my poem", dictionary, patterns);
```

```javascript
[
  ...result,
  {
    level: 0,
    cell_value: 10,
    tokens: [
      ...tokens,
      {
        type: "WORD",
        value: "hello",
        line: 0,
        error: false,
        syllable_sequence: "UI",
        syllable_count: 2,
      },
    ],
    syllable_seq: "UIUI",
    error: false,
    is_match: true,
    match_name: "Utpalamāla",
    ascii: "\n",
  },
];

type Token = {
  type: string,
  value: string,
  line: number,
  error: boolean,
  syllable_sequence: string,
  syllable_count: number,
};

type Line = {
  level: number,
  cell_value: number,
  tokens: Token[],
  syllable_seq: string,
  error: boolean,
  is_match: boolean,
  match_name: string | null,
  ascii: string,
};

type Result = Line[];
```

# LICENSE

Licensed under Creative Commons Zero v1.0 Universal
