##js基础之new关键字知多少
##文章来源：https://juejin.im/post/5e858da8518825739837afcf

前段时间我一个朋友面试，被面试官问了一个问题：写一个js方法实现一个 new 运算符。我朋友内心深处当时就有一万头草泥马奔腾而过......。new 都用过，用来创建实例对象，可new 操作背后都做了些什么，我们确很少关注。
new 操作背后

new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。new 关键字会进行如下的操作：
1、创建一个空的简单JavaScript对象（即{}）；
2、链接该对象（即设置该对象的构造函数）到另一个对象 ；
3、将步骤1新创建的对象作为this的上下文 ；
4、如果该函数没有返回对象，则返回this。

以上是 MDN 的原文，通过上面描述，我们能比较清晰的了解到一个简单new运算符背后做了些什么。现在我们来看看下面这段代码

function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}

Car.prototype={
  getMake: function() {
    return this.make
  }
}

var car = new Car('Eagle', 'Talon TSi', 1993)



我们来分解一下 var car = new Car('Eagle', 'Talon TSi', 1993)这行代码

第一步：创建一个简单空对象

var obj = {}


第二步：链接该对象到另一个对象（原型链）

// 设置原型链
obj.__proto__ = Car.prototype


第三步：将步骤1新创建的对象作为 this 的上下文

// this指向obj对象
Car.apply(obj, ['Eagle', 'Talon TSi', 1993])


第四步：如果该函数没有返回对象，则返回this

// 因为 Car() 没有返回值，所以返回obj
var car = obj
car.getMake() // 'Eagle'


需要注意的是如果 Car() 有 return 则返回 return的值

var rtnObj = {}
function Car(make, model, year) {
  // todo
  // ...
  //返回一个对象
  return rtnObj
}

var car = new Car('Eagle', 'Talon TSi', 1993)
console.log(car === rtnObj) // true


###封装一个方法
现在我们把上面的步骤封装成一个对象实例化方法

function objectFactory(){
    var obj = {};
    //取得该方法的第一个参数(并删除第一个参数)，该参数是构造函数
    var Constructor = [].shift.apply(arguments);
    //将新对象的内部属性__proto__指向构造函数的原型，这样新对象就可以访问原型中的属性和方法
    obj.__proto__ = Constructor.prototype;
    //取得构造函数的返回值
    var ret = Constructor.apply(obj, arguments);
    //如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
    return typeof ret === "object" ? ret : obj;
}



