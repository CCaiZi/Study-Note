##如何自己实现 JavaScript 的 new 操作符？
##文章来源：https://segmentfault.com/a/1190000022140993

前言
new 大家肯定都不陌生，单身没有对象的时候就 new 一个，很方便。那么它在创建实例的时候，具体做了哪些操作呢？今天我们就来一起分析一下。

构造函数
在介绍 new 之前，必须要知道什么是构造函数。

构造函数和普通函数在写法上没有任何区别，当一个函数通过 new Fun() 调用时，就叫做构造函数，构造函数首字母通常大写。

function User(name) {
    this.name = name;
}

let u = new User('leo');


这里，User 就是构造函数，当然你也可以直接调用 User()，但是这样就起不到创建实例的作用，在非严格模式下，会把 name 属性挂在 window 上。

new 操作符
那么 new 操作符到底做了什么事情呢，可以创建出一个实例？

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。new关键字会进行如下的操作：

创建一个空的简单JavaScript对象（即**{}**）；
链接该对象（即设置该对象的构造函数）到另一个对象 ；
将步骤1新创建的对象作为**this**的上下文 ；
如果该函数没有返回对象，则返回**this**。
以上引用自 new 操作符 - MDN

可能第 2、4 步大家看的不是很明白，这里我重新总结一下这 4 个步骤：

创建一个空对象 u = {}
绑定原型，u.__proto__ = User.prototype
调用 User() 函数，并把空对象 u 当做 this 传入，即 User.call(u)
如果 User() 函数执行完自己 return 一个 object 类型，那么返回此变量，否则返回 this，注意：如果构造函数返回基本类型值，则不影响，还是返回 this
自己实现一个 new
知道了 new 操作符的原理，下面我们自己来实现一个 FakeNew 函数。


function FakeNew(){
    let obj = {};
  
    // 将类数组 arguments 转为数组，同时将第一个参数也就是构造函数 shift 出来
    let Constructor = [].shift.apply(arguments);  

    // 绑定原型
    obj.__proto__ = Constructor.prototype;    
  
    // 调用构造函数，将 obj 当做 this 传入
    let res = Constructor.apply(obj, arguments);    

    // 返回
    return typeof res === 'object' ? res : obj;   
}

function User(name) {
    this.name = name;
}

User.prototype.getName = function(){
    return this.name;
}

let u = FakeNew(User, 'leo');
console.log(u);
console.log(u.getName());


相应关键步骤的注释已经附在代码里面了，这样我们就实现了一个 new 操作，相信大家以后再看到 new，会有一种通透的感觉了。