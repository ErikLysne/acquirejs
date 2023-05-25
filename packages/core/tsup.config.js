// tsup.config.js
export default {
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: "dist/index.js"
    },
    {
      format: "esm",
      file: "dist/index.mjs"
    }
  ]
};
