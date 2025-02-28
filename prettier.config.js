module.exports = {
  printWidth: 100, // Length of each line of code（default80）
  tabWidth: 2, // How many spaces does each tab equal to (default is 2), and perform indentation with `ab` (default is `false`).
  useTabs: false, // Whether to use it or not tab
  semi: false, // Use a semicolon at the end of the statement(default true)
  vueIndentScriptAndStyle: false,
  singleQuote: true, // single quotes （default false）
  quoteProps: 'as-needed',
  bracketSpacing: true, // Use spaces between curly braces of object literals（default true）
  trailingComma: 'none', // Use trailing commas for multiple lines（default none）
  jsxSingleQuote: false,
  // Arrow function parameter parentheses: The default is `avoid`, and the available options are `avoid` | `always`.
  // avoid When parentheses can be omitted, omit them for examplex => x
  // always There are always parentheses
  arrowParens: 'always',
  insertPragma: false,
  requirePragma: false,
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto',
  rangeStart: 0
}
