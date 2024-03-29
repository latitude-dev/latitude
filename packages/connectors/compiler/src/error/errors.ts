export default {
  unexpectedEof: {
    code: 'unexpected-eof',
    message: 'Unexpected end of input',
  },
  unexpectedEofToken: (token: string) => ({
    code: 'unexpected-eof',
    message: `Unexpected '${token}'`,
  }),
  unexpectedToken: (token: string) => ({
    code: 'unexpected-token',
    message: `Expected '${token}'`,
  }),
  unexpectedBlockClose: {
    code: 'unexpected-block-close',
    message: 'Unexpected block closing tag',
  },
  invalidElseif: {
    code: 'invalid-elseif',
    message: "'elseif' should be 'else if'",
  },
  invalidElseifPlacementUnclosedBlock: (block: string) => ({
    code: 'invalid-elseif-placement',
    message: `Expected to close ${block} before seeing {:else if ...} block`,
  }),
  invalidElseifPlacementOutsideIf: {
    code: 'invalid-elseif-placement',
    message: 'Cannot have an {:else if ...} block outside an {#if ...} block',
  },
  invalidElsePlacementUnclosedBlock: (block: string) => ({
    code: 'invalid-else-placement',
    message: `Expected to close ${block} before seeing {:else} block`,
  }),
  invalidElsePlacementOutsideIf: {
    code: 'invalid-else-placement',
    message:
      'Cannot have an {:else} block outside an {#if ...} or {#each ...} block',
  },
  expectedBlockType: {
    code: 'expected-block-type',
    message: 'Expected if or each',
  },
  unexpectedTokenDestructure: {
    code: 'unexpected-token',
    message: 'Expected identifier or destructure pattern',
  },
  expectedName: {
    code: 'expected-name',
    message: 'Expected name',
  },
  unexpectedMustacheCloseTag: {
    code: 'unexpected-mustache-close-tag',
    message: 'Unexpected closing tag without matching opening tag',
  },
  unexpectedEndOfComment: {
    code: 'unexpected-end-of-comment',
    message: 'Unexpected end of comment',
  },

  // Compiler errors:
  queryNotFound: (name: string) => ({
    code: 'query-not-found',
    message: `Query '${name}' not found`,
  }),
  unsupportedBaseNodeType: (type: string) => ({
    code: 'unsupported-base-node-type',
    message: `Unsupported base node type: ${type}`,
  }),
  unsupportedExpressionType: (type: string) => ({
    code: 'unsupported-expression-type',
    message: `Unsupported expression type: ${type}`,
  }),
  invalidConstantDefinition: {
    code: 'invalid-constant-definition',
    message: 'Constant definitions must assign a value to a variable',
  },
  variableAlreadyDeclared: (name: string) => ({
    code: 'variable-already-declared',
    message: `Variable '${name}' is already declared`,
  }),
  variableNotDeclared: (name: string) => ({
    code: 'variable-not-declared',
    message: `Variable '${name}' is not declared`,
  }),
  invalidObjectKey: {
    code: 'invalid-object-key',
    message: 'Invalid object key',
  },
  unsupportedOperator: (operator: string) => ({
    code: 'unsupported-operator',
    message: `Unsupported operator: ${operator}`,
  }),
  constantReassignment: {
    code: 'constant-reassignment',
    message: 'Cannot reassign a constant',
  },
  unknownFunction: (name: string) => ({
    code: 'unknown-function',
    message: `Unknown function: ${name}`,
  }),
  functionCallError: (name: string, message: string) => ({
    code: 'function-call-error',
    message: `Error calling function '${name}': ${message}`,
  }),
  invalidFunctionResultInterpolation: {
    code: 'invalid-function-result-interpolation',
    message: 'Functions called for interpolation must return a string',
  },
}
