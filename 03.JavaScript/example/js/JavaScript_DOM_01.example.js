/*
* @Author: Administrator
* @Date:   2019-11-19 16:37:22
* @Last Modified by:   Administrator
* @Last Modified time: 2019-11-19 17:00:01
*/
function showPic(whitchPic){
  var source = whitchPic.getAttribute("href");
  var placeholder = document.getElementById("placeholder");
  placeholder.setAttribute("src", source);
}
