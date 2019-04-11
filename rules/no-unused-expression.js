'use strict';

const _ = require('lodash/fp');

const hasSideEffect = _.overSome([
  {type: 'AssignmentExpression'},
  {type: 'UpdateExpression', operator: '++'},
  {type: 'UpdateExpression', operator: '--'},
  {type: 'UnaryExpression', operator: 'delete'}
]);

const isUseStrictStatement = _.matches(
  {type: 'Literal', value: 'use strict'}
);

const isSuperCall = _.matches({
  type: 'CallExpression',
  callee: {
    type: 'Super'
  }
});

const isConsole = node =>
  _.get('expression.callee.object.name', node) === 'console'

const report = (context, node) => {
  context.report({
    node,
    message: 'Unused expression'
  });
};

// ["error", {"allowUseStrict": true, "allowConsole": true }]
const create = function (context) {
  const options = context.options[0] || {};
  const allowUseStrict = options.allowUseStrict;
  const allowConsole = options.allowConsole
  return {
    ExpressionStatement(node) {
      // console.log("isConsole(node):", isConsole(node))
      if(isConsole(node) && allowConsole) {
        return
      }
      if (hasSideEffect(node.expression) ||
        (isUseStrictStatement(node.expression) && allowUseStrict)
      ) {
        return;
      }
      if (isSuperCall(node.expression)) {
        return;
      }
      report(context, node);
    },
    SequenceExpression(node) {
      console.log("SequenceExpression::node:", node)
      if (!node.parent || node.parent.type !== 'ExpressionStatement') { // Avoid duplicate errors
        report(context, node);
      }
    }
  };
};

const schema = [{
  type: 'object',
  properties: {
    allowUseStrict: {
      type: 'boolean'
    }
  }
}];

module.exports = {
  create,
  schema,
  meta: {
    docs: {
      description: 'Enforce that an expression gets used.',
      recommended: 'error',
      url: 'https://github.com/jfmengels/eslint-plugin-fp/tree/master/docs/rules/no-unused-expression.md'
    }
  }
};
