# 参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)中资料整理

---

与其他语言相比，函数的 this 关键字在 JavaScript 中的表现略有不同，此外，在严格模式和非严格模式之间也会有一些差别。

在绝大多数情况下，函数的调用方式决定了 this 的值（运行时绑定）。this 不能在执行期间被赋值，并且在每次函数被调用时 this 的值也可能会不同。ES5 引入了 bind 方法来设置函数的 this 值，而不用考虑函数如何被调用的。ES2015 引入了箭头函数，箭头函数不提供自身的 this 绑定（this 的值将保持为闭合词法上下文的值）。

---

示例(一):

```bash
const test = {
  func: function() {
    return this;
  }
};

console.log(test.func());   // {prop: 42, func: ƒ}
```

分析：

`func()` 是通过对象 `test` 调用的，因此，`this` 在**这次函数调用的(每次函数被调用时， `this` 运行绑定的值可能会不同)**函数执行上下文期间， `this` 指向的是 `test` 这个对象。

---

示例(二)：

```bash
const test = {
  func: function() {
    return this;
  }
};

var test2 = test.func;

console.log(test2());   // Window {window: Window, self: Window, document: document, name: "", location: Location, …}

```

分析：

上面的代码其实可以这么写:

```bash
const test = {
        func: function() {
            return this;
        }
    };

    var test2 = function() {
        return this;
    }

    console.log(test2());
```

这次 `test2()` 调用时，是在全局执行上下文中直接调用的，没有引用对象，因此， `this` 的值被设置为全局对象；但是，如果实在严格模式下，此时的 `this` 为 `undefined` ；如下。

---
示例(三)：

```bash
const test = {
    func: function() {
        "use strict";   // 严格模式
        return this;
    },
};

var test2 = test.func;

console.log(test2());   // undefined

```

---

**总结：当函数被调用时，this 的值是当前执行上下文（`global、function 或 eval`）的一个属性，在非严格模式下，总是指向一个对象，在严格模式下可以是任意值。**
