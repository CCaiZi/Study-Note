##文章来源：https://juejin.im/post/5e7d5df8e51d45471140fc9f

##JavaScript进阶之this指向
this指向最常听到的一句话就是：它始终指向调用它的对象，然而却忽略了this所在的环境。


###再谈上下文

在上下文的章节我们说到，在这个阶段，执行上下文会分别创建变量对象、确定作用域链，以及this指向
  在变量对象章节我们讲到，在函数调用栈中，如果当前执行上下文处于函数调用栈的栈顶，则意味着当前上下文处于激活状态，并且上下文处于执行阶段,此时的变量对象称之为活动对象（AO）。活动对象中包含变量对象的所有属性，并且此时所有属性完成了赋值，除此之外，活动对象还包含this指向

总结一下：

this的指向与上下文有关
由于活动对象还包含this指向，所以可以在作用域链访问到this
this指向是在函数调用的时候才能确认，定义的时候不能确认
另外值得注意的是this的值是个对象

❗️❗️因此，我们分析this指向正确✅的做法应该从不同的上下文去分析this的指向
JavaScript中的运行环境主要包括以下三种情况

全局环境：代码运行起来后会首先进入全局环境
函数环境：当函数被调用执行时，会进入当前函数中的执行代码
eval环境：不建议使用，不做介绍


###全局上下文
全局上下文如何确定this指向
非严格模式和严格模式中this都是指向顶层对象（浏览器中是window）。

举个例子🌰：

this === window // true

'use strict'
this === window;
this.name = 'vnues';
console.log(this.name); // vnues

###函数上下文

函数上下文如何确定this指向

  如果是this的环境函数上下文 那么此时this的指向应该由函数的调用方式决定
  函数的this在函数调用时绑定的，完全取决于函数的调用位置（也就是函数的调用方式）。为了搞清楚this的指向是什么，必须知道相关函数是如何调用的。

独立调用

  fun()，函数独立调用，非严格模式下this指向window,严格模式下this指向undefined

举个例子🌰:

`
const test = {  
    outer: function () {    
        function inner() {      
            // 此时this指向window      
            console.log(this);    
        }    
        inner();  
    }
}
test.outer()

'use strict'
const test = {  
    outer: function () {    
        function inner() {      
            // 此时this指向undefined      
            console.log(this);    
        }    
        inner();  
    }
}
test.outer() // undefined
`
对于上面👆的代码，可能一开始看会很晕，但是我们按照上面的概念来判断就是，inner函数的调用是属于独立调用，所以我们按照独立调用的规则去判断它就行

❗❗❗️注意这里要打印的this所处的函数上下文环境是inner函数上下文，我们要搞清楚的是this所在的上下文是什么，然后该函数是以怎么样的方式调用
方法调用

  当函数被作为对象的方法（对象的一个属性）调用时，this 指向该对象；

举个例子🌰:

var name = '落落落洛洛克';
var doSth = function(){    
    console.log(this.name);
}
var student = {    
    name: 'vnues',    
    doSth: doSth,    
    other: {        
        name: 'other',        
        doSth: doSth,    
    }
}
student.doSth(); // 'vnues'
student.other.doSth(); // 'other'

构造函数调用
new Fun()，关于new操作，可以看看前面章节中的new模拟实现，this指向这个新的对象也就是实例化对象

举个例子🌰：

// 创建一个名为Person 的构造函数，它构造一个带有user 和age 的对象            const Person = function (user,age) {                
    this.user = user;                
    this.age = age;             
};            
// 构造一个Person 实例 ，并测试            
const shane = new Person ('shane',25);            
console.log(shane.user);//shane            
console.log(shane.age);//25

call、apply、bind调用

func.call(obj,value1,value2);

func.apply(obj,[value1,value2])；

 func.bind(obj,value1,value2)()


动态改变 this 的指向 obj

举个例子🌰：

const value = 2;

const obj = {    
    value: 1
}
function bar(name, age) {    
    console.log(this.value);    
    return {        
        value: this.value,        
        name: name,        
        age: age    
    }
}
bar.call2(null); // 2
console.log(bar.call2(obj, 'kevin', 18));

箭头函数调用模式

  尤其值得注意。this对象的指向是可变的，但是在箭头函数中，它是固定的。由于箭头函数的存在,使得this指向有静态的特点（书写代码时已确定this指向,而不是函数调用时）

那么箭头函数的this指向谁❓

  MDN:箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this

上面👆我们分析过，由于活动对象``保存了this,所以在作用域链是可以访问上一层this的
举个例子🌰:

this.x = 9; 
function Module(x) {  
    this.x=x  
    this.getX=() =>{      
        console.log(this)     
        return this.x;  
    }
};
const module = new Module(81)
module.getX(); // 81

const retrieveX = module.getX;
retrieveX();   

###总结

分析this指向的时候应该注意以下几点：

当前this所处的上下文
根据其上下文的规则，进而分析this指向，并不能片面的认为它始终指向调用它的对象