# Forbid the use of `class`

Classes are nice tools to use when programming with the object-oriented paradigm, as they hold internal state and give access to methods on the instances. In functional programming, having stateful objects is more harmful than helpful, and should be replaced by the use of pure functions.

### Fail

```js
class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}
```

### Pass

```js
function polygon(height, width) {
  return {
    height: height,
    width: width
  };
}
```

<a name="classreactcomponent"></a>
## Option: Allow Extending React Components

For those who cannot use Function Components and/or Hooks, using `class` will trigger this rule to fail.

### Fail: React Class Component

```javascript
class Sup extends React.Component {
    constructor() {
    }
}
```

### Pass: React Class Component

To get it to pass, add a rule modication in your `.eslintrc` file. This will allow only classes that extend `React.Component` or `React`.

```json
"fp/no-class": ["error", {
    "allowExtendingReactComponent": true
}]
```