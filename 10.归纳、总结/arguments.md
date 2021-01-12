# Arguments

## 在调用函数时，浏览器每次都会传递进两个隐含的参数

1. 函数的上下文对象 this

2. 封装实参的对象 arguments

    + arguments 是一个类数组对象，它可以通过索引来操作数据，也可以获取长度

    + 在调用函数时，传递的实参都会在 arguments 中保持

    + arguments.length 可以用来获取实参的长度

    + 即使不定义形参，也可以通过 arguments 来使用实参，只不过比较麻烦，比如: arguments[0] 表示获取第一个实参

    + 它里面有一个属性叫 callee,这个属性对应一个函数对象，就是当前正在指向的函数的对象

示例如下:

```bash
function fn(){
  console.log(this);            // window
  console.log(arguments);       // ('hello','world')
  console.log(arguments instanceof Array);    // false
console.log(arguments.callee);  
      // ƒ fn(){
      //            console.log(this);
      //            console.log(arguments);
      //            console.log(arguments instanceof Array);
      //            console.log(arguments.callee);
      //        }
}

fn('hello','world');

```
