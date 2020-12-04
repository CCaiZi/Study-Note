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

而所谓的异步任务就是主线程执行到这个 `task` 的时候，“唉！你等会，我现在先不执行，等我 `xxx` 完了以后我再来等你执行” 注意上述我说的是等你来执行。

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