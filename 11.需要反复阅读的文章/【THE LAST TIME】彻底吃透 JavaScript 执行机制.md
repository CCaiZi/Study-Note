**微信上一篇不错的文章，地址是 : ( <https://mp.weixin.qq.com/s/nQgsEQorv00fr4XqU764bA> )**

---

## 【THE LAST TIME】彻底吃透 JavaScript 执行机制

### 执行 & 运行

首先我们需要声明下，`JavaScript` 的执行和运行是两个不同概念的，**执行，一般依赖于环境**，比如 `node`、浏览器、`Ringo` 等， **`JavaScript` 在不同环境下的执行机制可能并不相同**。而今天我们要讨论的 `Event Loop` 就是 `JavaScript` 的一种执行方式。所以下文我们还会梳理 `node` 的执行方式。**而运行呢，是指`JavaScript` 的解析引擎。这是统一的。**

### 概念梳理

#### 事件循环(Event Loop)

什么是 Event Loop？

其实这个概念还是比较模糊的，因为他必须得结合着运行机制来解释。

`JavaScript` 有一个主线程 `main thread`，和调用栈 call-stack 也称之为执行栈。所有的任务都会放到调用栈中等待主线程来执行。

暂且，我们先理解为上图的大圈圈就是 `Event Loop` 吧！并且，这个圈圈，一直在转圈圈~ 也就是说，`JavaScript` 的 `Event Loop` 是伴随着整个源码文件生命周期的，只要当前 `JavaScript` 在运行中，内部的这个循环就会不断地循环下去，去寻找 `queue` 里面能执行的 `task`。

#### 任务队列(task queue)

`task`，就是任务的意思，我们这里理解为每一个语句就是一个任务

```js
console.log(1);
console.log(2);
```

如上语句，其实就是就可以理解为两个 `task`。

而 `queue` 呢，就是`FIFO`的队列！

所以 `Task Queue` 就是承载任务的队列。而 `JavaScript` 的 `Event Loop` 就是会不断地过来找这个 `queue`，问有没有 `task` 可以运行运行。

#### 同步任务(SyncTask)、异步任务(AsyncTask)

**同步任务说白了就是主线程来执行的时候立即就能执行的代码**，比如:

```js
console.log('this is THE LAST TIME');
console.log('Nealyang');
```

代码在执行到上述 `console` 的时候，就会立即在控制台上打印相应结果。

而所谓的异步任务就是主线程执行到这个 `task` 的时候，"唉！你等会，我现在先不执行，等我 `xxx` 完了以后我再来等你执行" 注意上述我说的是等你来执行。

说白了，**异步任务就是你先去执行别的 `task`，等我这 `xxx` 完之后再往 `Task Queue` 里面塞一个 `task` 的同步任务来等待被执行**

```js
setTimeout(()=>{
  console.log(2)
});
console.log(1);
```

如上述代码，`setTimeout` 就是一个异步任务，主线程去执行的时候遇到 `setTimeout` 发现是一个异步任务，就先注册了一个异步的回调，然后接着执行下面的语句`console.log(1)`,等上面的异步任务等待的时间到了以后，在执行`console.log(2)`。

![JavaScript执行机制](https://mmbiz.qpic.cn/mmbiz_png/udZl15qqib0NPJYm99fCKh9SUq52nkiaF0YZKYdpHN1PcmSictWzLxPJFddfY5M5dEBicZhDicognupcPywsN9ajhibw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

* 主线程自上而下执行所有代码

* 同步任务直接进入到主线程被执行，而异步任务则进入到 `Event Table` 并注册相对应的回调函数

* 异步任务完成后，`Event Table` 会将这个函数移入 `Event Queue`

* 主线程任务执行完了以后，会从`Event Queue`中读取任务，进入到主线程去执行。

* 循环如上

上述动作不断循环，就是我们所说的事件循环(`Event Loop`)。

##### 小试牛刀

```js
ajax({
    url:www.Nealyang.com,
    data:prams,
    success:() => {
        console.log('请求成功!');
    },
    error:()=>{
        console.log('请求失败~');
    }
})
console.log('这是一个同步任务');
```

* `ajax` 请求首先进入到 `Event Table` ，分别注册了`onError`和`onSuccess`回调函数。

* 主线程执行同步任务：`console.log('这是一个同步任务')`;

* 主线程任务执行完毕，看`Event Queue`是否有待执行的 `task`,这里是不断地检查，只要主线程的`task queue`没有任务执行了，主线程就一直在这等着

* `ajax` 执行完毕，将回调函数`push` 到`Event Queue`。（步骤 3、4 没有先后顺序而言）

* 主线程"终于"等到了`Event Queue`里有 `task`可以执行了，执行对应的回调任务。

* 如此往复。

#### 宏任务(MacroTask)、微任务(MicroTask)

`JavaScript` 的任务不仅仅分为同步任务和异步任务，同时从另一个维度，也分为了宏任务(`MacroTask`)和微任务(`MicroTask`)。

先说说 `MacroTask`，所有的同步任务代码都是`MacroTask`（这么说其实不是很严谨，下面解释）,`setTimeout`、`setInterval`、`I/O`、`UI Rendering` 等都是宏任务。

`MicroTask`，为什么说上述不严谨我却还是强调所有的同步任务都是 `MacroTask` 呢，因为我们仅仅需要记住几个 `MicroTask` 即可，排除法！别的都是 `MacroTask`。`MicroTask` 包括：`Process.nextTick`、`Promise.then` `catch` `finally`(注意我不是说 `Promise`)、`MutationObserver`。

### 浏览器环境下的 Event Loop

##### setTimeout、setInterval

###### setTimeout

`setTimeout` 就是等多长时间来执行这个回调函数。`setInterval` 就是每隔多长时间来执行这个回调。

```js
let startTime = new Date().getTime();

setTimeout(()=>{
  console.log(new Date().getTime()-startTime);
},1000);
```

如上代码，顾名思义，就是等 1s 后再去执行 `console`。放到浏览器下去执行，OK，如你所愿就是如此。

但是这次我们在探讨 JavaScript 的执行机制，所以这里我们得探讨下如下代码：

```js
let startTime = new Date().getTime();

console.log({startTime})

setTimeout(()=>{
  console.log(`开始执行回调的相隔时差：${new Date().getTime()-startTime}`);
},1000);

for(let i = 0;i<40000;i++){
  console.log(1)
}
```

![](https://mmbiz.qpic.cn/mmbiz_png/udZl15qqib0NPJYm99fCKh9SUq52nkiaF00ciceJwVnCrQWMG03EE7L4XPZ2be3BAyDeQOBIGE4PibxWiaEicuCsxNAg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

如上运行，setTimeout 的回调函数等到 4.7s 以后才执行!而这时候，我们把 setTimeout 的 1s 延迟给删了

```js
let startTime = new Date().getTime();

console.log({startTime})

setTimeout(()=>{
  console.log(`开始执行回调的相隔时差：${new Date().getTime()-startTime}`);
},0);

for(let i = 0;i<40000;i++){
  console.log(1)
}
```

![](https://mmbiz.qpic.cn/mmbiz_png/udZl15qqib0NPJYm99fCKh9SUq52nkiaF05569ndjl8lmrACkOrXfAVbbSjfmWNbOAx9hrLoMOh4wLC18Wjln8Og/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

结果依然是等到 4.7s 后才执行setTimeout 的回调。貌似 setTimeout 后面的延迟并没有产生任何效果！

其实这么说，又应该回到上面的那张 JavaScript 执行的流程图了。

![](https://mmbiz.qpic.cn/mmbiz_png/udZl15qqib0NPJYm99fCKh9SUq52nkiaF0VDaGDMchSd8wZvSANPTPLoJ2wJ3v3NNiaXfZKHpJvicQ4EPSg5DCI7HA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

`setTimeout`这里就是简单的异步，我们通过上面的图来分析上述代码的一步一步执行情况

* 首先 `JavaScript` 自上而下执行代码

* 遇到遇到赋值语句、以及第一个 `console.log({startTime})` 分别作为一个 `task`，压入到立即执行栈中被执行。

* 遇到 `setTImeout` 是一个异步任务，则注册相应回调函数。（异步函数告诉你，js 你先别急，等 1s 后我再将回调函数：`console.log(xxx)`放到 `Task Queue` 中）

* OK，这时候 `JavaScript` 则接着往下走，遇到了 40000 个 `for` 循环的 `task`，没办法，1s 后都还没执行完。其实这个时候上述的回调已经在`Task Queue` 中了。

* 等所有的立即执行栈中的 `task` 都执行完了，在回头看 `Task Queue` 中的任务，发现异步的回调 `task` 已经在里面了，所以接着执行。

###### setInterval

说完了 `setTimeout`，当然不能错过他的孪生兄弟：`setInterval`。对于执行顺序来说，`setInterval`会每隔指定的时间将注册的函数置入 `Task Queue`，如果前面的任务耗时太久，那么同样需要等待。

这里需要说的是，对于 `setInterval(fn,ms)` 来说，我们制定没 `xx ms`执行一次 `fn`，其实是没 `xx ms`，会有一个`fn` 进入到 `Task Queue` 中。一旦 `setInterval` 的回调函数`fn`执行时间超过了`xx ms`，那么就完全看不出来有时间间隔了。 仔细回味回味，是不是那么回事？