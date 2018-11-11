'use strict';

const _ = require('lodash/fp');

function isComparison(node) {
  return node.parent &&
    node.parent.type === 'BinaryExpression' &&
    _.includes(node.parent.operator, ['==', '!=', '===', '!==']);
}

function reportUseOutsideOfComparison(context, node) {
  if (!isComparison(node)) {
    context.report({
      node,
      message: 'Unallowed use of `null` or `undefined`'
    });
  }
}

const endsWithReturnStatement = _.flow(
  _.last,
  _.matches({type: 'ReturnStatement'})
);

const parentIsConstructor = node =>
  _.get('parent.kind', node) === 'constructor'

const classConstructorsAreAllowed =
    _.find(
      config => _.get('allowConstructors', config) === true
    )

const blockStatementDoesNotEndWithReturnStatement = node =>
  _.get('body.type', node) === 'BlockStatement'
  && !endsWithReturnStatement(_.get('body.body', node))

const isClassConstructorAndTheyAreAllowed = node => options =>
  parentIsConstructor(node)
  && classConstructorsAreAllowed(options)

function reportFunctions(context, node) {
  const options = _.getOr([], 'options', context)
  if (
    blockStatementDoesNotEndWithReturnStatement(node)
    && isClassConstructorAndTheyAreAllowed(node)(options) === false
  ) {
    context.report({
      node,
      message: 'Function must end with a return statement, so that it doesn\'t return `undefined`'
    });
  }
}

const create = function (context) {
  const reportFunc = _.partial(reportFunctions, [context]);
  return {
    Literal(node) {
      if (node.value === null) {
        reportUseOutsideOfComparison(context, node);
      }
    },
    Identifier(node) {
      if (node.name === 'undefined') {
        reportUseOutsideOfComparison(context, node);
      }
    },
    VariableDeclarator(node) {
      if (node.init === null) {
        context.report({
          node,
          message: 'Variable must be initialized, so that it doesn\'t evaluate to `undefined`'
        });
      }
    },
    ReturnStatement(node) {
      if (node.argument === null) {
        context.report({
          node,
          message: 'Return statement must return an explicit value, so that it doesn\'t evaluate to `undefined`'
        });
      }
    },
    ArrowFunctionExpression: reportFunc,
    FunctionDeclaration: reportFunc,
    FunctionExpression: reportFunc
  };
};

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Forbid the use of `null` and `undefined`.',
      recommended: 'error',
      url: 'https://github.com/jfmengels/eslint-plugin-fp/tree/master/docs/rules/no-nil.md'
    }
  }
};