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

const classConstructorsAreAllowed = options =>
    _.findIndex(
      config => _.get('allowConstructors', config) === true,
      options
    ) > -1

const blockStatementDoesNotEndWithReturnStatement = node =>
  _.get('body.type', node) === 'BlockStatement'
  && !endsWithReturnStatement(_.get('body.body', node))

const isClassConstructorAndTheyAreAllowed = node => options =>
  parentIsConstructor(node)
  && classConstructorsAreAllowed(options)

const isBlockStatement = node =>
  _.get('body.type', node) === 'BlockStatement'

const hasOnly1ChildNode = node =>
  _.getOr(0, 'body.body', node).length === 1

const isSwitchStatement = node =>
  _.get('body.body[0].type', node) === 'SwitchStatement'

const getLastCase = node =>
  _.last(_.get('body.body[0].cases', node))

const notNil = _.negate(_.isNil)

const lastCaseIsDefault = node =>
  (
    notNil(getLastCase(node))
    && _.isNil(getLastCase(node).test)
  )
    
const caseHasSomeKindOfHandling = node =>
  (
    notNil(getLastCase(node))
    && Array.isArray(getLastCase(node).consequent)
    && getLastCase(node).consequent.length > 0
  )

const getDefaultCase = node =>
  _.last(_.get('consequent', getLastCase(node)))

const nodeHasReturnStatement = node =>
    _.findIndex(
      childNode => _.get('type', childNode) === 'ReturnStatement',
      _.get('body', node)
    ) > -1

const arrayHasOnly1Item = array =>
  (
    Array.isArray(array)
    && array.length === 1
  )
const hasOnly1Child = node =>
  arrayHasOnly1Item(_.get('body', node))

const isABlockStatementThatHasSingleReturn = node =>
  (
    _.get('type', node) === 'BlockStatement'
    && hasOnly1Child(node)
    && _.get('body[0]', node) === 'ReturnStatement'
  )

const isAReturnStatement = node =>
    _.get('type', node) === 'ReturnStatement'

const nodeIsBlockStatementThatHasSingleReturnOrReturnStatement = node =>
  (
    isABlockStatementThatHasSingleReturn(node)
    && isAReturnStatement(node)
  )
  
const defaultCaseHasReturnStatement = node =>
  nodeHasReturnStatement(getDefaultCase(node))
  || isAReturnStatement(getDefaultCase(node))

const defaultCaseReturnsSomething = node => {
  const type = _.get('type', getDefaultCase(node))
  if(type === 'BlockStatement') {
    return notNil(_.get('body[0].argument', getDefaultCase(node)))
  } else if(type === 'ReturnStatement') {
    return notNil(_.get('argument', getDefaultCase(node)))
  } else {
    return false
  }
}

const allowSwitchDefault = options =>
  _.findIndex(
    option => _.get('allowSwitchDefault', option) === true,
    options
  ) > -1


const switchDefaultsAreAllowedToReturnValues = options => node =>
  isBlockStatement(node)
  && hasOnly1ChildNode(node)
  && isSwitchStatement(node)
  && lastCaseIsDefault(node)
  && caseHasSomeKindOfHandling(node)
  && defaultCaseHasReturnStatement(node)
  && defaultCaseReturnsSomething(node)
  && allowSwitchDefault(options)
      
function reportFunctions(context, node) {
  const options = _.getOr([], 'options', context)

  // console.log("node:", node.body.body.length)
  // console.log("node:", node.body.body[0].cases[1].consequent[0].body[0].argument)
  // if(notNil(node.body.body[0].cases[1].consequent[0].body[0].argument))
  // console.log("node:", node.body.body[0].cases[1].consequent[0])
  // console.log("isBlockStatement:", isBlockStatement(node))
  // console.log("hasOnly1ChildNode:", hasOnly1ChildNode(node))
  // console.log("isSwitchStatement:", isSwitchStatement(node))
  // console.log("lastCaseIsDefault:", lastCaseIsDefault(node))
  // console.log("caseHasSomeKindOfHandling:", caseHasSomeKindOfHandling(node))
  // // console.log("getDefaultCase:", _.get('body', getDefaultCase(node)))
  // console.log("defaultCaseHasReturnStatement:", defaultCaseHasReturnStatement(node))
  // console.log("defaultCaseReturnsSomething:", defaultCaseReturnsSomething(node))

  

  if (blockStatementDoesNotEndWithReturnStatement(node)) {

    if(isClassConstructorAndTheyAreAllowed(node)(options)) {
      return
    }
    
    if(switchDefaultsAreAllowedToReturnValues(options)(node)) {
      return
    }

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