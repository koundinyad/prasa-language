import { check_patterns_in_seq } from './utils';

export function parser(tokens) {
	const cells = [];

	let current_level = null;
	let current_group = null;

	tokens.forEach((token, index) => {
		if (token.type === 'INDENT') {
			if (current_group) {
				cells.push(current_group);
			}
			current_level = token.value;
			current_group = {
				level: current_level,
				tokens: []
			};
		} else {
			if (current_group) {
				current_group.tokens.push(token);
			}
		}
	});

	// Push the last group (if exists) to the result array
	if (current_group) {
		cells.push(current_group);
	}

	return cells;
}
