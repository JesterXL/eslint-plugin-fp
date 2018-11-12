# What

ESLint rules for functional programming.

**NOTE 1 of 2**: This is a fork from [https://github.com/jfmengels/eslint-plugin-fp](https://github.com/jfmengels/eslint-plugin-fp). I looked at the 33 forks at the time and none were up to date. So, I forked it, merged in 2 of the outstanding PR's, and added some missing features (allow [class constructors](docs/rules/no-nil.md#option-class-constructor), using classes if you [extend React.Component](docs/rules/no-class.md#option-allow-extending-react-components), switch statements that have a [default with a return value](docs/rules/no-nil.md#option-switch-default) don't violate `fp-jxl/no-nil`, etc).

**NOTE 2 of 2**: Beware much of the docs will say things like `fp-jxl/no-nil` when referring to a rule. Always use that for this library, not `fp/no-nil`. The `fp-jxl` is the ESLint plugin suffix, and the `no-nil` is the rule name. Many places in the documentation and tests refer to `fp`. Since I don't own the original package, and ESLint is challenging to configure, just assume `fp-jxl/some-rule` for all rules in the documentation, excluding `no-var` which is global.

## Install

```
$ npm install --save-dev eslint eslint-plugin-fp-jxl
```

## Usage

Configure it in `package.json`.

<!-- EXAMPLE_CONFIGURATION:START -->
```json
{
  "name": "my-awesome-project",
  "eslintConfig": {
    "env": {
      "es6": true
    },
    "plugins": [
      "fp"
    ],
    "rules": {
      "fp-jxl/explicit-return": "off",
      "fp-jxl/must-return": "off",
      "fp-jxl/no-arguments": "error",
      "fp-jxl/no-class": "error",
      "fp-jxl/no-delete": "error",
      "fp-jxl/no-events": "error",
      "fp-jxl/no-exceptions": "off",
      "fp-jxl/no-exports": "off",
      "fp-jxl/no-function-expressions": "off",
      "fp-jxl/no-get-set": "error",
      "fp-jxl/no-ifs": "off",
      "fp-jxl/no-imports": "off",
      "fp-jxl/no-instanceofs": "off",
      "fp-jxl/no-let": "error",
      "fp-jxl/no-loops": "error",
      "fp-jxl/no-mutating-assign": "error",
      "fp-jxl/no-mutating-methods": "error",
      "fp-jxl/no-mutation": "error",
      "fp-jxl/no-new": "off",
      "fp-jxl/no-nil": "error",
      "fp-jxl/no-nulls": "off",
      "fp-jxl/no-proxy": "error",
      "fp-jxl/no-reassigns": "off",
      "fp-jxl/no-rest-parameters": "error",
      "fp-jxl/no-switches": "off",
      "fp-jxl/no-this": "error",
      "fp-jxl/no-throw": "error",
      "fp-jxl/no-typeofs": "off",
      "fp-jxl/no-undefined": "off",
      "fp-jxl/no-unused-expression": "error",
      "fp-jxl/no-valueof-field": "error",
      "fp-jxl/no-variable-declarations": "off",
      "no-var": "error"
    }
  }
}
```
<!-- EXAMPLE_CONFIGURATION:END -->


## Rules

<!-- RULES:START -->
- [explicit-return](docs/rules/explicit-return.md) - Stricter version of must-return: every function should have a top level return statement.
- [must-return](docs/rules/must-return.md) - Every branch of every function should have a return statement.
- [no-arguments](docs/rules/no-arguments.md) - Forbid the use of `arguments`.
- [no-class](docs/rules/no-class.md) - Forbid the use of `class`.
- [no-delete](docs/rules/no-delete.md) - Forbid the use of `delete`.
- [no-events](docs/rules/no-events.md) - Forbid the use of the `events` module.
- [no-exceptions](docs/rules/no-exceptions.md) - Forbids throwing and catching errors.
- [no-exports](docs/rules/no-exports.md) - Forbids use of export keyword
- [no-function-expressions](docs/rules/no-function-expressions.md) - Forbids the use of function expressions, consider: prefer-arrow-callback
- [no-get-set](docs/rules/no-get-set.md) - Forbid the use of getters and setters.
- [no-ifs](docs/rules/no-ifs.md) - Forbids the use of `if` statements, in favour of ternary expressions
- [no-imports](docs/rules/no-imports.md) - Forbids the use of the `import` keyword, in favour of CommonJS
- [no-instanceofs](docs/rules/no-instanceofs.md) - Forbids the use of the `instanceof` operator
- [no-let](docs/rules/no-let.md) - Forbid the use of `let`.
- [no-loops](docs/rules/no-loops.md) - Forbid the use of loops.
- [no-mutating-assign](docs/rules/no-mutating-assign.md) - Forbid the use of [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) with a variable as first argument.
- [no-mutating-methods](docs/rules/no-mutating-methods.md) - Forbid the use of mutating methods.
- [no-mutation](docs/rules/no-mutation.md) - Forbid the use of mutating operators.
- [no-new](docs/rules/no-new.md) - Forbids the use of the `new` keyword
- [no-nil](docs/rules/no-nil.md) - Forbid the use of `null` and `undefined`.
- [no-nulls](docs/rules/no-nulls.md) - Forbids the use of `null`.
- [no-proxy](docs/rules/no-proxy.md) - Forbid the use of `Proxy`.
- [no-reassigns](docs/rules/no-reassigns.md) - Forbids reassigning variables
- [no-rest-parameters](docs/rules/no-rest-parameters.md) - Forbid the use of rest parameters.
- [no-switches](docs/rules/no-switches.md) - Forbids the use of the `switch` statement
- [no-this](docs/rules/no-this.md) - Forbid the use of `this`.
- [no-throw](docs/rules/no-throw.md) - Forbid the use of `throw`.
- [no-typeofs](docs/rules/no-typeofs.md) - Forbids the typeof operator
- [no-undefined](docs/rules/no-undefined.md) - Forbids the use of `undefined`.
- [no-unused-expression](docs/rules/no-unused-expression.md) - Enforce that an expression gets used.
- [no-valueof-field](docs/rules/no-valueof-field.md) - Forbid the creation of `valueOf` fields.
- [no-variable-declarations](docs/rules/no-variable-declarations.md) - Forbids variable declarations, no `var` or `let`.

<!-- RULES:END -->

## Recommended configuration

This plugin exports a [`recommended` configuration](index.js) that enforces good practices.

To enable this configuration, use the `extends` property in your `package.json`.

```json
{
  "name": "my-awesome-project",
  "eslintConfig": {
    "plugins": [
      "fp"
    ],
    "extends": "plugin:fp-jxl/recommended"
  }
}
```

See [ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information about extending configuration files.

MIT © [Jeroen Engels](https://github.com/jfmengels)
MIT © [Ivan Dmitriev](https://github.com/idmitriev)
MIT © [Thomas Grainger](https://github.com/graingert)
MIT © [Jesse Warden](https://github.com/jesterxl)
