'use strict';
const { get, getOr, findIndex } = require('lodash/fp')

const extendsComponent = node =>
  get('superClass.name', node) === 'component'

const extendsReactComponent = node =>
  get('superClass.object.name', node) === 'React'
  && get('superClass.property.name', node) === 'Component'

const extendsReactComponentOrComponent = node =>
  extendsReactComponent(node)
  || extendsComponent(node)

const getOptionsOrEmpty = getOr([], 'options')

const extendingReactComponentIsAllowed = options =>
  findIndex(
    config => get('allowExtendingReactComponent', config) === true,
    options
  ) > -1
  
const create = function (context) {
  function report(node) {
    const options = getOptionsOrEmpty(context)
    if(
      extendingReactComponentIsAllowed(options)
      && extendsReactComponentOrComponent(node)
      ) {
      return
    }
    context.report({
      node,
      message: 'Unallowed use of `class`. Use functions instead'
    });
  }

  return {
    ClassDeclaration: report,
    ClassExpression: report
  };
};

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Forbid the use of `class`.',
      recommended: 'error',
      url: 'https://github.com/jfmengels/eslint-plugin-fp/tree/master/docs/rules/no-class.md'
    }
  }
};
