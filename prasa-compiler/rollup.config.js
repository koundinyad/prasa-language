import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js", // Entry point
  output: {
    file: "dist/bundle.js", // Output bundle
    format: "es", // Output format
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(), // Add the terser plugin here
  ],
};
