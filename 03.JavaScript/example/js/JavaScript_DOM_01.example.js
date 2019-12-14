/*
* @Author: Administrator
* @Date:   2019-11-19 16:37:22
* @Last Modified by:   Foeveryou
* @Last Modified time: 2019-11-20 11:21:17
*/
function showPic(whitchPic){
  var source = whitchPic.getAttribute("href");    //通过 onclick() 事件，获取a标签的href值
  var placeholder = document.getElementById("placeholder"); //获取ID为placeholder的img元素
  var description = document.getElementById("description"); //获取ID为description的p元素
  var text = whitchPic.getAttribute("title"); //通过 onclick() 事件，获取a标签上的title属性值
  placeholder.setAttribute("src", source);
  //通过setAttribute方法，将ID为placeholder元素的src属性值，设置为a标签的href值
  description.firstChild.nodeValue = text;
  //将ID为placeholder元素中，第一个子元素的文本节点的值，修改为a标签上的title属性值
}
