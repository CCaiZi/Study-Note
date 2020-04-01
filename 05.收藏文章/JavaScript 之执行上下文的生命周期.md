##首发地址：https://github.com/jeuino/Blog/issues/12

前言
在每个执行上下文中，都包括三个重要的属性：

变量对象（Variable Object，VO）
作用域链（Scope Chain）
this指向
在前面几篇文章中，关于执行上下文的三个重要属性都已经介绍过了，传送门：

《JavaScript 之作用域与作用域链》
《JavaScript 之变量对象》
《JavaScript 之this关键字》

本篇文章将开始介绍执行上下文的最后一个知识点——生命周期。

###执行上下文的生命周期
执行上下文的生命周期包括两个阶段：

创建阶段：创建阶段是在代码执行前进行的，它的主要工作是：

创建变量对象
创建作用域链
确定 this 指向
执行阶段：执行代码，这个时候会完成变量赋值，函数执行以及执行其它代码等。
在《JavaScript 引擎（V8）是如何工作的》中我们介绍了
JavaScript 引擎（V8）执行 JavaScript 代码过程中涉及的四个主要模块：Parser、Ignition、TurboFan、 Orinoco 。

其中 Ignition 负责将 AST 转换为中间代码（字节码 Bytecode），这个过程通常被称为预编译阶段。执行上下文生命周期的创建阶段就是在该阶段进行的。

V8 有两种方式执行代码：一种是 Ignition 解释器直接解释字节码执行；另一种是执行TurboFan优化编译后的机器代码。所以执行上下文生命周期的执行阶段，是由Ignition 或者TurboFan进行的。

我们以下面这段代码为例，分析执行上下文的整个生命周期。这里不再解释具体知识点，有需要的请阅读前言中的相关文章。（示例来源于参考文章）

var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();

当开始执行上述代码时，会创建全局执行上下文；

ECStack.push(global_EC);

ECStrict = [
    global_EC
]


初始化全局执行上下文（创建阶段）；

global_EC = ｛
    VO：window，
    //  current scope + scopes of all its parents
    // 这里将 scope 用 VO 表示，是因为在作用域中查找变量，其实就是从变量对象中查找，变量对象可以理解为作用域的实体
    scope: [VO],
    this: window
｝

window = {
    // 内置全局属性和函数
    ... ,
    // 声明的全局变量和函数
    checkscope: reference to function checkscope(){},
    scope: undefined,
}

进入执行阶段，执行代码。当开始执行checkscope函数时，创建该函数的执行上下文。

ECStack.push(checkscope_EC);

ECStrict = [
    global_EC，
    checkscope_EC
]

初始化checkscope函数的执行上下文（创建阶段）。

checkscope_EC = ｛
    VO: {
        arguments: {
            length: 0
        },
        scope: undefined,
        f: reference to function f(){},
    }
    //  current scope + scopes of all its parents
    scope: [global_EC.VO, VO],
    // 非严格模式
    this: window
｝

进入执行阶段，执行代码。当开始执行 f 函数时，执行过程同上，创建并初始化 f 函数的执行上下文；

ECStack.push(f_EC);

ECStrict = [
    global_EC，
    checkscope_EC,
    f_EC
]

f_EC = ｛
    VO: {
        arguments: {
            length: 0
        }
    },
    //  current scope + scopes of all its parents
    scope: [global_EC.VO, checkscope_EC.VO, VO],
    // 非严格模式
    this: window
｝


当 f 函数执行完毕，其执行上下文出栈；
ECStack.pop();

ECStrict = [
    global_EC，
    checkscope_EC
]

当 checkscope函数执行完毕，其执行上下文出栈；

ECStack.pop();

ECStrict = [
    global_EC
]

当关闭浏览器或者当前浏览器窗口，全局执行上下文才出栈。