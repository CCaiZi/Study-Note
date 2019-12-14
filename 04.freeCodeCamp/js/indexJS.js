/*
* @Author: Foeveryou
* @Date:   2019-12-11 20:31:21
* @Last Modified by:   Foeveryou
* @Last Modified time: 2019-12-11 21:36:49
*/
var btn = document.getElementById("btn");
var answerDiv = document.getElementById("answerDiv");

var showDiv = function (){
  answerDiv.style.display = "block";          //使ID为answerDiv在页面中显示

  setTimeout(function(){                      //调用setTimeout()函数，删除btn追加的事件
    showFn()
  },500);
}

var showFn = function(){                      //设置btn按钮的删除时间
  btn.removeEventListener("click",showDiv,false);
}

btn.addEventListener("click", showDiv, false);

